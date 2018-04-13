/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\Levels\KillerCollection.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CowVsButcher;
(function (CowVsButcher) {
    var GameOver = (function (_super) {
        __extends(GameOver, _super);
        function GameOver() {
            _super.apply(this, arguments);
        }
        GameOver.prototype.init = function (score, maxScore) {
            this.score = score;
            this.maxScore = maxScore;
        };
        GameOver.prototype.create = function () {
            var _this = this;
            //TODO: ADD Game Over screen
            var randomBackgroundIndex = Math.floor(RNG(1, 3));
            this.game.add.image(0, 0, "gameOver" + randomBackgroundIndex);
            var bloodEmitter = new CowVsButcher.BloodEmitter(this.game, 50, 1000);
            bloodEmitter.emitter.x = 100;
            bloodEmitter.emitter.y = 100;
            bloodEmitter.emitter.start(false, 1000, 0, 5000, false);
            this.burgerEmitter = new CowVsButcher.Emitter(this.game, 5, 200, ["burger", "CowHead"]);
            this.sausageEmitter = new CowVsButcher.Emitter(this.game, 5, 200, ["sausage", "CowHead"]);
            this.burgerEmitter.emitter.setScale(1);
            this.sausageEmitter.emitter.setScale(1);
            this.sausageEmitter.emitter.setXSpeed(50, 300);
            this.burgerEmitter.emitter.setXSpeed(50, 300);
            this.sausageEmitter.emitter.maxParticles = 20;
            this.burgerEmitter.emitter.maxParticles = 20;
            this.saw = this.game.add.image(20, 20, "bloodier_saw");
            this.saw.anchor.set(0.5);
            this.saw.scale.set(0.7, 0.7);
            var playButton = this.game.add.button(this.game.width * 0.76, this.game.height * 0.01, "PlayButton", this.startGame, this);
            playButton.scale.set(0.7);
            this.quitButton = this.game.add.button(this.game.width * 0.76, this.game.height * 0.15, "QuitButton", this.moveButton, this);
            this.quitButton.scale.set(0.7);
            var killsTextStyle = { fill: "#4e0a09" };
            var killsText = this.game.add.text(25, this.game.height * 0.7, "KILLS: " + this.score.toString(), killsTextStyle);
            killsText.font = "28-days-later";
            killsText.fontSize = 90;
            killsText.fontWeight = "normal";
            var bestScoreStyle = { fill: "#4e0a09" };
            var bestScoreText = this.game.add.text(25, this.game.height * 0.85, "BEST: " + this.maxScore, bestScoreStyle);
            bestScoreText.font = "28-days-later";
            bestScoreText.fontSize = 90;
            bestScoreText.fontWeight = "normal";
            var gameOverTextStyle = { fill: "#4e0a09" };
            var gameOverText = this.game.add.text(300, 200, "GAME OVER", gameOverTextStyle);
            gameOverText.font = "28-days-later";
            gameOverText.fontSize = 110;
            gameOverText.fontWeight = "normal";
            gameOverText.anchor.set(0.5, 0.5);
            gameOverText.rotation = -Math.PI / 6.5;
            if (randomBackgroundIndex === 1) {
                this.game.time.events.loop(500, function () {
                    _this.sausageEmitter.start(50, 50, true, 5000, 3);
                }, this);
            }
            else {
                this.game.time.events.loop(500, function () {
                    _this.burgerEmitter.start(50, 50, true, 5000, 1);
                }, this);
            }
        };
        GameOver.prototype.update = function () {
            this.saw.rotation += 0.05;
        };
        GameOver.prototype.startGame = function () {
            this.game.state.start("Game");
        };
        GameOver.prototype.moveButton = function () {
            this.game.add.tween(this.quitButton).to({ x: RNG(0, 1280 - this.quitButton.width), y: RNG(0, 720 - this.quitButton.height) }, 400, Phaser.Easing.Default, true);
            this.quitButton.onInputDown.addOnce(this.exitGame, this);
        };
        GameOver.prototype.exitGame = function () {
           self.opener = self;
           self.close();
        };
        return GameOver;
    })(Phaser.State);
    CowVsButcher.GameOver = GameOver;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=GameOver.js.map