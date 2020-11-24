class TitleScene extends Phaser.Scene {

	constructor() {
		super({key:'titleScene'});
	}

	preload() {
		var width = this.game.config.width;
		var height = this.game.config.height;
		
		var loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px monospace',
				fill: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);
		var percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 5,
			text: '0%',
			style: {
				font: '18px monospace',
				fill: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);
	  
		this.load.on('progress', function (value) {
		  percentText.setText(parseInt(value * 100) + '%');
		});
	  
		this.load.on('fileprogress', function (file) {
	  
		});
	  
		this.load.on('complete', function () {
		  console.log('complete');
		  loadingText.destroy();
		  percentText.destroy();
		});

		this.load.image('frame', '/pub/assets/images/sonic_frame.png');
		this.load.image("titleBg", "pub/assets/images/titleBg.png");
		this.load.image('start', 'pub/assets/images/start.png');
		this.load.image('btnSonic', 'pub/assets/images/btnSonic.png');
		this.load.image('btnTails', 'pub/assets/images/btnTails.png');
		this.load.image('btnWerehog', 'pub/assets/images/btnWerehog.png');
		this.load.image('btnKnuckles', 'pub/assets/images/btnKnuckles.png');
		this.load.image('btnShadow', 'pub/assets/images/btnShadow.png');
		//this.load.bitmapFont('soupofjustice', 'pub/assets/fonts/soupofjustice.png', 'pub/assets/fonts/soupofjustice.fnt');

		this.load.audio('title', 'pub/assets/audio/title.mp3');
		this.load.audio('start', 'pub/assets/audio/start.wav');
		this.load.audio("theme", "pub/assets/audio/greenHill.mp3");
		
		// load Google WebFont script
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
		
	}

	create() {
		const width = this.game.config.width;
        const height = this.scale.game.config.height;

		var self = this;
		this.socket = io();
		this.highscore;
		this.socket.emit('getLeaderboard');
		WebFont.load({
            google: {
                families: [ 'Play', 'Orbitron', 'Russo One' ]
            },
            active: function ()
            {
                }
		});		
		
		//background
        this.titleBg = this.add.image(width / 2, height / 2, 'titleBg').setScale(.85);
        this.frame = this.add.image(width / 2, height / 2, 'frame').setScale(1.15);
		this.frame.setDepth(5);
		var rect = this.titleBg.getBounds();
		this.socket.on('leaderboardUpdate', function(data) {
			console.log(`Received highscore: ${data.highscore}.`);
			self.highscore = data.highscore;
			self.highscoreText = self.add.text(width / 2 - 110, height / 2 + 250, `HIGHSCORE: ${self.highscore}`, { fontFamily: 'Orbitron', fontSize: 26, color: '#ffffff', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
		});
		
		var text = this.add.text(rect.width / 2, height / 2 + 75, 'SELECT A RUNNER', { fontFamily: 'Orbitron', fontSize: 18, color: '#ffffff', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
		
		var btnSonic = this.physics.add.image(rect.x + 150, this.game.config.height / 2 + 150, 'btnSonic').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnSonic.on('pointerover', function(pointer) {
			btnSonic.setScale(.6);
		});
		btnSonic.on('pointerout', function(pointer) {
			btnSonic.setScale(.5);
		});

		btnSonic.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			this.game.globalVars.character = 'sonic';
            this.scene.start('gameScene');
		});
		
		var btnTails = this.physics.add.image(rect.x + 350, this.game.config.height / 2 + 150, 'btnTails').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnTails.on('pointerover', function(pointer) {
			btnTails.setScale(.6);
		});
		btnTails.on('pointerout', function(pointer) {
			btnTails.setScale(.5);
		});

		btnTails.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			this.game.globalVars.character = 'tails';
            this.scene.start('gameScene');
		});
		
		var btnWerehog = this.physics.add.image(rect.x + 550, this.game.config.height / 2 + 150, 'btnWerehog').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnWerehog.on('pointerover', function(pointer) {
			btnWerehog.setScale(.6);
		});
		btnWerehog.on('pointerout', function(pointer) {
			btnWerehog.setScale(.5);
		});

		btnWerehog.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			this.game.globalVars.character = 'werehog';
            this.scene.start('gameScene');
		});
		
		var btnKnuckles = this.physics.add.image(rect.x + 750, this.game.config.height / 2 + 150, 'btnKnuckles').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnKnuckles.on('pointerover', function(pointer) {
			btnKnuckles.setScale(.6);
		});
		btnKnuckles.on('pointerout', function(pointer) {
			btnKnuckles.setScale(.5);
		});

		btnKnuckles.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			this.game.globalVars.character = 'knuckles';
            this.scene.start('gameScene');
		});
		
		var btnShadow = this.physics.add.image(rect.x + 950, this.game.config.height / 2 + 150, 'btnShadow').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnShadow.on('pointerover', function(pointer) {
			btnShadow.setScale(.6);
		});
		btnShadow.on('pointerout', function(pointer) {
			btnShadow.setScale(.5);
		});

		btnShadow.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			this.game.globalVars.character = 'shadow';
            this.scene.start('gameScene');
        });

		// background music
		if(this.music){
			this.music.stop();
		}
		var titleMusic = this.sound.add("title", { volume: 0.5 });
		titleMusic.play();

		this.music = this.sound.add("theme", { volume: 0.5 });
        this.music.loop = true;
		
/* 		var startBtn = this.physics.add.image(width / 2, height / 2 + 150 , 'start').setScale(.75).setInteractive({ cursor: 'pointer' });

		startBtn.on('pointerover', function(pointer) {
			startBtn.setScale(.85);
		});
		startBtn.on('pointerout', function(pointer) {
			startBtn.setScale(.75);
		});

		startBtn.on('pointerdown', () => {
			//this.sound.play('click');
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
            this.scene.start('gameScene');
        }); */
	}

}

export default TitleScene;