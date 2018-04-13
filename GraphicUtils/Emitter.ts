/// <reference path="../Lib/phaser.d.ts"/>
module CowVsButcher{
    export class Emitter {
        game:Phaser.Game;
        emitter: Phaser.Particles.Arcade.Emitter;

        constructor(game:Phaser.Game, width:number, gravity:number, keys: Array<string>){
            this.game = game;
            this.emitter = this.game.add.emitter(0,0,20);
            this.emitter.width = width;
            this.emitter.gravity = gravity;
            this.emitter.setAlpha(1,0.5);
            this.emitter.minParticleScale = 0.2;
            this.emitter.maxParticleScale = 0.3;
            this.emitter.makeParticles(keys);
        }

        update(){
            this.emitter.forEachAlive((particle)=>{
               particle.alpha = particle.lifespan/this.emitter.lifespan;
            },this);
        }

        start(x:number, y:number, explode:boolean, lifespan:number, quantity:number){
            this.emitter.x = x;
            this.emitter.y = y;
            this.emitter.bounce.setTo(0.9,0.9);
            this.emitter.angularDrag = 0;
            this.emitter.start(explode,lifespan,0,quantity,true);
        }
    }
}