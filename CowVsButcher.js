var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="Lib/phaser.d.ts"/>
/// <reference path="States/Preloader.ts"/>
///<reference path="States\Menu.ts"/>
///<reference path="States\GameOver.ts"/>
function RNG(from, to) {
    return Math.random() * (to - from) + from;
}
var CowVsButcher;
(function (_CowVsButcher) {
    var CowVsButcher = (function (_super) {
        __extends(CowVsButcher, _super);
        function CowVsButcher(width, height) {
            var dpr = devicePixelRatio || 1;
            if (!width) {
                width = screen.width * dpr;
            }
            if (!height) {
                height = screen.height * dpr;
            }
            _super.call(this, width, height, Phaser.CANVAS, 'phaser-div', { create: this.create });
        }
        CowVsButcher.prototype.create = function () {
            this.game.stage.backgroundColor = "#FFF";
            //this.game.scale.maxWidth = 1280;
            //this.game.scale.maxHeight = 720;
            this.game.state.add("Preloader", _CowVsButcher.Preloader, false);
            this.game.state.add("Boot", _CowVsButcher.Boot, false);
            this.game.state.add("Menu", _CowVsButcher.Menu, false);
            this.game.state.add("Game", _CowVsButcher.Game, false);
            this.game.state.add("GameOver", _CowVsButcher.GameOver, false);
            this.game.state.start("Boot");
        };
        return CowVsButcher;
    })(Phaser.Game);
    window.onload = function () {
        new CowVsButcher(1280, 720);
    };
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=CowVsButcher.js.map