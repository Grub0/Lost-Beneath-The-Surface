
BasicGame.Preloader = function (game) {

	this.bck = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		this.bck = this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBackground');
		this.bck.anchor.setTo(0.5,0.5);
		this.preloadBar = this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5,0.5);

		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('firebug','assets/fb2.png');
		this.load.image('firebuglight','assets/fb2.png');
		this.load.image('tiles','assets/tiles2.png');
		this.load.image('title','assets/title2.png');
		this.load.image('enemy1','assets/enemy2.png');
		this.load.image('flag','assets/flag2.png');
		this.load.spritesheet('skullbomb','assets/matchBlack.png',200,200);
		this.load.spritesheet('static','assets/static3.png',gamewidth,gameheight);
		this.load.spritesheet('skullbombwhite','assets/matchWhite.png',200,200);
		this.load.spritesheet('play','assets/play2.png',107,41);
		this.load.audio('titleMusic',['assets/music.mp3','assets/music.ogg']);
        this.load.audio('matchNoise','assets/match.mp3');
        this.load.audio('creak','assets/audio/creaking.ogg');
        this.load.audio('grunt','assets/audio/grunt2.ogg');


		
	},

	create: function () {

		//this.preloadBar.cropEnabled = false;
		//this.preloadBar.kill();
		//this.bck.kill();
		//this.decoding = this.add.sprite(this.world.centerX,this.world.centerY,'decoding');
		//this.decoding.anchor.setTo(0.5,0.5);

	},

	update: function () {

		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		 } 
	}

};
