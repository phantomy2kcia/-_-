var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\Steak.ts"/>
///<reference path="..\GraphicUtils\ParallaxBackground.ts"/>
///<reference path="Level.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var LevelOne = (function (_super) {
        __extends(LevelOne, _super);
        function LevelOne(game) {
            _super.call(this, game);
        }
        LevelOne.prototype.create = function (difficulty) {
            this.levelGroup = this.game.add.group();
            this.background = new CowVsButcher.ParallaxBackground(this.game, "slaughter_background", 2.5, -100, this.levelGroup);
            this.steakHanger = new CowVsButcher.ParallaxBackground(this.game, "platform", 4, -30, this.levelGroup);
            this.steakCollection = [];
            this.randomSteakSpawnTime = this.game.time.now;
            this.ground = new CowVsButcher.ParallaxBackground(this.game, "ground", difficulty.levelSpeed, 586, this.levelGroup);
            _super.prototype.create.call(this, difficulty);
        };
        LevelOne.prototype.update = function (killerCollection, cow, difficulty) {
            _super.prototype.update.call(this, killerCollection, cow, difficulty);
            this.steakHanger.update();
            this.spawnSteak();
            this.updateSteaks(killerCollection);
            this.spawnPlatform("platformIndoor1", difficulty);
            this.updatePlatforms(cow, difficulty);
            this.spawnWall("wallIndoor", difficulty);
            this.updateWalls(cow, difficulty);
        };
        LevelOne.prototype.spawnSteak = function () {
            if (this.game.time.now > this.randomSteakSpawnTime) {
                this.randomSteakSpawnTime = this.game.time.now + RNG(3, 6) * 1000;
                var steak = new CowVsButcher.Steak(this.game, "steak", 4, 50, this.levelGroup);
                this.steakCollection.push(steak);
                this.levelGroup.addChildAt(steak.sprite, 6);
            }
        };
        LevelOne.prototype.updateSteaks = function (killerCollection) {
            this.steakCollection.forEach(function (steak) {
                steak.update(killerCollection);
                if (steak.sprite.position.x <= -steak.sprite.width) {
                    steak.sprite.alpha = 0;
                    steak.sprite.destroy();
                }
            });
            if (this.steakCollection[0] && this.steakCollection[0].sprite.alpha === 0) {
                this.steakCollection.splice(0, 1);
            }
        };
        return LevelOne;
    })(CowVsButcher.Level);
    CowVsButcher.LevelOne = LevelOne;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=LevelOne.js.map