class GameScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }
    
    init() {
        // initialize game variables
        this.gameOver = false;
        this.score = 0;
        this.highscore;
        this.playerName = this.game.globalVars.playerName;
        this.character = this.game.globalVars.character;
        console.log(`Character: ${this.character}`);

        if(this.playerName == 'scarlett' || this.playerName == 'Scarlett' || this.playerName == 'wyatt' || this.playerName == 'Wyatt'){
            this.game.gameOptions.spikePercent = 0;
            this.game.gameOptions.ringPercent = 100;
        } else if (this.playerName == 'eggman' || this.playerName == 'Eggman' || this.playerName == 'robotnik' || this.playerName == 'Robotnik') {
            this.game.gameOptions.spikePercent = 100;
            this.game.gameOptions.ringPercent = 0;
        }
    }

    preload() {
        // load assets
        this.load.audio("collect", "pub/assets/audio/ring.wav");
        this.load.audio("jump", "pub/assets/audio/jump.wav");
        this.load.audio("die", "pub/assets/audio/die.wav");
        this.load.audio("spikes", "pub/assets/audio/spikes.wav");
        this.load.audio("highscore1", "pub/assets/audio/highscore1.wav");
        this.load.audio("highscore2", "pub/assets/audio/highscore2.wav");
        this.load.image("platform", "pub/assets/images/platform/platform.png");
        this.load.image("frame", "pub/assets/images/sonic_frame.png");
        this.load.image("bg", "pub/assets/images/greenHill.png");
        this.load.image("spikes", "pub/assets/images/spikes.png");
        this.load.image("tree", "pub/assets/images/palm.png");
        this.load.image("totem", "pub/assets/images/totem.png");
        this.load.image("flower", "pub/assets/images/sunflower.png");
        this.load.image("home", "pub/assets/images/home.png");

        // load Google WebFont script
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        switch (this.character) {
            case 'sonic':
                // load sonic spritesheet
                this.load.spritesheet("sonic", "pub/assets/images/sonicSprite.png", {
                    frameWidth: 36,
                    frameHeight: 45
                });
                break;

            case 'tails':
                // load tails spritesheet
                this.load.spritesheet("tails", "pub/assets/images/tails.png", {
                    frameWidth: 44,
                    frameHeight: 45
                });
                break;

            case 'werehog':
                // load sonic the werehog spritesheet
                this.load.spritesheet("werehog", "pub/assets/images/werehog.png", {
                    frameWidth: 51,
                    frameHeight: 51
                });
                break;

            case 'knuckles':
                // load knuckles spritesheet
                this.load.spritesheet("knuckles", "pub/assets/images/knuckles.png", {
                    frameWidth: 36,
                    frameHeight: 45
                });
                break;

            case 'shadow':
                // load shadow spritesheet
                this.load.spritesheet("shadow", "pub/assets/images/shadow.png", {
                    frameWidth: 56,
                    frameHeight: 45
                });
                break;
        
            default:
                // load sonic spritesheet
                this.load.spritesheet("sonic", "pub/assets/images/sonicSprite.png", {
                    frameWidth: 36,
                    frameHeight: 45
                });
                break;
        }

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

        switch (this.character) {
            case 'sonic':
                // setting sonic animation
                this.anims.create({
                    key: "run",
                    frames: this.anims.generateFrameNumbers("sonic", {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 15,
                    repeat: -1
                });

                this.anims.create({
                    key: "jump",
                    frameRate: 13,
                    frames: this.anims.generateFrameNumbers("sonic", { 
                        start: 4, 
                        end: 7 }),
                    repeat: 2
                });

                this.anims.create({
                    key: "die",
                    frameRate: 10,
                    frames: this.anims.generateFrameNumbers("sonic", { 
                        start: 8, 
                        end: 8 }),
                    repeat: 0
                });
                break;

            case 'tails':
                // setting tails animation
                this.anims.create({
                    key: "run",
                    frames: this.anims.generateFrameNumbers("tails", {
                        start: 0,
                        end: 4
                    }),
                    frameRate: 15,
                    repeat: -1
                });

                this.anims.create({
                    key: "jump",
                    frameRate: 13,
                    frames: this.anims.generateFrameNumbers("tails", { 
                        start: 5, 
                        end: 9 }),
                    repeat: 2
                });

                this.anims.create({
                    key: "die",
                    frameRate: 10,
                    frames: this.anims.generateFrameNumbers("tails", { 
                        start: 10, 
                        end: 10 }),
                    repeat: 0
                });
                break;

            case 'werehog':
                // setting sonic the werehog animation
                this.anims.create({
                    key: "run",
                    frames: this.anims.generateFrameNumbers("werehog", {
                        start: 0,
                        end: 4
                    }),
                    frameRate: 15,
                    repeat: -1
                });

                this.anims.create({
                    key: "jump",
                    frameRate: 20,
                    frames: this.anims.generateFrameNumbers("werehog", { 
                        start: 5, 
                        end: 15 }),
                    repeat: 0
                });

                this.anims.create({
                    key: "die",
                    frameRate: 10,
                    frames: this.anims.generateFrameNumbers("werehog", { 
                        start: 16, 
                        end: 16 }),
                    repeat: 0
                });
                break;

            case 'knuckles':
                // setting knuckles animation
                this.anims.create({
                    key: "run",
                    frames: this.anims.generateFrameNumbers("knuckles", {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 18,
                    repeat: -1
                });

                this.anims.create({
                    key: "jump",
                    frameRate: 13,
                    frames: this.anims.generateFrameNumbers("knuckles", { 
                        start: 4, 
                        end: 7 }),
                    repeat: 2
                });

                this.anims.create({
                    key: "die",
                    frameRate: 10,
                    frames: this.anims.generateFrameNumbers("knuckles", { 
                        start: 8, 
                        end: 8 }),
                    repeat: 0
                });
                break;

            case 'shadow':
                // setting shadow animation
                this.anims.create({
                    key: "run",
                    frames: this.anims.generateFrameNumbers("shadow", {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 15,
                    repeat: -1
                });

                this.anims.create({
                    key: "jump",
                    frameRate: 13,
                    frames: this.anims.generateFrameNumbers("shadow", { 
                        start: 4, 
                        end: 7 }),
                    repeat: 2
                });

                this.anims.create({
                    key: "die",
                    frameRate: 10,
                    frames: this.anims.generateFrameNumbers("shadow", { 
                        start: 8, 
                        end: 8 }),
                    repeat: 0
                });
                break;
        
            default:
                this.anims.create({
                    key: "run",
                    frames: this.anims.generateFrameNumbers("sonic", {
                        start: 0,
                        end: 3
                    }),
                    frameRate: 15,
                    repeat: -1
                });

                this.anims.create({
                    key: "jump",
                    frameRate: 13,
                    frames: this.anims.generateFrameNumbers("sonic", { 
                        start: 4, 
                        end: 7 }),
                    repeat: 2
                });

                this.anims.create({
                    key: "die",
                    frameRate: 10,
                    frames: this.anims.generateFrameNumbers("sonic", { 
                        start: 8, 
                        end: 8 }),
                    repeat: 0
                });
                break;
        }

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

        //ring counter
        var frameRect = this.frame.getBounds();
        this.ring = this.physics.add.sprite(frameRect.x + 225, frameRect.y + 150, "ring").setScale(1.65);
        this.ring.anims.play('rotate');
        this.ring.setDepth(6);
        
        WebFont.load({
            google: {
                families: [ 'Atomic Age', 'Orbitron', 'Russo One' ]
            },
            active: function ()
            {
                }
        });
        
        var ringRect = this.ring.getBounds();
        this.scoreText = this.add.text(frameRect.x + 250, ringRect.y, this.score, { fontFamily: 'Orbitron', fontSize: 26, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
        this.highscoreText = this.add.text(frameRect.x + frameRect.width - 400, ringRect.y, 'HIGHSCORE: 0', { fontFamily: 'Orbitron', fontSize: 18, color: '#ffffff', align: 'right' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
        this.socket.emit('setPlayerName', { playerName: this.playerName });
        this.socket.emit('getLeaderboard');
        this.socket.on('leaderboardUpdate', function(data){
            console.log(`Received leaderboard update: ${data.playerName} - ${data._id}.`);
            self.highscoreText.setText(`HIGHSCORE: ${data._id}`);
            self.highscore = data._id;
        });
        var homeBtn = this.physics.add.image(frameRect.x + frameRect.width - 260, ringRect.y + 50, 'home').setScale(0.07).setDepth(6).setInteractive({ cursor: 'pointer' });
        homeBtn.on('pointerover', function(pointer) {
			homeBtn.setScale(.09);
		});
		homeBtn.on('pointerout', function(pointer) {
			homeBtn.setScale(.07);
		});

		homeBtn.on('pointerdown', () => {
            this.socket.emit('gameOver', { playerName: this.playerName, score: this.score, id: this.socket.id });
            console.log(`Home button pressed - sending game data: ${this.playerName}, ${this.score}.`);
            if (this.score > this.highscore)
            {
                this.sound.play("highscore1");
            }
            location.reload();
		});

        // group with all active trees.
        this.treeGroup = this.add.group();

        // group with all active sunflowers.
        this.flowerGroup = this.add.group({
            removeCallback: function(flower){
                flower.scene.flowerPool.add(flower);
            }
        });

        // flower pool
        this.flowerPool = this.add.group({
            removeCallback: function(flower){
                flower.scene.flowerGroup.add(flower);
            }
        });

        // group with all active totems.
        this.totemGroup = this.add.group();

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

        // group with all active spikes.
        this.spikeGroup = this.add.group({

            // once a spike is removed, it's added to the pool
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
        this.player = this.physics.add.sprite(this.game.gameOptions.playerStartPosition, this.game.config.height * 0.4, this.character).setScale(1.25);
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
                this.score ++;
                this.scoreText.setText(this.score);
                // this.socket.emit('scoreUpdate', { playerName: this.playerName, score: this.score });
                // console.log(`Sending score update: ${this.playerName} - ${this.score}.`);
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
            this.socket.emit('gameOver', { playerName: this.playerName, score: this.score, id: this.socket.id });
            console.log(`Game over. Sending score update: ${this.playerName} - ${this.score}.`);
            if (this.score > this.highscore)
            {
                this.sound.play("highscore1");
            }
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

        // recycling flower
        this.flowerGroup.getChildren().forEach(function(flower){
            if(flower.x < - flower.displayWidth / 2){
                this.flowerGroup.killAndHide(flower);
                this.flowerGroup.remove(flower);
            }
        }, this);

        // recycling trees
        this.treeGroup.getChildren().forEach(function(tree){
            if(tree.x < - tree.displayWidth){
                let rightmostTree = this.getRightmostTree();
                tree.x = rightmostTree + Phaser.Math.Between(100, 350);
                tree.y = this.game.config.height + Phaser.Math.Between(0, 100);
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
        if(rightmostTree < this.game.config.width * 5){
            let tree = this.physics.add.sprite(rightmostTree + Phaser.Math.Between(100, 350), this.game.config.height + Phaser.Math.Between(0, 100), "tree").setScale(0.75); //change to vary tree size
            tree.setOrigin(0.5, 1);
            tree.body.setVelocityX(this.game.gameOptions.treeSpeed * -1)
            this.treeGroup.add(tree);
            if(Phaser.Math.Between(0, 1)){
                tree.setDepth(1);
            }
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
            platform.setDepth(3);
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
            platform.setDepth(3);
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
                    spike.setDepth(2);
                    spike.setSize(40, 23, true);
                    this.spikePool.remove(spike);
                }
                else{
                    let spike = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(25, platformWidth - 25), posY - 45, "spikes").setScale(1.05);
                    spike.setImmovable(true);
                    spike.setVelocityX(platform.body.velocity.x);
                    spike.setSize(40, 23, true)
                    //spike.anims.play("burn");
                    spike.setDepth(2);
                    this.spikeGroup.add(spike);
                }
            }

            // is there a flower over the platform?
            if(Phaser.Math.Between(1, 100) <= this.game.gameOptions.flowerPercent){
                if(this.flowerPool.getLength()){
                    let flower = this.flowerPool.getFirst();
                    flower.x = posX - platformWidth / 2 + Phaser.Math.Between(25, platformWidth - 16);
                    flower.y = posY - 65;
                    flower.alpha = 1;
                    flower.active = true;
                    flower.visible = true;
                    flower.setDepth(1);
                    this.flowerPool.remove(flower);
                }
                else{
                    let flower = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(25, platformWidth - 16), posY - 65, "flower").setScale(1);
                    flower.setImmovable(true);
                    flower.setVelocityX(platform.body.velocity.x);
                    flower.setDepth(1);
                    this.flowerGroup.add(flower);
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