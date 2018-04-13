/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\ParallaxBackground.ts"/>
///<reference path="Butcher.ts"/>
///<reference path="..\Levels\KillerCollection.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    (function (CowStates) {
        CowStates[CowStates["IDLE"] = 0] = "IDLE";
        CowStates[CowStates["RUNNING"] = 1] = "RUNNING";
        CowStates[CowStates["JUMPING"] = 2] = "JUMPING";
        CowStates[CowStates["DOUBLE_JUMPING"] = 3] = "DOUBLE_JUMPING";
        CowStates[CowStates["PICKING_ITEM"] = 4] = "PICKING_ITEM";
        CowStates[CowStates["THROWING_ITEM"] = 5] = "THROWING_ITEM";
        CowStates[CowStates["GMO"] = 6] = "GMO";
        CowStates[CowStates["THROWING_BUTCHER"] = 7] = "THROWING_BUTCHER";
        CowStates[CowStates["BBQ_BURN"] = 8] = "BBQ_BURN";
        CowStates[CowStates["ELECTRIFIED"] = 9] = "ELECTRIFIED";
        CowStates[CowStates["DEAD"] = 10] = "DEAD";
    })(CowVsButcher.CowStates || (CowVsButcher.CowStates = {}));
    var CowStates = CowVsButcher.CowStates;
    var Cow = (function () {
        function Cow(game) {
            this.game = game;
            this.currentState = 1 /* RUNNING */;
            this.states = this.game.add.sprite(300, 300, "Cow");
            this.states.animations.add("burning", [0, 1, 2, 3, 4, 5, 6, 7, 8], 30);
            this.states.animations.add("doubleJump", [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 30);
            this.states.animations.add("electrified", [24, 25, 26, 27, 28, 29, 30, 31], 30);
            this.states.animations.add("GMO", [32, 33, 34, 35, 36, 37, 38, 39], 30);
            this.states.animations.add("idle", [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], 30);
            this.states.animations.add("jump", [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65], 30);
            this.states.animations.add("run", [68, 69, 70, 71, 72, 73, 74, 75, 76], 30);
            this.states.animations.add("shotgun", [77, 78, 79, 80, 81, 82, 83, 84, 85], 50);
            this.states.animations.add("throwKnife", [86, 87, 88, 89, 90, 91, 92, 93, 94], 50);
            this.states.animations.add("throwGrenade", [95, 96, 97, 98, 99, 100, 101, 102, 103], 50);
            this.states.animations.add("transformGMO", [104, 105, 106, 107, 108, 109, 110, 111], 30);
            this.states.animations.play("run", null, true);
            this.game.physics.arcade.enable(this.states);
            this.states.anchor.set(0.5, 0.5);
            this.states.body.setSize(100, 100, 25, -50);
            this.states.body.fixedRotation = true;
            this.states.body.gravity.y = 1000;
            this.states2 = this.game.add.sprite(300, 300, "Cow2");
            this.states2.animations.add("pickupKnife", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 30);
            this.states2.animations.add("dying", [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 15);
            this.states2.alpha = 0;
            this.states2.anchor.set(0.5, 0.5);
            this.inputBG = this.game.add.sprite(0, 0, "");
            this.inputBG.alpha = 0;
            this.inputBG.width = 1280;
            this.inputBG.height = 720;
            this.inputBG.inputEnabled = true;
            this.inputBG.input.priorityID = 0;
            this.inputBG.events.onInputDown.addOnce(this.jump, this);
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.spaceKey.onDown.addOnce(this.jump, this);
            this.cowAlreadyPushed = false;
            this.cowMovingRight = false;
        }
        Cow.prototype.update = function (ground, killerCollection) {
            if (this.currentState === 1 /* RUNNING */) {
                this.states.animations.play("run");
                this.inputBG.events.onInputDown.addOnce(this.jump, this);
                this.spaceKey.onDown.addOnce(this.jump, this);
            }
            if (this.states.animations.currentAnim.loopCount === 5 && this.currentState === 6 /* GMO */) {
                this.states.body.immovable = false;
                this.states.body.moves = true;
                this.currentState = 1 /* RUNNING */;
            }
            this.game.physics.arcade.collide(this.states, ground.image, this.changeToRunning, null, this);
            this.game.physics.arcade.collide(this.states, ground.secondImage, this.changeToRunning, null, this);
            if (this.states.position.x < 100) {
                this.die();
                killerCollection.gameOver = true;
            }
            this.cowPushedFixPosition();
        };
        Cow.prototype.cowPushedFixPosition = function () {
            var _this = this;
            if (this.states.position.x < 300 && !this.cowAlreadyPushed) {
                this.cowAlreadyPushed = true;
                this.game.time.events.add(5000, function () {
                    _this.cowMovingRight = true;
                });
            }
            if (this.cowMovingRight) {
                this.states.position.x += 0.25;
            }
            if (this.states.position.x >= 300) {
                this.cowMovingRight = false;
                this.cowAlreadyPushed = false;
            }
        };
        Cow.prototype.jump = function () {
            if (this.currentState === 1 /* RUNNING */ || this.currentState === 4 /* PICKING_ITEM */) {
                this.states2.alpha = 0;
                this.states.alpha = 1;
                this.states.body.velocity.y = -1100;
                this.currentState = 2 /* JUMPING */;
                this.states.animations.play("jump", null, false);
                this.inputBG.events.onInputDown.addOnce(this.doubleJump, this);
                this.spaceKey.onDown.addOnce(this.doubleJump, this);
            }
        };
        Cow.prototype.doubleJump = function () {
            if (this.currentState === 2 /* JUMPING */) {
                this.currentState = 3 /* DOUBLE_JUMPING */;
                this.states.body.velocity.y = -1000;
                this.states.animations.play("doubleJump", null, false);
            }
        };
        Cow.prototype.changeToRunning = function () {
            if (this.currentState === 2 /* JUMPING */ || this.currentState === 3 /* DOUBLE_JUMPING */) {
                this.currentState = 1 /* RUNNING */;
            }
        };
        Cow.prototype.changeAnimationRepeating = function (key) {
            this.states.animations.play(key, null, true);
        };
        Cow.prototype.changeAnimation = function (key) {
            var _this = this;
            this.states.animations.play(key, null, false).onComplete.addOnce(function () {
                _this.states.animations.play("run", null, true);
                _this.currentState = 1 /* RUNNING */;
            });
        };
        Cow.prototype.spawnGrenade = function () {
            var grenade = this.game.add.sprite(this.states.body.x + 290, this.states.body.y - 40, "grenade");
            this.game.physics.arcade.enable(grenade);
            grenade.anchor.set(0.5, 0.5);
            grenade.body.velocity.x = 1500;
            grenade.body.velocity.y = -400;
            grenade.body.setSize(1, 200, -100, 80);
            grenade.body.mass = 1000;
            return grenade;
        };
        Cow.prototype.spawnKnife = function () {
            var knife = this.game.add.sprite(this.states.body.x + 290, this.states.body.y - 40, "knife");
            this.game.physics.arcade.enable(knife);
            knife.anchor.set(0.5, 0.5);
            knife.body.velocity.x = 800;
            knife.body.velocity.y = -500;
            knife.body.mass = 0;
            knife.body.setSize(1, 200, -100, 80);
            return knife;
        };
        Cow.prototype.shootShotgun = function (butcherList, killerCollection, pickUpItems, difficulty) {
            for (var i = 0; i < butcherList.length; i++) {
                var butch = butcherList[i];
                if (Math.abs(this.states.position.y - butch.states.position.y) <= 80 && this.states.position.x < butch.states.position.x && butch.currentState === 1 /* RUNNING */) {
                    var position = butch.states.body;
                    var offset = 100;
                    killerCollection.bloodEmitter.start(position.x + offset, position.y, true, 800, 50);
                    butch.deathByItem("shotgun", difficulty);
                    pickUpItems.push(butch.spawnPickUpKnife(position.x + offset, position.y - offset));
                    break;
                }
            }
        };
        Cow.prototype.pickUpGMO = function () {
            var _this = this;
            this.currentState = 6 /* GMO */;
            this.states.animations.play("transformGMO", null, false).onComplete.add(function () {
                _this.states.animations.play("GMO", null, true);
            });
        };
        Cow.prototype.pickUpKnife = function () {
            var _this = this;
            this.states.alpha = 0;
            this.states2.alpha = 1;
            this.states2.position.x = this.states.position.x;
            this.states2.position.y = 586;
            this.states2.animations.play("pickupKnife", null, false);
            this.states2.animations.currentAnim.onComplete.addOnce(function () {
                _this.states.alpha = 1;
                _this.states2.alpha = 0;
            }, this);
        };
        Cow.prototype.die = function () {
            this.states.alpha = 0;
            this.states2.alpha = 1;
            this.states2.position.x = this.states.position.x;
            this.states2.position.y = this.states.position.y;
            this.states2.animations.play("dying", null, false);
            this.cowHead = this.game.add.sprite(this.states2.position.x, this.states2.position.y, "CowHead");
            this.cowHead.anchor.set(0.5, 0.5);
            this.game.physics.enable(this.cowHead);
            this.cowHead.body.velocity.y = -800;
            this.cowHead.body.velocity.x = 30;
            this.cowHead.body.mass = 1000;
            this.cowHead.body.bounce.set(0.3);
        };
        return Cow;
    })();
    CowVsButcher.Cow = Cow;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Cow.js.map