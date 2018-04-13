/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\Levels\Level.ts"/>
///<reference path="..\Levels\KillerCollection.ts"/>
///<reference path="Cow.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    (function (ButcherStates) {
        ButcherStates[ButcherStates["IDLE"] = 0] = "IDLE";
        ButcherStates[ButcherStates["RUNNING"] = 1] = "RUNNING";
        ButcherStates[ButcherStates["SHOTGUN_DEATH"] = 2] = "SHOTGUN_DEATH";
        ButcherStates[ButcherStates["GRENADE_DEATH"] = 3] = "GRENADE_DEATH";
        ButcherStates[ButcherStates["KNIFE_DEATH"] = 4] = "KNIFE_DEATH";
        ButcherStates[ButcherStates["THROWN_BY_GMO"] = 5] = "THROWN_BY_GMO";
        ButcherStates[ButcherStates["DEAD"] = 6] = "DEAD";
    })(CowVsButcher.ButcherStates || (CowVsButcher.ButcherStates = {}));
    var ButcherStates = CowVsButcher.ButcherStates;
    ;
    var Butcher = (function () {
        function Butcher(game, velocity) {
            this.game = game;
            this.velocity = velocity;
            this.currentState = 1 /* RUNNING */;
            this.isDead = false;
            this.bloodThrown = false;
            this.states = this.game.add.sprite(1300, 400, "Butcher");
            this.states.animations.add("attack", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 30);
            this.states.animations.add("knifeDeath", [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], 30);
            this.states.animations.add("grenadeDeath", [23, 24, 25, 26, 27, 28, 29, 30, 31], 30);
            this.states.animations.add("idle", [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45], 30);
            this.states.animations.add("run", [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], 30);
            this.states.animations.add("shotgunDeath", [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68], 30);
            this.states.scale.set(-1, 1);
            this.states.anchor.set(0.5, 0.5);
            this.game.physics.arcade.enable(this.states);
            this.states.body.setSize(100, 100, -100, -50);
            this.states.body.fixedRotation = true;
            this.states.body.gravity.y = 1000;
            this.states2 = this.game.add.sprite(1300, 400, "Butcher2");
            this.states2.animations.add("gmo_death", [0, 1, 2, 3, 4, 5, 6, 7, 8], 30);
            this.states2.animations.add("sawDeath", [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 30);
            this.states2.scale.set(-1, 1);
            this.states2.anchor.set(0.5, 0.5);
            this.states2.alpha = 0;
            if (Math.random() < 0.5) {
                this.states.animations.play("run", null, true);
            }
            else {
                this.states.animations.play("attack", null, true);
            }
        }
        Butcher.prototype.update = function (currentLevel, killerCollection, butcherList, cow, thrownItems, pickUpItems, difficulty) {
            this.states.position.x -= this.velocity;
            this.game.physics.arcade.collide(this.states, currentLevel.ground.image);
            this.game.physics.arcade.collide(this.states, currentLevel.ground.secondImage);
            this.butcherCowCollision(cow, killerCollection);
            this.butcherItemCollision(thrownItems, killerCollection, pickUpItems, difficulty);
            this.shotgunAndSawDeath(killerCollection);
            this.gmoBlood(killerCollection);
            this.removeButcherFromGame(killerCollection, butcherList);
        };
        Butcher.prototype.changeToAttack = function () {
            var _this = this;
            this.states.animations.play("attack", null, false).onComplete.add(function () {
                _this.states.animations.play("run", null, true);
            });
        };
        Butcher.prototype.butcherCowCollision = function (cow, killerCollection) {
            var _this = this;
            this.game.physics.arcade.overlap(this.states, cow.states, function () {
                if (cow.currentState !== 6 /* GMO */) {
                    _this.changeToAttack();
                    cow.die();
                    killerCollection.gameOver = true;
                }
                else if (_this.currentState !== 5 /* THROWN_BY_GMO */) {
                    _this.thrownByGMO();
                }
            }, null, this);
        };
        Butcher.prototype.deathByItem = function (key, difficulty) {
            var _this = this;
            this.states.animations.play(key + "Death", null, false);
            this.isDead = true;
            this.states.body.setSize(0, 0, 0, 0);
            if (key === "grenade") {
                this.states.animations.currentAnim.onComplete.add(function () {
                    _this.states.alpha = 0;
                    _this.currentState = 3 /* GRENADE_DEATH */;
                }, this);
            }
            else if (key === "knife") {
                this.currentState = 4 /* KNIFE_DEATH */;
                this.velocity = difficulty.levelSpeed;
            }
            else if (key === "shotgun") {
                this.currentState = 2 /* SHOTGUN_DEATH */;
                this.states.animations.currentAnim.onComplete.add(function () {
                    _this.states.bringToTop();
                    _this.velocity = difficulty.levelSpeed;
                }, this);
            }
        };
        Butcher.prototype.butcherItemCollision = function (thrownItems, killerCollection, pickUpItems, difficulty) {
            var _this = this;
            thrownItems.forEach(function (item) {
                _this.game.physics.arcade.overlap(item, _this.states, function () {
                    killerCollection.updateKillsText();
                    _this.deathByItem(item.key, difficulty);
                    thrownItems.splice(thrownItems.indexOf(item), 1);
                    item.destroy();
                    var position = _this.states.body;
                    var offset = 100;
                    if (item.key === "grenade") {
                        killerCollection.boneEmitter.start(position.x + offset, position.y - offset + 10, true, 2000, Math.abs(RNG(1, 4)));
                    }
                    killerCollection.bloodEmitter.start(position.x + offset, position.y - offset + 10, true, 800, 50);
                    var shouldThrowKnifeRNG = Math.random();
                    if (shouldThrowKnifeRNG < 0.7) {
                        pickUpItems.push(_this.spawnPickUpKnife(position.x + offset, position.y - offset));
                    }
                }, null, _this);
            }, this);
        };
        Butcher.prototype.spawnPickUpKnife = function (x, y) {
            var knife = this.game.add.sprite(x, y, "knife");
            this.game.physics.arcade.enable(knife);
            knife.anchor.set(0.5, 0.5);
            knife.body.velocity.y = -500;
            knife.body.mass = 0;
            knife.body.collideWorldBounds = false;
            knife.body.setSize(20, 30, 0, 0);
            return knife;
        };
        Butcher.prototype.shotgunAndSawDeath = function (killerCollection) {
            if (this.states.body.x < 100 && this.currentState === 2 /* SHOTGUN_DEATH */) {
                this.states.alpha = 0;
                this.states.body.setSize(0, 0);
                this.states2.alpha = 1;
                this.states2.position.x = this.states.position.x;
                this.states2.position.y = this.states.position.y;
                var positionTween = this.game.add.tween(this.states2.position);
                positionTween.to({ x: -500 }, 2000, Phaser.Easing.Default, true);
                killerCollection.killerGroup.bringToTop(this.states2);
                this.states2.animations.play("sawDeath", null, false);
            }
            if (this.states2.alpha === 1) {
                this.states2.rotation -= 0.02;
            }
            if (this.states2.alpha === 1 && this.states2.position.x < 200 && !this.bloodThrown && this.currentState !== 5 /* THROWN_BY_GMO */) {
                this.bloodThrown = true;
                killerCollection.killerGroup.bringToTop(killerCollection.bloodEmitter.emitter);
                killerCollection.bloodEmitter.start(70, 480, true, 800, 50);
                killerCollection.killerGroup.bringToTop(this.states2);
                killerCollection.secondSaw.triggerSaw();
                killerCollection.updateKillsText();
            }
        };
        Butcher.prototype.gmoBlood = function (killerCollection) {
            if (this.states2.alpha === 1 && this.states2.position.x < 200 && !this.bloodThrown && this.currentState === 5 /* THROWN_BY_GMO */) {
                this.bloodThrown = true;
                killerCollection.updateKillsText();
                killerCollection.killerGroup.bringToTop(killerCollection.bloodEmitter.emitter);
                killerCollection.bloodEmitter.start(70, 80, true, 800, 400);
                killerCollection.killerGroup.sendToBack(this.states2);
                killerCollection.firstSaw.triggerSaw();
            }
        };
        Butcher.prototype.thrownByGMO = function () {
            this.game.physics.arcade.enable(this.states2);
            this.states.alpha = 0;
            this.states.body.setSize(0, 0);
            this.states2.alpha = 1;
            this.states2.position.x = this.states.position.x;
            this.states2.position.y = this.states.position.y;
            this.states2.animations.play("gmo_death", null, true);
            this.states2.body.velocity.y = -1200;
            this.states2.body.velocity.x = -500;
            this.currentState = 5 /* THROWN_BY_GMO */;
        };
        Butcher.prototype.removeButcherFromGame = function (killerCollection, butcherList) {
            if (this.states.position.x < -200 || this.states2.position.x < -200) {
                this.currentState = 6 /* DEAD */;
            }
            if (this.currentState === 6 /* DEAD */ || this.currentState === 3 /* GRENADE_DEATH */) {
                killerCollection.killerGroup.remove(this.states);
                killerCollection.killerGroup.remove(this.states2);
                butcherList.splice(butcherList.indexOf(this), 1);
                this.states.destroy();
                this.states2.destroy();
            }
        };
        return Butcher;
    })();
    CowVsButcher.Butcher = Butcher;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Butcher.js.map