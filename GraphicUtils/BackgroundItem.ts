/// <reference path="../Lib/phaser.d.ts"/>
module CowVsButcher {
    export class BackgroundItem {
        game:Phaser.Game;
        image:Phaser.Image;
        velocity:number;

        constructor(game:Phaser.Game, key:string, velocity:number, y:number, group:Phaser.Group) {
            var randomScale = RNG(0.5, 0.9);
            this.game = game;
            this.image = this.game.add.image(this.game.width, y, key, 0, group)
            this.image.anchor.set(0,1);
            this.velocity = velocity;
            this.image.scale.set(randomScale,randomScale);
        }

        update(){
            this.image.position.x -=this.velocity;
            //TODO: Maybe add destruction logic here???
        }
    }
}