/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\ParallaxBackground.ts"/>
///<reference path="KillerCollection.ts"/>
///<reference path="..\GameObjects\Barbeque.ts"/>
///<reference path="..\GameObjects\Difficulty.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var Level = (function () {
        function Level(game) {
            this.game = game;
        }
        Level.prototype.create = function (difficulty) {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.enable(this.ground.image);
            this.game.physics.enable(this.ground.secondImage);
            this.game.physics.arcade.gravity.y = 1500;
            this.ground.image.body.immovable = true;
            this.ground.image.body.moves = false;
            this.ground.secondImage.body.immovable = true;
            this.ground.secondImage.body.moves = false;
            this.walls = [];
            this.platforms = [];
            this.barbeques = [];
            this.randomWallSpawnTime = this.game.time.now;
            this.randomPlatformSpawnTime = this.game.time.now;
            this.randomBBQSpawnTime = this.game.time.now;
        };
        Level.prototype.update = function (killerCollection, cow, difficulty) {
            var _this = this;
            this.ground.update();
            this.background.update();
            this.spawnBBQ(difficulty);
            this.updateBBQs(cow, killerCollection);
            this.barbeques.forEach(function (bbq) {
                _this.game.world.bringToTop(bbq.barbeque);
                _this.game.world.bringToTop(bbq.smoke);
            });
        };
        Level.prototype.spawnPlatform = function (key, difficulty) {
            if (this.randomPlatformSpawnTime + 1500 < this.game.time.now) {
                this.randomPlatformSpawnTime = this.game.time.now + RNG(difficulty.rngPlatformLow, difficulty.rngPlatformHigh);
                var rngPlatformLevel = (this.game.height - 180) - Math.floor(RNG(1, 3)) * 180;
                var platform = this.game.add.sprite(this.game.width, rngPlatformLevel, key);
                //this.levelGroup.addChildAt(platform, 6);
                this.levelGroup.bringToTop(platform);
                this.game.physics.arcade.enable(platform);
                platform.scale.set(0.5);
                platform.body.checkCollision.up = true;
                platform.body.checkCollision.down = false;
                platform.body.checkCollision.left = false;
                platform.body.checkCollision.right = false;
                platform.body.immovable = true;
                platform.body.moves = false;
                this.platforms.push(platform);
            }
        };
        Level.prototype.updatePlatforms = function (cow, difficulty) {
            var _this = this;
            this.platforms.forEach(function (platform) {
                platform.position.x -= difficulty.levelSpeed;
                _this.game.physics.arcade.collide(cow.states, platform, function () {
                    cow.changeToRunning();
                });
                if (platform.position.x < -platform.width) {
                    _this.platforms.splice(_this.platforms.indexOf(platform), 1);
                    platform.destroy();
                }
            }, this);
        };
        Level.prototype.spawnWall = function (key, difficulty) {
            if (this.randomWallSpawnTime + 2300 < this.game.time.now) {
                this.randomWallSpawnTime = this.game.time.now + RNG(difficulty.rngWallLow, difficulty.rngWallHigh);
                var wall = this.game.add.sprite(this.game.width, 586, key);
                wall.anchor.set(0, 1);
                //this.levelGroup.addChildAt(wall,8);
                this.levelGroup.bringToTop(wall);
                this.game.physics.arcade.enable(wall);
                wall.scale.set(RNG(0.7, 0.8));
                wall.body.immovable = true;
                wall.body.moves = false;
                this.walls.push(wall);
            }
        };
        Level.prototype.updateWalls = function (cow, difficulty) {
            var _this = this;
            this.walls.forEach(function (wall) {
                wall.position.x -= difficulty.levelSpeed;
                _this.game.physics.arcade.collide(cow.states, wall, function () {
                    cow.changeToRunning();
                    if (wall.position.x < -wall.width) {
                        _this.walls.splice(_this.walls.indexOf(wall), 1);
                        wall.destroy();
                    }
                });
            });
        };
        Level.prototype.spawnBBQ = function (difficulty) {
            if (this.randomBBQSpawnTime + 600 < this.game.time.now) {
                this.randomBBQSpawnTime = this.game.time.now + RNG(difficulty.rngBBQLow, difficulty.rngBBQHigh);
                var bbq = new CowVsButcher.Barbeque(this.game, difficulty.levelSpeed);
                //this.levelGroup.addChildAt(bbq.barbeque,6);
                //this.levelGroup.addChildAt(bbq.smoke,9);
                this.levelGroup.bringToTop(bbq.barbeque);
                this.levelGroup.bringToTop(bbq.smoke);
                this.barbeques.push(bbq);
            }
        };
        Level.prototype.updateBBQs = function (cow, killerCollection) {
            var _this = this;
            this.barbeques.forEach(function (bbq) {
                bbq.update(cow, killerCollection);
                if (bbq.barbeque.position.x < -bbq.barbeque.width) {
                    _this.barbeques.splice(_this.barbeques.indexOf(bbq), 1);
                    bbq.barbeque.destroy();
                    bbq.smoke.destroy();
                }
            });
        };
        return Level;
    })();
    CowVsButcher.Level = Level;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Level.js.map