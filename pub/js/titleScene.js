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
		//this.load.bitmapFont('soupofjustice', 'pub/assets/fonts/soupofjustice.png', 'pub/assets/fonts/soupofjustice.fnt');

		this.load.audio('title', 'pub/assets/audio/title.mp3');
		this.load.audio('start', 'pub/assets/audio/start.wav');
		this.load.audio("theme", "pub/assets/audio/greenHill.mp3");
		//this.load.audio('click', 'pub/assets/audio/zapThreeToneUp.mp3');
		
	}

	create() {
		
		// background music
		var titleMusic = this.sound.add("title", { volume: 0.5 });
		titleMusic.play();

		this.music = this.sound.add("theme", { volume: 0.5 });
        this.music.loop = true;

        const width = this.game.config.width;
        const height = this.scale.game.config.height;
	    
		//background
        this.titleBg = this.add.image(width / 2, height / 2, 'titleBg').setScale(.85);
        this.frame = this.add.image(width / 2, height / 2, 'frame').setScale(1.15);
		this.frame.setDepth(5);
		
		var startBtn = this.physics.add.image(width / 2, height / 2 + 150 , 'start').setScale(.75).setInteractive({ cursor: 'pointer' });
		
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

        });
	}

}

export default TitleScene;