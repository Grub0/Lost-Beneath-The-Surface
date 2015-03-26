BasicGame.Game = function (game) {
};

BasicGame.Game.prototype = {

    preload : function(){
        this.stopThings;
        this.paths = new Array();
        var f = Maze.createMaze(mazesize,mazesize,spread,this.paths);
        var s = Maze.convertToCSV(f);
        this.game.load.tilemap('map', null,s, Phaser.Tilemap.CSV);
    },

	create: function () {
        music.play('',0,1,true);
        this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        this.key2.onDown.add(function(){
        this.stopThings;
        this.state.start('MainMenu')}, this);

        //this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        //this.key1.onDown.add(changevolume, this);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.theta = 0;
        this.LIGHT_RADIUS = 350;
        this.numberofbaddies = MAJORBADDIES;
        this.numberofbombs = this.numberofbaddies;
        if(numMatches > 0)
        {
            this.numberofbombs+= numMatches;
        }
        this.p = {x : 0, y : 0};
        this.nextdir = [];

        this.bombpoints = 0;

        this.map = this.add.tilemap('map',50,50);
        this.map.addTilesetImage('tiles');
        this.map.setCollision(0);
        this.layer = this.map.createLayer(0);
        this.layer.resizeWorld();

        this.overlay = this.add.sprite(0,0,'static');
        this.overlay.alpha = 0.8;
        this.overlay.animations.add('run');
        this.overlay.animations.play('run',9,true);
        this.overlay.fixedToCamera = true;

        var l = this.paths.length-1;
                
        this.player = this.add.sprite((this.paths[0].ix)*50+25, (this.paths[0].iy)*50+25, 'firebug');
        this.player.anchor.setTo(0.5,0.5);
        this.player.scale.setTo(0.2,0.2);
        this.player.blendMode = 2;

        this.enemies = this.add.group();

        for(var i=0;i<this.numberofbaddies;i++){
            var rnd = this.game.rnd.integerInRange(15,this.paths.length-15);
            var baddy = this.enemies.create(this.paths[rnd].ix*50+25,this.paths[rnd].iy*50+25,'enemy1');
            baddy.scale.setTo(0.25,0.25);
            baddy.anchor.setTo(0.5,0.5);
            baddy.direction = 1;
            this.game.physics.enable(baddy);

        }

        this.bombs = this.add.group();

        for(var i=0;i<this.numberofbombs;i++){
            var rnd = this.game.rnd.integerInRange(5,this.paths.length-5);
            var bomb = this.add.sprite(this.paths[rnd].ix*50+25,this.paths[rnd].iy*50+25,'skullbomb');
            bomb.frame = 1;
            bomb.scale.setTo(0.15,0.15);
            bomb.anchor.setTo(0.5,0.5);
            this.game.physics.enable(bomb);
            this.bombs.addChild(bomb);
        }

        this.flag = this.add.sprite(this.paths[this.paths.length-1].ix*50+25,this.paths[this.paths.length-1].iy*50+25,'flag');
        this.flag.scale.setTo(0.25,0.25);
        this.flag.anchor.setTo(0.5,0.5);
        this.game.physics.enable(this.flag);


        this.overlay = this.add.sprite(0,0,'static');
        this.overlay.alpha = 0.8;
        this.overlay.animations.add('run');
        this.overlay.animations.play('run',9,true);
        this.overlay.fixedToCamera = true;

        this.shadowTexture = this.game.add.bitmapData(mazesize*50,mazesize*50);
        this.lightSprite = this.game.add.image(0,0,this.shadowTexture);
        this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        this.game.physics.enable(this.player);

        this.game.camera.follow(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.time.advancedTiming = true;

        this.leveltext = this.add.text()
        // this.fpsText = this.game.add.text(
        //     20, 20, '', { font: '16px Arial', fill: '#ffffff' });
        // this.fpsText.fixedToCamera = true; 

        this.times = this.add.text(10,gameheight,'Score:'+score,{ font: '30px Arial', fill: '#ffffff' });
        this.times.anchor.setTo(0,1);
        this.times.fixedToCamera = true;

        //this.leveltext = this.add.text(10,10,"World "+mazenumber,{ font: '20px Arial', fill: '#ffffff' });
        //this.leveltext.fixedToCamera = true;

        //this.enemykills = this.add.text(this.game.width-10,this.game.height-10,enemytotal+' kills',{ font: '20px Arial', fill: '#ffffff' });
        //this.enemykills.anchor.setTo(1,1);
        //this.enemykills.fixedToCamera = true;
	},
    updatetime : function(){
        totalseconds++;
        this.times.setText(totalseconds+'s');
    },
	update: function () 
    {
        this.times.text = 'Score:'+score;
        
	    this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player,this.flag,this.newmaze,null,this);
        this.game.physics.arcade.collide(this.player,this.enemies,this.playerenemycollision,null,this);
        this.game.physics.arcade.collide(this.enemies,this.layer,this.handlenemymovement,null,this);
        this.game.physics.arcade.collide(this.player,this.bombs,this.handlebombcollection,null,this);
        // if (this.game.time.fps !== 0) {
        //     this.fpsText.setText(this.game.time.fps + ' FPS');
        // }
        this.enemies.forEach(this.handleenemyvelocity,this);
        // this.enemies.forEach(this.handlenemymovement,this);

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        this.currentSpeed = 0;
        var playerSpeed = 100;
        if (this.cursors.left.isDown)
        {
            this.player.angle = 180;
            this.currentSpeed = playerSpeed;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.angle = 0;
            this.currentSpeed = playerSpeed;
        }
        if (this.cursors.up.isDown)
        {
            this.player.angle = 270;
            this.currentSpeed = playerSpeed;
        }
        if (this.cursors.down.isDown)
        {
            this.player.angle = 90;
            this.currentSpeed = playerSpeed;
        }
        if (this.currentSpeed != 0)
        {
            this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity);
        }
        this.updateShadowTexture();

	},
    newmaze : function(){
        this.stopThings;
        score+=1000;
        numMatches -=1;
        decayRate +=.05;
        this.state.start('Transition');
    },
    
    stopThings: function()
    {
                music.stop();
                violin.stop();
        piano.stop();
        violinPlaying = false;
        pianoPlaying = false;
        violinLoud = false;
        violinLouder = false;
        violinLoudest = false;
    },

    playerenemycollision : function(a,b){
        if(this.LIGHT_RADIUS <= 50){
            this.stopThings;
            this.state.start('EndScreen');
        }
        else
        {
            var grunt = this.add.audio('grunt',1,true);
            grunt.play('',0,1,false);
            score += 100;
        }
        this.LIGHT_RADIUS -= 100;
        if(this.LIGHT_RADIUS < 50)
        {
            this.LIGHT_RADIUS = 50;
        }
        enemytotal++;
        b.kill();
        //this.bombtext.setText(this.bombpoints);
    },

    handlebombcollection : function(a,b){
        b.kill();
        this.bombpoints++;
        var match = this.add.audio('matchNoise',1,true);
        match.play('',0,1,false);
        score += 10;
        if(this.LIGHT_RADIUS < 500)
        {
        this.LIGHT_RADIUS += 100;
        }
        //this.bombtext.setText(this.bombpoints);

    },

    handleenemyvelocity : function(en){
        switch(en.direction){
            case 1 :    en.body.velocity.x = 50;
                        en.body.velocity.y = 0;
                        break;
            case 2 :    en.body.velocity.x = 0;
                        en.body.velocity.y = -50;
                        break;
            case 3 :    en.body.velocity.x = -50;
                        en.body.velocity.y = 0;
                        break;
            case 4 :    en.body.velocity.x = 0;
                        en.body.velocity.y = 50;
                        break;
        }
    },

    handlenemymovement : function(en,ti){
        this.nextdir.length = 0;
        this.layer.getTileXY(en.x,en.y,this.p);
        var type = [];
        type[2] = this.map.getTileAbove(0,this.p.x,this.p.y);
        type[3] = this.map.getTileBelow(0,this.p.x,this.p.y);
        type[4] = this.map.getTileRight(0,this.p.x,this.p.y);
        type[1] = this.map.getTileLeft(0,this.p.x,this.p.y);
        var change = this.game.rnd.integerInRange(0,10);
        if(type[en.direction]==0 || change>7){
            switch(en.direction){
            case 1 :    if(type[3]!=0){ this.nextdir.push(3); }
                        if(type[4]!=0){ this.nextdir.push(4); }
                        if(type[2]!=0){ this.nextdir.push(2); }
                        break;
            case 2 :    if(type[3]!=0){ this.nextdir.push(3); }
                        if(type[4]!=0){ this.nextdir.push(4); }
                        if(type[1]!=0){ this.nextdir.push(1); }
                        break;
            case 3 :    if(type[1]!=0){ this.nextdir.push(1); }
                        if(type[4]!=0){ this.nextdir.push(4); }
                        if(type[2]!=0){ this.nextdir.push(2); }
                        break;
            case 4 :    if(type[3]!=0){ this.nextdir.push(3); }
                        if(type[1]!=0){ this.nextdir.push(1); }
                        if(type[2]!=0){ this.nextdir.push(2); }
                        break;
            };
            var rnd = this.game.rnd.integerInRange(0,this.nextdir.length-1);
            en.direction = this.nextdir[rnd];
        }
    },  

    updateShadowTexture : function(){
        this.shadowTexture.context.fillStyle = 'rgb(0,0,0)';
        this.shadowTexture.context.fillRect(0, 0, mazesize*50, mazesize*50);

        this.radius = this.LIGHT_RADIUS + 30*Math.cos(this.theta);//this.game.rnd.integerInRange(1,20);
        //this.theta += 0.1;
        if(this.LIGHT_RADIUS >= 350)
        {
            violin.stop();
            piano.stop();
            violinPlaying = false;
            violinLoud = false;
            violinLouder = false;
            violinLoudest = false;
            pianoPlaying = false;
        }
        if(this.LIGHT_RADIUS > 50)
        {
            this.LIGHT_RADIUS -= decayRate;
        }
        
        if(this.LIGHT_RADIUS < 330 && pianoPlaying == false)
        {
            piano.play('',0,1,true);
            pianoPlaying = true;
        }
        else if(this.LIGHT_RADIUS >= 330 && pianoPlaying == true)
        {
            piano.stop();
            pianoPlaying = false;
        }
        if(this.LIGHT_RADIUS < 300 && violinPlaying == false)
        {
            violin.play('',0,1,true);
            violinPlaying = true;
        }
        else if(this.LIGHT_RADIUS >= 300 && violinPlaying == true)
        {
            violin.stop();
            violinPlaying = false;
        }
        
        if(this.LIGHT_RADIUS < 250 && violinLoud == false)
        {
            violin.stop();
            violin.play('',0,2,true);
            violinLoud = true;
        }
        else if(this.LIGHT_RADIUS >= 250 && violinLoud == true)
        {
            violin.stop();
            violin.play('',0,1,true);
            violinLoud = false;
        }
        
        if(this.LIGHT_RADIUS < 150 && violinLouder == false)
        {
            violin.stop();
            violin.play('',0,3,true);
            violinLouder = true;
        }
        else if(this.LIGHT_RADIUS >= 150 && violinLouder == true)
        {
            violin.stop();
            violin.play('',0,2,true);
            violinLouder = false;
        }
        
        if(this.LIGHT_RADIUS < 60 && violinLoudest == false)
        {
            violin.stop();
            violin.play('',0,5,true);
            violinLoudest = true;
        }
        else if(this.LIGHT_RADIUS >= 60 && violinLoudest == true)
        {
            violin.stop();
            violin.play('',0,3,true);
            violinLoudest = false;
        }
        if(this.LIGHT_RADIUS <= 50)
        {
                var gradient = this.shadowTexture.context.createRadialGradient(this.player.x, this.player.y,this.LIGHT_RADIUS *                         .1,this.player.x, this.player.y, this.radius);
                gradient.addColorStop(0, 'rgba(255, 0, 0, 1.0)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        }
        else
        {
                    var gradient = this.shadowTexture.context.createRadialGradient(this.player.x, this.player.y,this.LIGHT_RADIUS * .1,this.player.x, this.player.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        }


        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(this.player.x,this.player.y,this.radius, 0, Math.PI*2);
        this.shadowTexture.context.fill();

        this.shadowTexture.dirty = true;

        
    },

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
        this.stopThings;
		this.state.start('MainMenu');

	}

};
