
BasicGame.Game = function (game) {

	
};

BasicGame.Game.prototype = {

    preload : function(){
        this.paths = new Array();
        var f = Maze.createMaze(mazesize,mazesize,spread,this.paths);
        var s = Maze.convertToCSV(f);
        this.game.load.tilemap('map', null,s, Phaser.Tilemap.CSV);
    },

	create: function () {
        music.play('',0,1,true);
        this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        this.key2.onDown.add(function(){
            music.stop();
            this.state.start('MainMenu')}, this);

        this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.key1.onDown.add(changevolume, this);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.theta = 0;
        this.LIGHT_RADIUS = 250;
        this.numberofbaddies = MAJORBADDIES;
        this.numberofbombs = MAJORBOMBS;
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

        this.bombimage = this.game.add.sprite(500,0,'skullbombwhite');
        this.bombimage.frame = 1;
        this.bombimage.scale.setTo(0.25,0.25);
        this.bombimage.anchor.setTo(1,0);
        this.bombimage.fixedToCamera = true;
        this.bombtext = this.game.add.text(430,10,'0',{ font: '30px Arial', fill: '#ffffff' });
        this.bombtext.fixedToCamera = true;


        this.times = this.add.text(10,gameheight,totalseconds+'s',{ font: '30px Arial', fill: '#ffffff' });
        this.times.anchor.setTo(0,1);
        this.times.fixedToCamera = true;
        this.game.time.events.loop(1000, this.updatetime, this);

        this.leveltext = this.add.text(10,10,"World "+mazenumber,{ font: '20px Arial', fill: '#ffffff' });
        this.leveltext.fixedToCamera = true;

        this.enemykills = this.add.text(this.game.width-10,this.game.height-10,enemytotal+' kills',{ font: '20px Arial', fill: '#ffffff' });
        this.enemykills.anchor.setTo(1,1);
        this.enemykills.fixedToCamera = true;
	},
    updatetime : function(){
        totalseconds++;
        this.times.setText(totalseconds+'s');
    },
	update: function () {

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
        if (this.cursors.left.isDown)
        {
            this.player.angle -= 4;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.angle += 4;
        }

        if (this.cursors.up.isDown)
        {
            this.currentSpeed = 200;
        }
        if (this.cursors.down.isDown)
        {
            this.currentSpeed = -200;
        }
        if (this.currentSpeed != 0)
        {
            this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity);
        }

        this.updateShadowTexture();

	},
    newmaze : function(){
        music.stop();
        this.state.start('Transition');
    },

    playerenemycollision : function(a,b){
        if(this.bombpoints==0){
            music.stop();
            this.state.start('EndScreen');
        }
        b.kill();
        this.bombpoints--;
        enemytotal++;
        this.bombtext.setText(this.bombpoints);
    },

    handlebombcollection : function(a,b){
        b.kill();
        this.bombpoints++;
        this.bombtext.setText(this.bombpoints);

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

        this.radius = this.LIGHT_RADIUS/2 + 30*Math.cos(this.theta);//this.game.rnd.integerInRange(1,20);
        this.theta += 0.1;
        if(this.theta>2*Math.PI){
            this.theta = 0;
        }
        
        var gradient = this.shadowTexture.context.createRadialGradient(this.player.x, this.player.y,this.LIGHT_RADIUS * 0.1,this.player.x, this.player.y, this.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

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
        music.stop();
		this.state.start('MainMenu');

	}

};
