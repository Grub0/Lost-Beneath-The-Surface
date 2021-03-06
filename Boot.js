var BasicGame = {
};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {

        this.load.image('preloaderBackground', 'assets/preloader.png');
        this.load.image('preloaderBar', 'assets/loader.png');
        this.load.image('decoding','assets/decoding.png');

    },

    create: function () {

        
        if (this.game.device.desktop)
        {
            // this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 250;
            this.scale.minHeight = 225;
            this.scale.maxWidth = 1000;
            this.scale.maxHeight = 900;
            this.scale.forceLandscape = true;
            // this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }
        this.state.start('Preloader');

    }

};
function changevolume(){
    if(music.paused==false){
       music.pause();
    }
    else{
        music.resume();
    }
}
