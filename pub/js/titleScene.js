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
		this.load.image('btnSonic', 'pub/assets/images/sonic_image.png');
		this.load.image('btnTails', 'pub/assets/images/tails_image.png');
		this.load.image('btnWerehog', 'pub/assets/images/werehog_image.png');
		this.load.image('btnKnuckles', 'pub/assets/images/knuckles_image.png');
		this.load.image('btnShadow', 'pub/assets/images/shadow_image.png');
		this.load.image('btnAmy', 'pub/assets/images/amyrose_image.png');
		this.load.image('btnSilver', 'pub/assets/images/silver_image.png');
		this.load.image('btnSticks', 'pub/assets/images/sticks_image.png');

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
		const btnYpos = this.game.config.height / 2 + 210;

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
			self.highscoreText = self.add.text(width / 2 - 210, height / 2 + 275, `HIGHSCORE: ${data.playerName} - ${data.score}`, { fontFamily: 'Orbitron', fontSize: 26, color: '#ffffff', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
		});

		var form = this.add.dom(660, 565).createFromCache('form');
		form.setDepth(10);
		form.setPerspective(800);
		if (this.game.globalVars.playerName != 'null') {
			let name = form.getChildByName("name");
			name.value = this.game.globalVars.playerName;
		}

		var text = this.add.text(rect.width / 2, height / 2 + 120, 'SELECT A RUNNER', { fontFamily: 'Orbitron', fontSize: 18, color: '#ffffff', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(6);
		
		var btnSonic = this.physics.add.image(rect.x + 100, btnYpos, 'btnSonic').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnSonic.on('pointerover', function(pointer) {
			btnSonic.setScale(.6);
		});
		btnSonic.on('pointerout', function(pointer) {
			btnSonic.setScale(.4);
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
		
		var btnTails = this.physics.add.image(rect.x + 235, btnYpos, 'btnTails').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnTails.on('pointerover', function(pointer) {
			btnTails.setScale(.6);
		});
		btnTails.on('pointerout', function(pointer) {
			btnTails.setScale(.4);
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
		
		var btnWerehog = this.physics.add.image(rect.x + 370, btnYpos, 'btnWerehog').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnWerehog.on('pointerover', function(pointer) {
			btnWerehog.setScale(.6);
		});
		btnWerehog.on('pointerout', function(pointer) {
			btnWerehog.setScale(.4);
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
		
		var btnKnuckles = this.physics.add.image(rect.x + 505, btnYpos, 'btnKnuckles').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnKnuckles.on('pointerover', function(pointer) {
			btnKnuckles.setScale(.6);
		});
		btnKnuckles.on('pointerout', function(pointer) {
			btnKnuckles.setScale(.4);
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
		
		var btnShadow = this.physics.add.image(rect.x + 640, btnYpos, 'btnShadow').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnShadow.on('pointerover', function(pointer) {
			btnShadow.setScale(.6);
		});
		btnShadow.on('pointerout', function(pointer) {
			btnShadow.setScale(.4);
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
		
		var btnAmy = this.physics.add.image(rect.x + 775, btnYpos, 'btnAmy').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnAmy.on('pointerover', function(pointer) {
			btnAmy.setScale(.6);
		});
		btnAmy.on('pointerout', function(pointer) {
			btnAmy.setScale(.4);
		});

		btnAmy.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			//this.sound.play('shadowIntro');
			this.game.globalVars.character = 'amy';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
            this.scene.start('gameScene');
		});
		
		var btnSilver = this.physics.add.image(rect.x + 910, btnYpos, 'btnSilver').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnSilver.on('pointerover', function(pointer) {
			btnSilver.setScale(.6);
		});
		btnSilver.on('pointerout', function(pointer) {
			btnSilver.setScale(.4);
		});

		btnSilver.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			//this.sound.play('shadowIntro');
			this.game.globalVars.character = 'silver';
			let name = form.getChildByName("name");
			if(name.value != "") {
				this.game.globalVars.playerName = name.value;
				console.log(`username: ${name.value}`);
			} else {
				this.game.globalVars.playerName = 'Robotnik';
			}
            this.scene.start('gameScene');
		});
		
		var btnSticks = this.physics.add.image(rect.x + 1045, btnYpos, 'btnSticks').setScale(.4).setInteractive({ cursor: 'pointer' }).setDepth(6);

		btnSticks.on('pointerover', function(pointer) {
			btnSticks.setScale(.6);
		});
		btnSticks.on('pointerout', function(pointer) {
			btnSticks.setScale(.4);
		});

		btnSticks.on('pointerdown', () => {
			this.sound.play('start');
			titleMusic.stop();
			this.music.play();
			//this.sound.play('shadowIntro');
			this.game.globalVars.character = 'sticks';
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