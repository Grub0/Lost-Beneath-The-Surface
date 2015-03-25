
BasicGame.MainMenu = function (game) {

	this.playButton = null;
	this.LIGHT_RADIUS = 350;
};

BasicGame.MainMenu.prototype = {

	create: function () {

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		// this.music = this.add.audio('titleMusic');
		// this.music.play();
		music = this.add.audio('titleMusic',1,true);
    	music.play('',0,1,true);

    	this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.key1.onDown.add(changevolume, this);


    	this.instr = this.add.text(this.world.centerX,gameheight-30,"PRESS M TO MUTE",{ font: '20px Arial', fill: '#ffffff' });
    	this.instr.anchor.setTo(0.5,0.5);
    	this.instri = this.add.text(this.world.centerX,gameheight-50,"PRESS B FOR MAIN MENU",{ font: '20px Arial', fill: '#ffffff' })
    	this.instri.anchor.setTo(0.5,0.5);

		totalseconds = 0;
		mazenumber=0;
		mazenumber = 0;
		this.theta = 0;
		enemytotal = 0;
		this.titleimage = this.add.sprite(this.world.centerX, 0, 'title');
		this.titleimage.anchor.setTo(0.5,0);

		this.playButton = this.add.button(this.world.centerX, this.world.centerY+100, 'play', this.startGame, this, 1,0,2);
    	this.playButton.anchor.setTo(0.5,0.5);

		this.overlay = this.add.sprite(0,0,'static');
    	this.overlay.alpha = 0.5;
    	this.overlay.animations.add('run');
    	this.overlay.animations.play('run',9,true);

		this.shadowTexture = this.game.add.bitmapData(gamewidth,gameheight);
    	this.lightSprite = this.game.add.image(0,0,this.shadowTexture);
    	this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    	this.menubug = this.add.sprite(this.world.randomX,this.world.randomY,'firebuglight');
    	this.menubug.anchor.setTo(0.5,0.5);
    	this.menubug.scale.setTo(0.2,0.2);
    	this.game.physics.enable(this.menubug);
    	this.menubug.body.collideWorldBounds = true;
		
		this.game.time.events.loop(1000, this.updateFirbug, this);

	},

	updateFirbug: function(){
		this.menubug.body.angularVelocity = this.game.rnd.integerInRange(-150,150);
	},

	update: function () {
		this.updateShadowTexture();
		this.game.physics.arcade.velocityFromRotation(this.menubug.rotation, 150, this.menubug.body.velocity);
		//	Do some nice funky main menu effect here

	},

	updateShadowTexture : function(){
		this.shadowTexture.context.fillStyle = 'rgb(50, 50,50)';
    	this.shadowTexture.context.fillRect(0, 0, gamewidth, gameheight);

   		this.radius = this.LIGHT_RADIUS + 150*Math.cos(this.theta);//this.game.rnd.integerInRange(1,20);
    	this.theta += 0.1;
    	if(this.theta>2*Math.PI){
    		this.theta = 0;
    	}
    	
    	var gradient = this.shadowTexture.context.createRadialGradient(this.menubug.x, this.menubug.y,this.LIGHT_RADIUS * 0.1,this.menubug.x, this.menubug.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    	this.shadowTexture.context.beginPath();
    	this.shadowTexture.context.fillStyle = gradient;
    	this.shadowTexture.context.arc(this.menubug.x,this.menubug.y,this.radius, 0, Math.PI*2);
   		this.shadowTexture.context.fill();

    	this.shadowTexture.dirty = true;

		
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};

BasicGame.EndScreen = function(game){};

BasicGame.EndScreen.prototype = {
	create : function(){
		music.play('',0,1,true);
		this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		this.deadimage = this.add.sprite(this.world.centerX,10,'skullbombwhite');
		this.deadimage.frame = 0;
		this.deadimage.anchor.setTo(0.5,0);
		this.deadimage.scale.setTo(0.7,0.7);

		this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.key1.onDown.add(changevolume, this);

		this.scoretext = this.add.text(this.world.centerX,this.world.centerY,'You killed '+enemytotal+' horrors!',{ font: '20px Arial', fill: '#ffffff' });
		this.scoretext.anchor.setTo(0.5,0.5);
		this.timetext = this.add.text(this.world.centerX,this.world.centerY+21,'And in '+totalseconds+' seconds, finished...',{ font: '20px Arial', fill: '#ffffff' });
		this.timetext.anchor.setTo(0.5,0.5);
		this.mazetext = this.add.text(this.world.centerX,this.world.centerY+42,mazenumber+' worlds!',{ font: '20px Arial', fill: '#ffffff' });
		this.mazetext.anchor.setTo(0.5,0.5);
		this.instruc = this.add.text(this.world.centerX,this.world.height-50,"Press UP to go to main screen.",{ font: '20px Arial', fill: '#ffffff' });
		this.instruc.anchor.setTo(0.5,0.5);

		this.overlay = this.add.sprite(0,0,'static');
    	this.overlay.alpha = 0.5;
    	this.overlay.animations.add('run');
    	this.overlay.animations.play('run',9,true);

    	this.cursors = this.game.input.keyboard.createCursorKeys();



	},

	update : function(){
		 if (this.cursors.up.isDown)
        {	
        	music.stop();
            this.state.start('MainMenu');
        }
	}
};

BasicGame.Transition = function(game){};

BasicGame.Transition.prototype = {
	create : function(){
		music.play('',0,1,true);
		this.setGlobals();
		this.theta = 0;
		this.LIGHT_RADIUS = 100;
		this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.key1.onDown.add(changevolume, this);
        
		this.game.world.setBounds(0, 0, this.game.width, this.game.height);

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
    	this.shadowTexture.context.fillRect(0, 0, gamewidth, gameheight);
   		this.radius = this.LIGHT_RADIUS + 50*Math.cos(this.theta);//this.game.rnd.integerInRange(1,20);
    	this.theta += 0.1;
    	if(this.theta>2*Math.PI){
    		this.theta = 0;
    	}
    	
    	var gradient = this.shadowTexture.context.createRadialGradient(this.menubug.x, this.menubug.y,this.LIGHT_RADIUS * 0.1,this.menubug.x, this.menubug.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

    	this.shadowTexture.context.beginPath();
    	this.shadowTexture.context.fillStyle = gradient;
    	this.shadowTexture.context.arc(this.menubug.x,this.menubug.y,this.radius, 0, Math.PI*2);
   		this.shadowTexture.context.fill();

   		this.bb = this.add.text(this.world.centerX,this.world.centerY-30,"Generating new world...",{ font: '30px Arial', fill: '#ffffff' });
   		this.bb.anchor.setTo(0.5,0.5);
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