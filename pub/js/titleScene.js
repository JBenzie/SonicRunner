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

		this.load.html('form', 'pub/form.html');

		this.load.audio('title', 'pub/assets/audio/title.mp3');
		this.load.audio('start', 'pub/assets/audio/start.wav');
		this.load.audio("theme", "pub/assets/audio/greenHill.mp3");
		this.load.audio('sonicIntro', 'pub/assets/audio/sonic_intro.wav');
		this.load.audio('tailsIntro', 'pub/assets/audio/tails_intro.wav');
		this.load.audio('werehogIntro', 'pub/assets/audio/werehog_intro.wav');
		this.load.audio('knucklesIntro', 'pub/assets/audio/knuckles_intro.wav');
		this.load.audio('shadowIntro', 'pub/assets/audio/shadow_intro.wav');
		
		// load Google WebFont script
		this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
		
	}

	create() {
		const width = this.game.config.width;
		const height = this.scale.game.config.height;
		const btnYpos = this.game.config.height / 2 + 200;

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
			console.log(`Received highscore: ${data.playerName} - ${data.score}.`);
			self.highscore = data.score;
			self.highscoreText = self.add.text(width / 2 - 210, height / 2 + 250, `HIGHSCORE: ${data.playerName} - ${data.score}`, { fontFamily: 'Orbitron', fontSize: 26, color: '#ffffff', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
		});

		var form = this.add.dom(width / 2 + 165, height / 2 + 215).createFromCache('form');
		form.setDepth(10);
		form.setPerspective(800);
		if (this.game.globalVars.playerName != 'null') {
			let name = form.getChildByName("name");
			name.value = this.game.globalVars.playerName;
		}

		var text = this.add.text(rect.width / 2, height / 2 + 135, 'SELECT A RUNNER', { fontFamily: 'Orbitron', fontSize: 18, color: '#ffffff', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
		
		var btnSonic = this.physics.add.image(rect.x + 150, btnYpos, 'btnSonic').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

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
			this.sound.play('sonicIntro');
			this.game.globalVars.character = 'sonic';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
            this.scene.start('gameScene');
		});
		
		var btnTails = this.physics.add.image(rect.x + 350, btnYpos, 'btnTails').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

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
			this.sound.play('tailsIntro');
			this.game.globalVars.character = 'tails';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
            this.scene.start('gameScene');
		});
		
		var btnWerehog = this.physics.add.image(rect.x + 550, btnYpos, 'btnWerehog').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

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
			this.sound.play('werehogIntro');
			this.game.globalVars.character = 'werehog';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
            this.scene.start('gameScene');
		});
		
		var btnKnuckles = this.physics.add.image(rect.x + 750, btnYpos, 'btnKnuckles').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

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
			this.sound.play('knucklesIntro');
			this.game.globalVars.character = 'knuckles';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
            this.scene.start('gameScene');
		});
		
		var btnShadow = this.physics.add.image(rect.x + 950, btnYpos, 'btnShadow').setScale(.5).setInteractive({ cursor: 'pointer' }).setDepth(6);

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
			this.sound.play('shadowIntro');
			this.game.globalVars.character = 'shadow';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
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
		
	}

}

export default TitleScene;