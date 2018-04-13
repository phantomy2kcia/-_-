/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\Levels\KillerCollection.ts"/>
///<reference path="..\Levels\Level.ts"/>
///<reference path="..\Levels\LevelOne.ts"/>
///<reference path="..\Levels\LevelTwo.ts"/>
///<reference path="..\GraphicUtils\ItemButton.ts"/>
///<reference path="..\GameObjects\Cow.ts"/>
///<reference path="..\GameObjects\Difficulty.ts"/>
///<reference path="..\GameObjects\Chest.ts"/>
///<reference path="..\GameObjects\Barbeque.ts"/>

module CowVsButcher {
    export class Game extends Phaser.State {
        currentDifficulty:Difficulty;
        difficulties:Array<Difficulty>;
        shouldChangeDifficulty:boolean;

        currentLevel:Level;
        levelOne:LevelOne;
        levelTwo:LevelTwo;
        killerCollection:KillerCollection;

        knifeButton:ItemButton;
        grenadeButton:ItemButton;
        gmoButton:ItemButton;
        shotgunButton:ItemButton;

        cow:Cow;
        butcherList:Array<Butcher>;

        topGroup:Phaser.Group;
        thrownItems:Array<Phaser.Sprite>;
        pickUpItems:Array<Phaser.Sprite>;
        chestItems:Array<Chest>;

        randomChestsSpawnTime:number;
        randomButcherSpawnTime:number;


        constructor() {
            super();
        }

        create() {
            //ground
            this.difficulties = [];
            this.difficulties.push(new Difficulty(0, 10, 20, 1000, 6000, 6,1500,3000,4500,8000,5000,8000,5));
            this.difficulties.push(new Difficulty(1, 7,  15, 1000, 4500, 7,1000,2200,3500,6500,4500,7500,6.4));
            this.difficulties.push(new Difficulty(2, 4,  10, 500, 4000,  9,800,1800,2500,5000,4000,6000,6.4));
            this.difficulties.push(new Difficulty(3, 3,  8,  500, 3000,  11,800,1800,1800,4000,4000,5500,8));
            this.currentDifficulty = this.difficulties[0];
            this.shouldChangeDifficulty = true;
            console.log(this.currentDifficulty);

            this.levelOne = new LevelOne(this.game);
            this.levelOne.create(this.currentDifficulty);
            this.levelTwo = new LevelTwo(this.game);
            this.levelTwo.create(this.currentDifficulty);
            this.currentLevel = this.levelOne;
            this.killerCollection = new KillerCollection(this.game);
            this.killerCollection.create();

            this.cow = new Cow(this.game);

            this.butcherList = [];
            this.randomButcherSpawnTime = this.game.time.now;
            this.thrownItems = [];
            this.pickUpItems = [];
            this.chestItems = [];
            this.randomChestsSpawnTime = this.game.time.now + Phaser.Timer.SECOND * 3;

            this.grenadeButton = new ItemButton(this.game, 1200, 650, "grenadeButton", 3, this.cow, "throwGrenade");
            this.shotgunButton = new ItemButton(this.game, 1100, 650, "shotgunButton", 8, this.cow, "shotgun");
            this.knifeButton = new ItemButton(this.game, 1000, 650, "knifeButton", 0, this.cow, "throwKnife");
            this.gmoButton = new ItemButton(this.game, 800, 650, "gmoButton", 0, this.cow, "gmo");

            this.topGroup = this.game.add.group();
            this.topGroup.addMultiple([this.grenadeButton, this.grenadeButton.spriteBW, this.grenadeButton.ammoText,
                this.shotgunButton, this.shotgunButton.spriteBW, this.shotgunButton.ammoText,
                this.knifeButton, this.knifeButton.spriteBW, this.knifeButton.ammoText,
                this.gmoButton, this.gmoButton.spriteBW, this.gmoButton.ammoText,]);
            this.topGroup.addMultiple([this.cow.states, this.cow.states2]);
            this.game.world.bringToTop(this.levelOne.levelGroup);
            this.game.world.bringToTop(this.killerCollection.killerGroup);
            this.game.world.bringToTop(this.topGroup);
            this.triggerLevel(2);
        }

        update() {
            if (!this.killerCollection.gameOver) {
                this.currentLevel.update(this.killerCollection, this.cow, this.currentDifficulty);
                this.killerCollection.update();
                this.game.physics.arcade.collide(this.killerCollection.boneEmitter.emitter, this.currentLevel.ground.image);
                this.game.physics.arcade.collide(this.killerCollection.boneEmitter.emitter, this.currentLevel.ground.secondImage);

                this.cow.update(this.currentLevel.ground,this.killerCollection);
                this.butcherList.forEach((butch)=> {
                    butch.update(this.currentLevel, this.killerCollection, this.butcherList, this.cow,
                        this.thrownItems, this.pickUpItems, this.currentDifficulty);
                });
                this.chestItems.forEach((chest)=> {
                    chest.update(this.cow, this.grenadeButton, this.shotgunButton, this.gmoButton,this.chestItems);
                }, this);
                this.spawnChests();
                this.spawnButchers();
                this.pickupItemsUpdate(this.currentDifficulty);
                this.thrownItemsUpdate();
                this.cowThrowItems();
                this.updateDifficulties();


                this.game.world.bringToTop(this.killerCollection.killerGroup);
                this.game.world.bringToTop(this.topGroup);
            }

            else {
                if (this.cow.cowHead) {
                    this.game.physics.arcade.collide(this.currentLevel.ground.image, this.cow.cowHead, ()=> {
                        this.cow.cowHead.rotation -= 0.1;
                        this.cow.cowHead.body.velocity.x = 0;
                    });
                    this.game.physics.arcade.collide(this.currentLevel.ground.secondImage, this.cow.cowHead, ()=> {
                        this.cow.cowHead.rotation -= 0.1;
                        this.cow.cowHead.body.velocity.x = 0;
                    });
                    this.cow.cowHead.rotation += 0.1;
                }

                this.butcherList.forEach((butch)=> {
                    this.game.physics.arcade.collide(butch.states,this.currentLevel.ground.image);
                    this.game.physics.arcade.collide(butch.states,this.currentLevel.ground.secondImage);
                    butch.states.position.x -= butch.velocity;
                });
            }

            if(this.killerCollection.gameOver && this.cow.currentState !== CowStates.DEAD){
                this.gameOver();
            }
        }

        gameOver(){

            this.grenadeButton.inputEnabled = false;
            this.knifeButton.inputEnabled = false;
            this.gmoButton.inputEnabled = false;
            this.shotgunButton.inputEnabled = false;

            this.cow.currentState = CowStates.DEAD;

            var maximumScore = localStorage.getItem("maxScore");

            if(maximumScore===null){
                localStorage.setItem("maxScore",this.killerCollection.score.toString());
                maximumScore = this.killerCollection.score.toString();
            }
            else{
                if(parseInt(maximumScore)<=this.killerCollection.score){
                    maximumScore = this.killerCollection.score.toString();
                    localStorage.setItem("maxScore",this.killerCollection.score.toString());
                }
            }

            this.killerCollection.bloodEmitter.start(this.cow.states.position.x, this.cow.states.position.y - 200, true,2000,30);
            this.game.time.events.add(2000, ()=>{
                this.game.state.start("GameOver",false,false, this.killerCollection.score, maximumScore);
            },this);
        }

        spawnChests() {
            if (this.randomChestsSpawnTime < this.game.time.now) {
                this.randomChestsSpawnTime = this.game.time.now + Math.abs(RNG(this.currentDifficulty.rngChestLow,
                            this.currentDifficulty.rngChestHigh) * 1000);
                var chest = new Chest(this.game);
                this.topGroup.add(chest.chest);
                this.chestItems.push(chest);

            }
        }

        spawnButchers() {
            if (this.randomButcherSpawnTime < this.game.time.now) {
                this.randomButcherSpawnTime = this.game.time.now + RNG(this.currentDifficulty.rngButchLow,
                        this.currentDifficulty.rngButchHigh);
                var butch = new Butcher(this.game, this.currentDifficulty.butchSpeed);
                this.killerCollection.killerGroup.addChildAt(butch.states,6);
                this.killerCollection.killerGroup.addChildAt(butch.states2,6);
                this.butcherList.push(butch);
            }
        }

        updateDifficulties(){
            if(this.killerCollection.score === 10 && this.shouldChangeDifficulty){
                this.shouldChangeDifficulty = false;
                this.triggerLevel(1);
            }
            else if (this.killerCollection.score === 20  && this.shouldChangeDifficulty){
                this.shouldChangeDifficulty = false;
                this.triggerLevel(2);
            }
            else if(this.killerCollection.score === 30 && this.shouldChangeDifficulty){
                this.shouldChangeDifficulty = false;
                this.triggerLevel(3);
            }
            if(this.killerCollection.score %10 === 1 && this.killerCollection.score>10){
                this.shouldChangeDifficulty=true;
            }
        }

        private cowThrowItems() {
            if (this.grenadeButton.buttonPressed) {
                this.grenadeButton.buttonPressed = false;
                this.thrownItems.push(this.cow.spawnGrenade());
            }
            if (this.knifeButton.buttonPressed) {
                this.knifeButton.buttonPressed = false;
                this.thrownItems.push(this.cow.spawnKnife());
            }
            if (this.shotgunButton.buttonPressed) {
                this.shotgunButton.buttonPressed = false;
                this.cow.shootShotgun(this.butcherList, this.killerCollection, this.pickUpItems,this.currentDifficulty);
            }
            if (this.gmoButton.buttonPressed) {
                this.gmoButton.buttonPressed = false;
                this.cow.pickUpGMO();
            }
        }

        private thrownItemsUpdate() {
            this.thrownItems.forEach((item)=> {
                item.rotation += 0.2;
                if (item.x > this.game.width) {
                    this.thrownItems.splice(this.thrownItems.indexOf(item, 1));
                    item.destroy();
                }
            })
        }

        private pickupItemsUpdate(difficulty:Difficulty) {
            this.pickUpItems.forEach((item)=> {
                item.rotation -= 0.2;
                this.game.physics.arcade.collide(item, this.currentLevel.ground.image, ()=> {
                    item.rotation += 0.2;
                    item.position.x -= difficulty.levelSpeed;
                });
                this.game.physics.arcade.collide(item, this.currentLevel.ground.secondImage, ()=> {
                    item.rotation += 0.2;
                    item.position.x -= difficulty.levelSpeed;
                });

                this.game.physics.arcade.overlap(item, this.cow.states, ()=> {
                    this.cow.pickUpKnife();
                    this.pickUpItems.splice(this.pickUpItems.indexOf(item), 1);
                    this.knifeButton.pickUpItem(1);
                    item.body.setSize(0, 0);
                    item.destroy();
                }, null, this.cow);

                if(item.position.x<-item.width || item.position.y>this.game.height){
                    this.pickUpItems.splice(this.pickUpItems.indexOf(item), 1);
                    item.destroy();
                }
            });

        }

        render() {
            //if(this.cow.states){
            //    this.game.debug.body(this.cow.states,"#ff0000",false);
            //}
            //if(this.butcherList[0]){
            //    this.game.debug.body(this.butcherList[0].states,"#ff0000",false);
            //}
            //
            //this.game.debug.text("cow: "+this.cow.states.position.x,20,20, "#FF0000");
            //if(this.thrownItems[0]){
            //    this.game.debug.body(this.thrownItems[0],"#ff0000",false);
            //}

            this.game.debug.text("knife: "+this.pickUpItems.length,20,20,"#FF0000");
            //if (this.currentLevel === this.levelTwo && this.levelTwo.treeCollection[0]) {
            //    this.game.debug.text("b: " + this.currentDifficulty.butchSpeed + " l: " + this.currentDifficulty.levelSpeed
            //        + " g: " + this.currentLevel.ground.velocity +
            //        " r: " + this.levelTwo.treeCollection[0].velocity, 20, 20, "#FF0000");
         //}
         //   this.game.debug.text("cow y: "+this.cow.states.position.y,20,20,"#FF0000");

        }

        triggerLevel(difficultyIndex:number) {
            this.currentDifficulty = this.difficulties[difficultyIndex];
            this.butcherList.forEach((butch)=>{
                butch.states.destroy();
                butch.states2.destroy();
            },this);

            this.butcherList = [];

            this.pickUpItems.forEach((item)=>{
                item.destroy();
            });
            this.pickUpItems=[];
            this.currentLevel.barbeques.forEach((bbq)=>{
                bbq.barbeque.destroy();
                bbq.smoke.destroy();
            });

            this.currentLevel.barbeques = [];
            this.currentLevel.walls.forEach((wall)=>{
                wall.destroy();
            });
            this.currentLevel.walls = [];

            this.currentLevel.platforms.forEach((platform)=>{
                platform.destroy();
            });
            this.currentLevel.platforms = [];

            var gameTween = this.game.add.tween(this.game.world);
            gameTween.to({alpha: 0}, 200, Phaser.Easing.Default, true, 0, 0, true);
            gameTween.onLoop.add(()=> {
                if (this.currentLevel === this.levelOne) {
                    this.currentLevel = this.levelTwo;
                    this.game.world.bringToTop(this.levelTwo.levelGroup);
                    this.game.world.bringToTop(this.killerCollection.killerGroup);
                    this.game.world.bringToTop(this.topGroup);
                }
                else {
                    this.currentLevel = this.levelOne;
                    this.game.world.bringToTop(this.levelOne.levelGroup);
                    this.game.world.bringToTop(this.killerCollection.killerGroup);
                    this.game.world.bringToTop(this.topGroup);

                }
            }, this);
            this.levelOne.ground.velocity = this.currentDifficulty.levelSpeed;
            this.levelTwo.ground.velocity = this.currentDifficulty.levelSpeed;
            this.levelTwo.grass.velocity = this.currentDifficulty.levelSpeed;
        }
    }
}
