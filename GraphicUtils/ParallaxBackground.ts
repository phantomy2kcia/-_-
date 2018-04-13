/// <reference path="../Lib/phaser.d.ts"/>
module CowVsButcher{
    export class ParallaxBackground{
        game:Phaser.Game;
        image:Phaser.Sprite;
        secondImage:Phaser.Sprite;
        velocity:number;

        constructor(game:Phaser.Game, key:string, velocity:number, y?:number, group?:Phaser.Group){
            var spriteY = y||0;
            this.game = game;
            this.image = this.game.add.sprite(0,spriteY,key,0,group);
            this.secondImage = this.game.add.sprite(this.image.width,spriteY,key,0,group);
            this.velocity=velocity;
        }

        update(){
            this.image.position.x-=this.velocity;
            this.secondImage.position.x-=this.velocity;

            if(this.image.position.x<=-this.image.width){
                this.image.position.x = this.image.width;
            }
            if(this.secondImage.position.x<=-this.secondImage.width){
                this.secondImage.position.x = this.secondImage.width;
            }
        }
    }
}