/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\Levels\KillerCollection.ts"/>
///<reference path="Cow.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var Barbeque = (function () {
        function Barbeque(game, speed) {
            this.game = game;
            this.speed = speed;
            this.barbeque = this.game.add.sprite(this.game.width * 1.3, this.game.height, "barbeque");
            this.barbeque.scale.set(0.5);
            this.barbeque.anchor.set(0.5, 1);
            this.game.physics.arcade.enable(this.barbeque);
            this.barbeque.body.moves = false;
            this.barbeque.body.immovable = true;
            this.smoke = this.game.add.sprite(this.game.width * 1.3, this.game.height * 0.75, "smoke");
            this.smoke.animations.add("smoking");
            this.smoke.anchor.set(0.5, 0.5);
            this.smoke.animations.play("smoking", 10, true);
            this.smoke.alpha = 0.7;
            this.smoke.rotation = 90;
        }
        Barbeque.prototype.update = function (cow, killerCollection) {
            this.smoke.position.x -= this.speed;
            this.barbeque.position.x -= this.speed;
            this.game.physics.arcade.collide(cow.states, this.barbeque, function () {
                cow.currentState = 8 /* BBQ_BURN */;
                cow.states.animations.currentAnim.stop();
                cow.states.animations.play("burning", null, true);
                cow.states.body.immovable = true;
                cow.states.body.moves = false;
                killerCollection.gameOver = true;
            });
        };
        return Barbeque;
    })();
    CowVsButcher.Barbeque = Barbeque;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Barbeque.js.map