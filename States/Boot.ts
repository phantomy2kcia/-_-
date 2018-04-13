/// <reference path="../Lib/phaser.d.ts"/>
module CowVsButcher{
    export class Boot extends Phaser.State{

        preload(){
            this.game.load.image("AcademyLogo", "Graphics/Boot/Academy-Logo.png");
            this.game.load.image("PreloaderBackground", "Graphics/Boot/Background.png");
            this.game.load.image("bloodier_saw", "Graphics/Game/Saws/bloodier_saw.png");

            //Cow
            this.game.load.atlas("Cow", "Graphics/Game/Cow/Cow.png", "Graphics/Game/Cow/Cow.json");
            this.game.load.atlas("Cow2", "Graphics/Game/Cow/Cow2.png", "Graphics/Game/Cow/Cow2.json");
            this.game.load.image("CowHead","Graphics/Game/Cow/CowHead.png");

            //Butcher
            this.game.load.atlas("Butcher", "Graphics/Game/Butcher/Butcher.png", "Graphics/Game/Butcher/Butcher.json");
            this.game.load.atlas("Butcher2", "Graphics/Game/Butcher/Butcher2.png", "Graphics/Game/Butcher/Butcher2.json");
        }

        create(){
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.forceLandscape = true;
            //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            //this.game.scale.startFullScreen();
            var bootLogo:Phaser.Image = this.game.add.image(this.game.width*0.5, this.game.height*0.5,"AcademyLogo");
            bootLogo.anchor.set(0.5,0.5);
            this.game.time.events.add(500,()=>{
               this.game.state.start("Preloader",false,false,5,12321,"asdas");
            },this);
        }
    }
}