/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="Blood.ts"/>
module CowVsButcher{
    export class BloodEmitter{
        game:Phaser.Game;
        emitter:Phaser.Particles.Arcade.Emitter;

        constructor(game:Phaser.Game, width:number, gravity:number){
            this.game = game;
            this.emitter = this.game.add.emitter(100,100,2000);
            this.emitter.particleClass = Blood;
            this.emitter.width = width;
            this.emitter.makeParticles("Blood");
            this.emitter.gravity = gravity;
            this.emitter.setAlpha(0.8,0.3);
        }

        start(x:number, y:number, explode:boolean, lifespan:number, quantity:number){
            this.emitter.x = x;
            this.emitter.y = y;
            this.emitter.start(explode, lifespan,0,quantity,true);
        }
    }
}