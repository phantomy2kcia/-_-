var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Lib/phaser.d.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var Blood = (function (_super) {
        __extends(Blood, _super);
        function Blood(game, x, y) {
            this.game = game;
            this.radius = 5 + Math.round(RNG(0, 5));
            _super.call(this, this.game, x, y, game.cache.getBitmapData("Blood"));
            this.x = x;
            this.y = y;
            this.createBlood();
        }
        Blood.prototype.update = function () {
            if (this.alpha > 0.01) {
                this.alpha = this.alpha - RNG(0.005, 0.009);
            }
            _super.prototype.update.call(this);
        };
        Blood.prototype.createBlood = function () {
            var bmd = this.game.add.bitmapData(this.radius * 2, this.radius * 2);
            bmd.circle(bmd.width * 0.5, bmd.height * 0.5, this.radius, "#8B1914");
            this.game.cache.addBitmapData("Blood", bmd);
        };
        return Blood;
    })(Phaser.Particle);
    CowVsButcher.Blood = Blood;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Blood.js.map