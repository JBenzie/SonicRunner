class GameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }
    
    init() {
        // initialize game variables
        this.gameOver = false;
    }

    preload() {
        
        this.load.audio("collect", "pub/assets/audio/ring.wav");
        this.load.audio("jump", "pub/assets/audio/jump.wav");
        this.load.audio("die", "pub/assets/audio/die.wav");
        this.load.image("platform", "pub/assets/images/platform/flat1.png");
        this.load.image("frame", "pub/assets/images/sonic_frame.png");
        this.load.image("bg", "pub/assets/images/bg.png");
        this.load.image("spikes", "pub/assets/images/spikes.png");

        // player is a sprite sheet made by 24x48 pixels
        this.load.spritesheet("player", "pub/assets/images/sonicSprite.png", {
            frameWidth: 36,
            frameHeight: 45
        });

        // the coin is a sprite sheet made by 20x20 pixels
        this.load.spritesheet("ring", "pub/assets/images/ringsSprite.png", {
            frameWidth: 16,
            frameHeight: 18
        });

        // the firecamp is a sprite sheet made by 32x58 pixels
        /* this.load.spritesheet("fire", "fire.png", {
            frameWidth: 40,
            frameHeight: 70
        }); */

        // mountains are a sprite sheet made by 512x512 pixels
        this.load.spritesheet("mountain", "pub/assets/images/palm.png", {
            frameWidth: 361,
            frameHeight: 640
        });

    }
    create() {
        // define any objects
        console.log("Gotta go FAST..!");
        var self = this;
        this.socket = io();

        // setting player animation
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 3
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frameRate: 13,
            frames: this.anims.generateFrameNumbers("player", { 
                start: 4, 
                end: 7 }),
            repeat: 2
        });

        this.anims.create({
            key: "die",
            frameRate: 6,
            frames: this.anims.generateFrameNumbers("player", { 
                start: 8, 
                end: 9 }),
            repeat: 0
        });

        // setting coin animation
        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("ring", {
                start: 0,
                end: 7
            }),
            frameRate: 12,
            yoyo: false,
            repeat: -1
        });

        this.anims.create({
            key: "fade",
            frames: this.anims.generateFrameNumbers("ring", {
                start: 8,
                end: 11
            }),
            frameRate: 25,
            yoyo: false,
            repeat: -1
        });

        // setting fire animation
        /* this.anims.create({
            key: "burn",
            frames: this.anims.generateFrameNumbers("fire", {
                start: 0,
                end: 4
            }),
            frameRate: 15,
            repeat: -1
        }); */

        //background
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'bg').setScale(1.25);
        this.frame = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'frame').setScale(1.15);
        this.frame.setDepth(5);

        // group with all active mountains.
        this.mountainGroup = this.add.group();

        // group with all active platforms.
        this.platformGroup = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });

        // platform pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });

        // group with all active coins.
        this.coinGroup = this.add.group({

            // once a coin is removed, it's added to the pool
            removeCallback: function(coin){
                coin.scene.coinPool.add(coin)
            }
        });

        // coin pool
        this.coinPool = this.add.group({

            // once a coin is removed from the pool, it's added to the active coins group
            removeCallback: function(coin){
                coin.scene.coinGroup.add(coin)
            }
        });

        // group with all active firecamps.
        this.spikeGroup = this.add.group({

            // once a firecamp is removed, it's added to the pool
            removeCallback: function(spike){
                spike.scene.spikePool.add(spike)
            }
        });

        // fire pool
        this.spikePool = this.add.group({

            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(spike){
                spike.scene.spikeGroup.add(spike)
            }
        });

        // adding a mountain
        this.addMountains()

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // number of consecutive jumps made by the player so far
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(this.game.config.width, this.game.config.width / 2, this.game.config.height * this.game.gameOptions.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(this.game.gameOptions.playerStartPosition, this.game.config.height * 0.4, "player").setScale(1.25);
        this.player.setSize(this.player.width, 15, true);
        this.player.setGravityY(this.game.gameOptions.playerGravity);
        this.player.setDepth(3);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){

            // play "run" animation if the player is on a platform
            if(!this.player.anims.isPlaying){
                this.player.anims.play("run");
            }
        }, null, this);

        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin){
            coin.anims.play("fade");
            this.sound.play("collect");
            this.tweens.add({
                targets: coin,
                y: coin.y - 100,
                alpha: 0,
                duration: 800,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function(){
                    coin.anims.play("rotate");
                    this.coinGroup.killAndHide(coin);
                    this.coinGroup.remove(coin);
                }
            });

        }, null, this);

        // setting collisions between the player and the fire group
        this.physics.add.overlap(this.player, this.spikeGroup, function(player, spike){

            this.dying = true;
            this.player.anims.play('die');
            this.sound.play("die");
            this.player.setFrame(2);
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);

        }, null, this);

        // checking for input
        this.input.on("pointerdown", this.jump, this);



        // GAME =============================================================================================================

        // camera

        // SCORE ============================================================================================================


        // PLAYERS ==========================================================================================================


        // STARS ============================================================================================================


    }
    update() {
        //constantly running loop
        // game over
        if(this.player.y > this.game.config.height){
            this.scene.start("gameScene");
        }

        this.player.x = this.game.gameOptions.playerStartPosition;

        // recycling platforms
        let minDistance = this.game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = this.game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling coins
        this.coinGroup.getChildren().forEach(function(coin){
            if(coin.x < - coin.displayWidth / 2){
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }
        }, this);

        // recycling fire
        this.spikeGroup.getChildren().forEach(function(spike){
            if(spike.x < - spike.displayWidth / 2){
                this.spikeGroup.killAndHide(spike);
                this.spikeGroup.remove(spike);
            }
        }, this);

        // recycling mountains
        this.mountainGroup.getChildren().forEach(function(mountain){
            if(mountain.x < - mountain.displayWidth){
                let rightmostMountain = this.getRightmostMountain();
                mountain.x = rightmostMountain + Phaser.Math.Between(100, 350);
                mountain.y = this.game.config.height + Phaser.Math.Between(0, 100);
                mountain.setFrame(Phaser.Math.Between(0, 3))
                if(Phaser.Math.Between(0, 1)){
                    mountain.setDepth(1);
                }
            }
        }, this);

        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(this.game.gameOptions.platformSizeRange[0], this.game.gameOptions.platformSizeRange[1]);
            let platformRandomHeight = this.game.gameOptions.platformHeighScale * Phaser.Math.Between(this.game.gameOptions.platformHeightRange[0], this.game.gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = this.game.config.height * this.game.gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = this.game.config.height * this.game.gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, this.game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }

    // adding mountains
    addMountains(){
        let rightmostMountain = this.getRightmostMountain();
        if(rightmostMountain < this.game.config.width * 3){
            let mountain = this.physics.add.sprite(rightmostMountain + Phaser.Math.Between(100, 350), this.game.config.height + Phaser.Math.Between(0, 100), "mountain").setScale(0.75);
            mountain.setOrigin(0.5, 1);
            mountain.body.setVelocityX(this.game.gameOptions.mountainSpeed * -1)
            this.mountainGroup.add(mountain);
            if(Phaser.Math.Between(0, 1)){
                mountain.setDepth(1);
            }
            mountain.setFrame(Phaser.Math.Between(0, 3))
            this.addMountains()
        }
    }

    // getting rightmost mountain x position
    getRightmostMountain(){
        let rightmostMountain = -300;
        this.mountainGroup.getChildren().forEach(function(mountain){
            rightmostMountain = Math.max(rightmostMountain, mountain.x);
        })
        return rightmostMountain;
    }

    // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY){
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 100, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(this.game.gameOptions.platformSpeedRange[0], this.game.gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(this.game.gameOptions.spawnRange[0], this.game.gameOptions.spawnRange[1]);

        // if this is not the starting platform...
        if(this.addedPlatforms > 1){

            // is there a coin over the platform?
            if(Phaser.Math.Between(1, 100) <= this.game.gameOptions.coinPercent){
                if(this.coinPool.getLength()){
                    let coin = this.coinPool.getFirst();
                    coin.x = posX;
                    coin.y = posY - 96;
                    coin.alpha = 1;
                    coin.active = true;
                    coin.visible = true;
                    this.coinPool.remove(coin);
                }
                else{
                    let coin = this.physics.add.sprite(posX, posY - 96, "coin").setScale(1.55);
                    coin.setImmovable(true);
                    coin.setVelocityX(platform.body.velocity.x);
                    coin.anims.play("rotate");
                    coin.setDepth(2);
                    this.coinGroup.add(coin);
                }
            }

            // is there a fire over the platform?
            if(Phaser.Math.Between(1, 100) <= this.game.gameOptions.spikePercent){
                if(this.spikePool.getLength()){
                    let spike = this.spikePool.getFirst();
                    spike.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                    spike.y = posY - 46;
                    spike.alpha = 1;
                    spike.active = true;
                    spike.visible = true;
                    this.spikePool.remove(spike);
                }
                else{
                    let spike = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 59, "spikes");
                    spike.setImmovable(true);
                    spike.setVelocityX(platform.body.velocity.x);
                    spike.setSize(8, 2, true)
                    //spike.anims.play("burn");
                    spike.setDepth(1);
                    this.spikeGroup.add(spike);
                }
            }
        }
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump(){
        if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < this.game.gameOptions.jumps))){
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(this.game.gameOptions.jumpForce * -1);
            this.playerJumps ++;

            // stops animation
            this.player.play('jump');
            this.sound.play('jump');
        }
    }

}

export default GameScene;