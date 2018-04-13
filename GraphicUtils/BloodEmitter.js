/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="Blood.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var BloodEmitter = (function () {
        function BloodEmitter(game, width, gravity) {
            this.game = game;
            this.emitter = this.game.add.emitter(100, 100, 2000);
            this.emitter.particleClass = CowVsButcher.Blood;
            this.emitter.width = width;
            this.emitter.makeParticles("Blood");
            this.emitter.gravity = gravity;
            this.emitter.setAlpha(0.8, 0.3);
        }
        BloodEmitter.prototype.start = function (x, y, explode, lifespan, quantity) {
            this.emitter.x = x;
            this.emitter.y = y;
            this.emitter.start(explode, lifespan, 0, quantity, true);
        };
        return BloodEmitter;
    })();
    CowVsButcher.BloodEmitter = BloodEmitter;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=BloodEmitter.js.map