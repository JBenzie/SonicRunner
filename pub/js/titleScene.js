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
		this.load.image("bg", "pub/assets/images/greenHill.png");

		//this.load.bitmapFont('soupofjustice', 'pub/assets/fonts/soupofjustice.png', 'pub/assets/fonts/soupofjustice.fnt');

		//this.load.audio('theme', 'pub/assets/audio/Good-Morning-Doctor-Weird.mp3');
		//this.load.audio('click', 'pub/assets/audio/zapThreeToneUp.mp3');
		
	}

	create() {
		
		// background music
		//var music = this.sound.add('theme', { volume: 0.25 });
		//music.loop = true;
        //music.play();

	    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const width = this.scale.width;
        const height = this.scale.height;
	    
		//background
        this.bg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'bg').setScale(1);
        this.frame = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'frame').setScale(1.15);
        this.frame.setDepth(5);
		
		this.input.once('pointerdown', () => {
			//this.sound.play('click');
            this.scene.start('gameScene');

        });
	}

}

export default TitleScene;