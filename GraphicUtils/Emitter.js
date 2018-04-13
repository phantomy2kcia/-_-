/// <reference path="../Lib/phaser.d.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var Emitter = (function () {
        function Emitter(game, width, gravity, keys) {
            this.game = game;
            this.emitter = this.game.add.emitter(0, 0, 20);
            this.emitter.width = width;
            this.emitter.gravity = gravity;
            this.emitter.setAlpha(1, 0.5);
            this.emitter.minParticleScale = 0.2;
            this.emitter.maxParticleScale = 0.3;
            this.emitter.makeParticles(keys);
        }
        Emitter.prototype.update = function () {
            var _this = this;
            this.emitter.forEachAlive(function (particle) {
                particle.alpha = particle.lifespan / _this.emitter.lifespan;
            }, this);
        };
        Emitter.prototype.start = function (x, y, explode, lifespan, quantity) {
            this.emitter.x = x;
            this.emitter.y = y;
            this.emitter.bounce.setTo(0.9, 0.9);
            this.emitter.angularDrag = 0;
            this.emitter.start(explode, lifespan, 0, quantity, true);
        };
        return Emitter;
    })();
    CowVsButcher.Emitter = Emitter;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Emitter.js.map