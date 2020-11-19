class GameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }
    
    init() {
        // initialize game variables
        this.gameOver = false;
    }

    preload() {
        // load assets
        this.load.audio("collect", "pub/assets/audio/ring.wav");
        this.load.audio("jump", "pub/assets/audio/jump.wav");
        this.load.audio("die", "pub/assets/audio/die.wav");
        this.load.audio("spikes", "pub/assets/audio/spikes.wav");
        this.load.image("platform", "pub/assets/images/platform/platform.png");
        this.load.image("frame", "pub/assets/images/sonic_frame.png");
        this.load.image("bg", "pub/assets/images/greenHill.png");
        this.load.image("spikes", "pub/assets/images/spikes.png");
        this.load.image("tree", "pub/assets/images/palm.png");

        // load player spritesheet
        this.load.spritesheet("player", "pub/assets/images/sonicSprite.png", {
            frameWidth: 36,
            frameHeight: 45
        });

        // load ring spritesheet
        this.load.spritesheet("ring", "pub/assets/images/ringsSprite.png", {
            frameWidth: 16,
            frameHeight: 18
        });

    }
    create() {
        // define any objects
        console.log("GOTTA GO FAST..!");
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
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("player", { 
                start: 8, 
                end: 9 }),
            repeat: 0
        });

        // setting ring animation
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

        //background
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'bg').setScale(1);
        this.frame = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'frame').setScale(1.15);
        this.frame.setDepth(5);

        // group with all active trees.
        this.treeGroup = this.add.group();

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

        // group with all active rings.
        this.ringGroup = this.add.group({

            // once a ring is removed, it's added to the pool
            removeCallback: function(ring){
                ring.scene.ringPool.add(ring)
            }
        });

        // ring pool
        this.ringPool = this.add.group({

            // once a ring is removed from the pool, it's added to the active rings group
            removeCallback: function(ring){
                ring.scene.ringGroup.add(ring)
            }
        });

        // group with all active spikecamps.
        this.spikeGroup = this.add.group({

            // once a spikecamp is removed, it's added to the pool
            removeCallback: function(spike){
                spike.scene.spikePool.add(spike)
            }
        });

        // spike pool
        this.spikePool = this.add.group({

            // once a spike is removed from the pool, it's added to the active spike group
            removeCallback: function(spike){
                spike.scene.spikeGroup.add(spike)
            }
        });

        // adding a tree
        this.addTrees()

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

        // setting collisions between the player and the ring group
        var ringPlaying = false;
        this.physics.add.overlap(this.player, this.ringGroup, function(player, ring){
            if (ringPlaying == false){
                this.sound.play("collect");
                ringPlaying = true;
            }
            ring.anims.play("fade");
            this.tweens.add({
                targets: ring,
                y: ring.y - 100,
                alpha: 0,
                duration: 800,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function(){
                    ring.anims.play("rotate");
                    this.ringGroup.killAndHide(ring);
                    this.ringGroup.remove(ring);
                    ringPlaying = false;
                }
            });
        }, null, this);

        // setting collisions between the player and the spike group
        var spikesPlaying = false;
        this.physics.add.overlap(this.player, this.spikeGroup, function(player, spike){
            if (spikesPlaying == false) {
                this.sound.play('spikes');
                spikesPlaying = true;
            }
            this.dying = true;
            this.player.anims.play('die');
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);
        }, null, this);

        // checking for input
        this.input.on("pointerdown", this.jump, this);

    }
    update() {
        //constantly running loop
        // game over
        if(this.player.y > this.game.config.height){
            this.sound.play('die');
            this.socket.disconnect();
            this.scene.restart();
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

        // recycling rings
        this.ringGroup.getChildren().forEach(function(ring){
            if(ring.x < - ring.displayWidth / 2){
                this.ringGroup.killAndHide(ring);
                this.ringGroup.remove(ring);
            }
        }, this);

        // recycling spike
        this.spikeGroup.getChildren().forEach(function(spike){
            if(spike.x < - spike.displayWidth / 2){
                this.spikeGroup.killAndHide(spike);
                this.spikeGroup.remove(spike);
            }
        }, this);

        // recycling trees
        this.treeGroup.getChildren().forEach(function(tree){
            if(tree.x < - tree.displayWidth){
                let rightmostTree = this.getRightmostTree();
                tree.x = rightmostTree + Phaser.Math.Between(100, 350);
                tree.y = this.game.config.height + Phaser.Math.Between(0, 100);
                tree.setFrame(Phaser.Math.Between(0, 3))
                if(Phaser.Math.Between(0, 1)){
                    tree.setDepth(1);
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

    // adding trees
    addTrees(){
        let rightmostTree = this.getRightmostTree();
        if(rightmostTree < this.game.config.width * 3){
            let tree = this.physics.add.sprite(rightmostTree + Phaser.Math.Between(100, 350), this.game.config.height + Phaser.Math.Between(0, 100), "tree").setScale(0.75);
            tree.setOrigin(0.5, 1);
            tree.body.setVelocityX(this.game.gameOptions.treeSpeed * -1)
            this.treeGroup.add(tree);
            if(Phaser.Math.Between(0, 1)){
                tree.setDepth(1);
            }
            tree.setFrame(Phaser.Math.Between(0, 3))
            this.addTrees()
        }
    }

    // getting rightmost tree x position
    getRightmostTree(){
        let rightmostTree = -300;
        this.treeGroup.getChildren().forEach(function(tree){
            rightmostTree = Math.max(rightmostTree, tree.x);
        })
        return rightmostTree;
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
            platform = this.add.tileSprite(posX, posY, platformWidth, 78, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(this.game.gameOptions.platformSpeedRange[0], this.game.gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(this.game.gameOptions.spawnRange[0], this.game.gameOptions.spawnRange[1]);

        // if this is not the starting platform...
        if(this.addedPlatforms > 1){

            // is there a ring over the platform?
            if(Phaser.Math.Between(1, 100) <= this.game.gameOptions.ringPercent){
                if(this.ringPool.getLength()){
                    let ring = this.ringPool.getFirst();
                    ring.x = posX;
                    ring.y = posY - 96;
                    ring.alpha = 1;
                    ring.active = true;
                    ring.visible = true;
                    ring.setSize(16, 18, true);
                    this.ringPool.remove(ring);
                }
                else{
                    let ring = this.physics.add.sprite(posX, posY - 96, "ring").setScale(1.55);
                    ring.setSize(16, 18, true);
                    ring.setImmovable(true);
                    ring.setVelocityX(platform.body.velocity.x);
                    ring.anims.play("rotate");
                    ring.setDepth(2);
                    this.ringGroup.add(ring);
                }
            }

            // is there a spike over the platform?
            if(Phaser.Math.Between(1, 100) <= this.game.gameOptions.spikePercent){
                if(this.spikePool.getLength()){
                    let spike = this.spikePool.getFirst();
                    spike.x = posX - platformWidth / 2 + Phaser.Math.Between(25, platformWidth - 25);
                    spike.y = posY - 45;
                    spike.alpha = 1;
                    spike.active = true;
                    spike.visible = true;
                    spike.setSize(40, 23, true);
                    this.spikePool.remove(spike);
                }
                else{
                    let spike = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(25, platformWidth - 25), posY - 45, "spikes").setScale(1.05);
                    spike.setImmovable(true);
                    spike.setVelocityX(platform.body.velocity.x);
                    spike.setSize(40, 23, true)
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