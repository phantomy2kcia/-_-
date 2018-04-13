/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\Steak.ts"/>
///<reference path="..\GraphicUtils\ParallaxBackground.ts"/>
///<reference path="Level.ts"/>
module CowVsButcher{
    export class LevelOne extends Level{
        steakHanger:ParallaxBackground;

        steakCollection: Array<Steak>;
        randomSteakSpawnTime:number;

        constructor(game:Phaser.Game){
            super(game);
        }

        create(difficulty:Difficulty){
            this.levelGroup = this.game.add.group();
            this.background = new ParallaxBackground(this.game, "slaughter_background", 2.5, -100, this.levelGroup);
            this.steakHanger = new ParallaxBackground(this.game,"platform",4,-30,this.levelGroup);

            this.steakCollection = [];
            this.randomSteakSpawnTime = this.game.time.now;
            this.ground = new ParallaxBackground(this.game,"ground", difficulty.levelSpeed,586, this.levelGroup);
            super.create(difficulty);

        }

        update(killerCollection:KillerCollection, cow:Cow, difficulty:Difficulty){
            super.update(killerCollection,cow,difficulty);
            this.steakHanger.update();
            this.spawnSteak();
            this.updateSteaks(killerCollection);
            this.spawnPlatform("platformIndoor1",difficulty);
            this.updatePlatforms(cow, difficulty);
            this.spawnWall("wallIndoor",difficulty);
            this.updateWalls(cow, difficulty);
        }

        spawnSteak(){
            if(this.game.time.now > this.randomSteakSpawnTime){
                this.randomSteakSpawnTime = this.game.time.now + RNG(3,6)*1000;
                var steak = new Steak(this.game, "steak", 4, 50, this.levelGroup);
                this.steakCollection.push(steak);
                this.levelGroup.addChildAt(steak.sprite, 6);
            }
        }

        updateSteaks(killerCollection:KillerCollection){
            this.steakCollection.forEach((steak)=>{
                steak.update(killerCollection);
                if(steak.sprite.position.x <=-steak.sprite.width){
                    steak.sprite.alpha = 0;
                    steak.sprite.destroy();
                }
            });
            if(this.steakCollection[0] && this.steakCollection[0].sprite.alpha === 0){
                this.steakCollection.splice(0,1);
            }


        }
    }
}