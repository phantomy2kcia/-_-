/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\BloodEmitter.ts"/>
///<reference path="..\GraphicUtils\Emitter.ts"/>
///<reference path="..\GraphicUtils\Saw.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var KillerCollection = (function () {
        function KillerCollection(game) {
            this.game = game;
        }
        KillerCollection.prototype.create = function () {
            this.killerGroup = this.game.add.group();
            this.gameOver = false;
            this.firstSaw = new CowVsButcher.Saw(this.game, "default_saw", "bloody_saw", "bloodier_saw", 0, 140, 0.4, this.killerGroup);
            this.secondSaw = new CowVsButcher.Saw(this.game, "default_saw", "bloody_saw", "bloodier_saw", 0, 530, 0.5, this.killerGroup);
            this.thirdSaw = new CowVsButcher.Saw(this.game, "default_saw", "bloody_saw", "bloodier_saw", 0, 320, 0.7, this.killerGroup);
            this.sawCollection = [];
            this.sawCollection.push(this.firstSaw);
            this.sawCollection.push(this.secondSaw);
            this.sawCollection.push(this.thirdSaw);
            this.burgerEmitter = new CowVsButcher.Emitter(this.game, 5, 200, ["burger"]);
            this.sausageEmitter = new CowVsButcher.Emitter(this.game, 5, 200, ["sausage"]);
            this.boneEmitter = new CowVsButcher.Emitter(this.game, 5, 500, ["bloody_bone", "bone"]);
            this.featherEmitter = new CowVsButcher.Emitter(this.game, 5, -1000, ["feather"]);
            this.bloodEmitter = new CowVsButcher.BloodEmitter(this.game, 5, 500);
            this.killerGroup.addMultiple([this.bloodEmitter.emitter, this.featherEmitter.emitter, this.boneEmitter.emitter, this.sausageEmitter.emitter, this.burgerEmitter.emitter]);
            this.score = 0;
            var killsTextStyle = { fill: "#4e0a09" };
            this.killsText = this.game.add.text(100, this.game.height * 0.85, "KILLS: " + this.score.toString(), killsTextStyle);
            this.killsText.font = "28-days-later";
            this.killsText.fontSize = 90;
            this.killsText.fontWeight = "normal";
            this.killerGroup.add(this.killsText);
        };
        KillerCollection.prototype.update = function () {
            this.sawCollection.forEach(function (saw) {
                saw.update();
            });
            this.burgerEmitter.update();
            this.sausageEmitter.update();
            this.boneEmitter.update();
            this.featherEmitter.update();
        };
        KillerCollection.prototype.updateKillsText = function () {
            this.score++;
            this.killsText.text = "KILLS: " + this.score.toString();
        };
        return KillerCollection;
    })();
    CowVsButcher.KillerCollection = KillerCollection;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=KillerCollection.js.map