/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\BloodEmitter.ts"/>
///<reference path="..\GraphicUtils\Emitter.ts"/>
///<reference path="..\GraphicUtils\Saw.ts"/>
module CowVsButcher{
    export class KillerCollection{
        game:Phaser.Game;
        killerGroup:Phaser.Group;

        bloodEmitter:BloodEmitter;
        boneEmitter:Emitter;
        featherEmitter:Emitter;
        sausageEmitter:Emitter;
        burgerEmitter:Emitter;

        sawCollection:Array<Saw>;
        firstSaw:Saw;
        secondSaw:Saw;
        thirdSaw:Saw;
        gameOver:boolean;

        score:number;
        killsText:Phaser.Text;

        constructor(game:Phaser.Game){
            this.game=game;
        }

        create(){
            this.killerGroup = this.game.add.group();
            this.gameOver = false;

            this.firstSaw = new Saw(this.game, "default_saw","bloody_saw","bloodier_saw",0,140,0.4,this.killerGroup);
            this.secondSaw = new Saw(this.game, "default_saw","bloody_saw","bloodier_saw",0,530,0.5,this.killerGroup);
            this.thirdSaw = new Saw(this.game, "default_saw","bloody_saw","bloodier_saw",0,320,0.7,this.killerGroup);

            this.sawCollection = [];
            this.sawCollection.push(this.firstSaw);
            this.sawCollection.push(this.secondSaw);
            this.sawCollection.push(this.thirdSaw);

            this.burgerEmitter = new Emitter(this.game,5,200,["burger"]);
            this.sausageEmitter = new Emitter(this.game,5,200,["sausage"]);
            this.boneEmitter = new Emitter(this.game,5,500,["bloody_bone","bone"]);
            this.featherEmitter = new Emitter(this.game,5,-1000,["feather"]);
            this.bloodEmitter = new BloodEmitter(this.game,5,500);

            this.killerGroup.addMultiple([this.bloodEmitter.emitter, this.featherEmitter.emitter,
            this.boneEmitter.emitter, this.sausageEmitter.emitter, this.burgerEmitter.emitter]);

            this.score = 0;
            var killsTextStyle = {fill:"#4e0a09"};
            this.killsText = this.game.add.text(100,this.game.height*0.85, "KILLS: "+this.score.toString(),killsTextStyle);
            this.killsText.font = "28-days-later";
            this.killsText.fontSize = 90;
            this.killsText.fontWeight = "normal";
            this.killerGroup.add(this.killsText);
        }

        update(){
            this.sawCollection.forEach((saw)=>{
                saw.update();
            });
            this.burgerEmitter.update();
            this.sausageEmitter.update();
            this.boneEmitter.update();
            this.featherEmitter.update();
        }

        updateKillsText(){
            this.score++;
            this.killsText.text = "KILLS: "+this.score.toString();
        }
    }
}