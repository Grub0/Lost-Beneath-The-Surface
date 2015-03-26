
BasicGame.MainMenu = function (game) {

	this.playButton = null;
	this.LIGHT_RADIUS = 350;
};

BasicGame.MainMenu.prototype = {

	create: function () {

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		music = this.add.audio('titleMusic',1,true);
        violin = this.add.audio('violin',1,true);	
        piano = this.add.audio('piano',1,true);
    	music.play('',0,1,true);
		totalseconds = 0;
		mazenumber=0;
		mazenumber = 0;
		this.theta = 0;
		enemytotal = 0;
        this.bloodimage = this.add.sprite(gamewidth-50, gameheight-200, 'blood');
		this.bloodimage.anchor.setTo(0.5,0);
        
        this.enemyimage = this.add.sprite(this.world.centerX, this.world.centerY - 140, 'darkEnemy');
		this.enemyimage.anchor.setTo(0.5,0);

		this.titleimage = this.add.sprite(this.world.centerX, 10, 'title');
        this.titleimage.anchor.setTo(0.5,0);

		this.playButton = this.add.button(this.world.centerX, this.world.centerY+300, 'play', this.startGame, this, 1,0,2);
    	this.playButton.anchor.setTo(0.5,0.5);
        
        this.howButton = this.add.button(this.world.centerX, this.world.centerY+350, 'howto', this.goHowTo, this, 1,0,2);
    	this.howButton.anchor.setTo(0.5,0.5);

	},

	updateFirbug: function(){
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		music.stop();

		//	And start the actual game
		this.state.start('Game');

	},
	goHowTo: function (pointer) {
		//	And start the actual game
		this.state.start('HowTo');

	}

};
BasicGame.HowTo = function (game) {};

BasicGame.HowTo.prototype = {

	create: function () {
		this.titleimage = this.add.sprite(this.world.centerX, 10, 'title');
        this.titleimage.anchor.setTo(0.5,0);
        
        		this.rulesimage = this.add.sprite(this.world.centerX, this.world.centerY - 300, 'howrules');
        this.rulesimage.anchor.setTo(0.5,0);
        
        this.howButton = this.add.button(this.world.centerX, this.world.centerY+350, 'back', this.goMenu, this, 1,0,2);
    	this.howButton.anchor.setTo(0.5,0.5);

	},

	updateFirbug: function(){
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	goMenu: function (pointer) {
		//	And start the actual game
		this.state.start('MainMenu');

	}

};
BasicGame.EndScreen = function(game){};

BasicGame.EndScreen.prototype = 
    {
    
	create : function(){
		//music.play('',0,1,true);
        //music.play('',0,1,true);
        var roar = this.add.audio('roar',1,true);
        roar.play('',0,1,false);
        violin.stop();
        piano.stop();
        violinPlaying = false;
        pianoPlaying = false;
        violinLoud = false;
        violinLouder = false;
		this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		this.deadimage = this.add.sprite(this.world.centerX,10,'skullbombwhite');
		this.deadimage.frame = 0;
		this.deadimage.anchor.setTo(0.5,0);
		this.deadimage.scale.setTo(0.7,0.7);

		this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.key1.onDown.add(this.startGame, this);
		this.scoretext = this.add.text(this.world.centerX,this.world.centerY,'You scored '+score +' points',{ font: '20px Arial', fill: '#ffffff' });
		this.scoretext.anchor.setTo(0.5,0.5);
		this.mazetext = this.add.text(this.world.centerX,this.world.centerY+42,'and descended '+mazenumber+' levels',{ font: '20px Arial', fill: '#ffffff' });
		this.mazetext.anchor.setTo(0.5,0.5);
		this.instruc = this.add.text(this.world.centerX,this.world.height-50,"Press SPACE to play again",{ font: '20px Arial', fill: '#ffffff' });
		this.instruc.anchor.setTo(0.5,0.5);

		this.overlay = this.add.sprite(0,0,'static');
    	this.overlay.alpha = 0.5;
    	this.overlay.animations.add('run');
    	this.overlay.animations.play('run',9,true);

    	this.cursors = this.game.input.keyboard.createCursorKeys();
        score = 0;
        numMatches =15;
        decayRate =.2;
	},

	update : function(){
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		music.stop();
        
		//	And start the actual game
		this.state.start('Game');

	}
};

BasicGame.Transition = function(game){};

BasicGame.Transition.prototype = {
	create : function(){
		//music.play('',0,1,true);
        violin.stop();
        piano.stop();
        violinPlaying = false;
        pianoPlaying = false;
        violinLoud = false;
        violinLouder = false;
        var creak = this.add.audio('creak',1,true);
        creak.play('',0,1,false);
		this.setGlobals();
		this.theta = 0;
		this.LIGHT_RADIUS = 100;
		this.game.world.setBounds(0, 0, gamewidth, gameheight);
		this.shadowTexture = this.game.add.bitmapData(gamewidth,gameheight);
    	this.lightSprite = this.game.add.image(0,0,this.shadowTexture);
    	// this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    	this.menubug = this.add.sprite(-100,this.world.centerY,'firebuglight');
    	this.menubug.anchor.setTo(0.5,0.5);
    	this.menubug.scale.setTo(0.2,0.2);
    	this.menubugtween = this.add.tween(this.menubug).to({x:gamewidth+100},5000,Phaser.Easing.Linear.None);
    	this.menubugtween.start();
    	this.menubugtween.onComplete.add(this.goback,this);
	},
	goback : function(){
		music.stop();
		this.state.start('Game');
	},

	update: function () {
		this.updateShadowTexture();
	},

	updateShadowTexture : function(){
		this.shadowTexture.context.fillStyle = 'rgb(50, 50,50)';
    	this.shadowTexture.context.fillRect(0, 0, 1000, 900);
   		this.radius = this.LIGHT_RADIUS + 50*Math.cos(this.theta);//this.game.rnd.integerInRange(1,20);
    	this.theta += 0.1;
    	if(this.theta>2*Math.PI){
    		this.theta = 0;
    	}
    	
    	var gradient = this.shadowTexture.context.createRadialGradient(this.menubug.x, this.menubug.y,this.LIGHT_RADIUS * 0.1,this.menubug.x, this.menubug.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, .5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    	this.shadowTexture.context.beginPath();
    	this.shadowTexture.context.fillStyle = gradient;
    	this.shadowTexture.context.arc(this.menubug.x,this.menubug.y,this.radius, 0, Math.PI*2);
   		this.shadowTexture.context.fill();
    	this.shadowTexture.dirty = true;

		
	},

	setGlobals : function(){
		mazesize = this.game.rnd.integerInRange(15,40);
		spread = this.game.rnd.integerInRange(-9,9);
		MAJORBADDIES = mazesize - this.game.rnd.integerInRange(5,12);
		MAJORBOMBS = MAJORBADDIES - this.game.rnd.integerInRange(2,5);
		mazenumber++;
	}
}