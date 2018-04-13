/// <reference path="../Lib/phaser.d.ts"/>
module CowVsButcher{
    export class Blood extends Phaser.Particle{
        game:Phaser.Game;
        radius:number;
        x:number;
        y:number;

        constructor(game:Phaser.Game, x:number, y:number){
            this.game=game;
            this.radius = 5 + Math.round(RNG(0,5));
            super(this.game,x,y,game.cache.getBitmapData("Blood"));
            this.x=x;
            this.y=y;
            this.createBlood();

        }

        update(){
            if(this.alpha>0.01){
                this.alpha = this.alpha - RNG(0.005,0.009);
            }
            super.update();
        }
        createBlood(){
            var bmd = this.game.add.bitmapData(this.radius*2, this.radius*2);
            bmd.circle(bmd.width*0.5,bmd.height*0.5,this.radius,"#8B1914");
            this.game.cache.addBitmapData("Blood",bmd);
        }
    }
}