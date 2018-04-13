/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\Levels\Level.ts"/>
///<reference path="..\Levels\KillerCollection.ts"/>
///<reference path="Cow.ts"/>
module CowVsButcher{
    export enum ButcherStates {IDLE, RUNNING, SHOTGUN_DEATH,
    GRENADE_DEATH, KNIFE_DEATH, THROWN_BY_GMO, DEAD};

    export class Butcher {
        game: Phaser.Game;
        states:Phaser.Sprite;
        states2:Phaser.Sprite;

        velocity:number;
        currentState: ButcherStates;
        isDead:boolean;
        bloodThrown:boolean;

        constructor(game:Phaser.Game, velocity){
            this.game = game;
            this.velocity = velocity;
            this.currentState = ButcherStates.RUNNING;
            this.isDead = false;
            this.bloodThrown = false;

            this.states = this.game.add.sprite(1300,400, "Butcher");
            this.states.animations.add("attack", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 30);
            this.states.animations.add("knifeDeath", [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 30);
            this.states.animations.add("grenadeDeath", [23, 24, 25, 26, 27, 28, 29, 30, 31], 30);
            this.states.animations.add("idle", [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45], 30);
            this.states.animations.add("run", [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], 30);
            this.states.animations.add("shotgunDeath", [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68], 30);

            this.states.scale.set(-1,1);
            this.states.anchor.set(0.5,0.5);
            this.game.physics.arcade.enable(this.states);
            this.states.body.setSize(100,100, -100,-50);
            this.states.body.fixedRotation = true;
            this.states.body.gravity.y = 1000;

            this.states2 = this.game.add.sprite(1300, 400, "Butcher2");
            this.states2.animations.add("gmo_death", [0,1,2,3,4,5,6,7,8],30);
            this.states2.animations.add("sawDeath", [9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],30);
            this.states2.scale.set(-1,1);
            this.states2.anchor.set(0.5,0.5);
            this.states2.alpha = 0;

            if(Math.random()<0.5){
                this.states.animations.play("run",null,true);
            }
            else{
                this.states.animations.play("attack",null, true);
            }
        }

        update(currentLevel:Level, killerCollection:KillerCollection, butcherList:Array<Butcher>,cow:Cow,
               thrownItems:Array<Phaser.Sprite>,pickUpItems:Array<Phaser.Sprite>, difficulty:Difficulty){
            this.states.position.x -= this.velocity;
            this.game.physics.arcade.collide(this.states,currentLevel.ground.image);
            this.game.physics.arcade.collide(this.states,currentLevel.ground.secondImage);

            this.butcherCowCollision(cow, killerCollection);
            this.butcherItemCollision(thrownItems, killerCollection, pickUpItems, difficulty);
            this.shotgunAndSawDeath(killerCollection);
            this.gmoBlood(killerCollection);
            this.removeButcherFromGame(killerCollection, butcherList);
        }
        changeToAttack(){
            this.states.animations.play("attack",null,false)
            .onComplete.add(()=>{
                    this.states.animations.play("run",null,true);
                });
        }

        butcherCowCollision(cow:Cow, killerCollection:KillerCollection){
            this.game.physics.arcade.overlap(this.states, cow.states, ()=>{
                if(cow.currentState !==CowStates.GMO){
                    this.changeToAttack();
                    cow.die();
                    killerCollection.gameOver = true;
                }
                else if (this.currentState !==ButcherStates.THROWN_BY_GMO){
                    this.thrownByGMO();
                }
            }, null, this);
        }

        deathByItem(key,difficulty:Difficulty){
            this.states.animations.play(key+"Death",null,false);
            this.isDead = true;
            this.states.body.setSize(0,0,0,0);

            if(key === "grenade"){
                this.states.animations.currentAnim.onComplete.add(()=>{
                   this.states.alpha = 0;
                    this.currentState = ButcherStates.GRENADE_DEATH;
                },this);
            }

            else if (key === "knife"){
                this.currentState = ButcherStates.KNIFE_DEATH;
                this.velocity = difficulty.levelSpeed;
            }
            else if (key === "shotgun"){
                this.currentState = ButcherStates.SHOTGUN_DEATH;
                this.states.animations.currentAnim.onComplete.add(()=>{
                    this.states.bringToTop();
                    this.velocity = difficulty.levelSpeed;
                },this);
            }
        }

        butcherItemCollision(thrownItems:Array<Phaser.Sprite>, killerCollection:KillerCollection, pickUpItems:Array<Phaser.Sprite>, difficulty:Difficulty){
            thrownItems.forEach((item)=>{
                this.game.physics.arcade.overlap(item, this.states, ()=>{
                    killerCollection.updateKillsText();
                    this.deathByItem(item.key,difficulty);
                    thrownItems.splice(thrownItems.indexOf(item),1);
                    item.destroy();

                    var position = this.states.body;
                    var offset = 100;
                    if(item.key === "grenade"){
                        killerCollection.boneEmitter.start(position.x+offset, position.y - offset+10,true,2000,Math.abs(RNG(1,4)));
                    }

                    killerCollection.bloodEmitter.start(position.x+offset, position.y - offset+10,true,800,50);

                    var shouldThrowKnifeRNG = Math.random();
                    if(shouldThrowKnifeRNG<0.7){
                        pickUpItems.push(this.spawnPickUpKnife(position.x+offset,position.y-offset));
                    }
                },null,this);
            },this);
        }

        spawnPickUpKnife(x:number, y:number){
            var knife = this.game.add.sprite(x,y,"knife");
            this.game.physics.arcade.enable(knife);
            knife.anchor.set(0.5,0.5);
            knife.body.velocity.y = -500;
            knife.body.mass = 0;
            knife.body.collideWorldBounds = false;
            knife.body.setSize(20,30,0,0);

            return knife;
        }

        shotgunAndSawDeath(killerCollection:KillerCollection){
            if(this.states.body.x<100 && this.currentState === ButcherStates.SHOTGUN_DEATH){

                this.states.alpha = 0;
                this.states.body.setSize(0,0);
                this.states2.alpha = 1;
                this.states2.position.x = this.states.position.x;
                this.states2.position.y = this.states.position.y;

                var positionTween = this.game.add.tween(this.states2.position);
                positionTween.to({x:-500},2000, Phaser.Easing.Default,true);
                killerCollection.killerGroup.bringToTop(this.states2);

                this.states2.animations.play("sawDeath",null,false);

            }
            if(this.states2.alpha ===1){
                this.states2.rotation -=0.02;
            }

            if(this.states2.alpha === 1 &&
            this.states2.position.x<200 &&
            !this.bloodThrown &&
            this.currentState!== ButcherStates.THROWN_BY_GMO){
                this.bloodThrown = true;
                killerCollection.killerGroup.bringToTop(killerCollection.bloodEmitter.emitter);
                killerCollection.bloodEmitter.start(70,480,true,800,50);
                killerCollection.killerGroup.bringToTop(this.states2);
                killerCollection.secondSaw.triggerSaw();
                killerCollection.updateKillsText();
            }
        }

        gmoBlood(killerCollection:KillerCollection){
            if(this.states2.alpha ===1 &&
                this.states2.position.x<200 &&
                !this.bloodThrown &&
                this.currentState ===ButcherStates.THROWN_BY_GMO){
                this.bloodThrown = true;
                killerCollection.updateKillsText();
                killerCollection.killerGroup.bringToTop(killerCollection.bloodEmitter.emitter);
                killerCollection.bloodEmitter.start(70,80,true, 800, 400);
                killerCollection.killerGroup.sendToBack(this.states2);
                killerCollection.firstSaw.triggerSaw();

            }
        }
        thrownByGMO(){
            this.game.physics.arcade.enable(this.states2);
            this.states.alpha = 0;
            this.states.body.setSize(0,0);
            this.states2.alpha = 1;
            this.states2.position.x = this.states.position.x;
            this.states2.position.y = this.states.position.y;
            this.states2.animations.play("gmo_death",null,true);
            this.states2.body.velocity.y = -1200;
            this.states2.body.velocity.x = -500;

            this.currentState = ButcherStates.THROWN_BY_GMO;
        }

        removeButcherFromGame(killerCollection:KillerCollection, butcherList:Array<Butcher>){
            if(this.states.position.x<-200 || this.states2.position.x<-200){
                this.currentState = ButcherStates.DEAD;
            }

            if(this.currentState === ButcherStates.DEAD || this.currentState === ButcherStates.GRENADE_DEATH){
                killerCollection.killerGroup.remove(this.states);
                killerCollection.killerGroup.remove(this.states2);
                butcherList.splice(butcherList.indexOf(this),1);
                this.states.destroy();
                this.states2.destroy();

            }

        }
    }
}