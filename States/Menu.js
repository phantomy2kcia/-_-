/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GraphicUtils\BloodEmitter.ts"/>
///<reference path="..\GameObjects\Cow.ts"/>
///<reference path="..\GameObjects\Butcher.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CowVsButcher;
(function (CowVsButcher) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
        }
        Menu.prototype.create = function () {
            this.game.add.image(0, 0, "MainScreen");
            var playButton = this.game.add.button(this.game.width * 0.5, this.game.height * 0.55, "PlayButton", this.startGame, this);
            playButton.input.priorityID = 1;
            playButton.anchor.set(0.5);
            var howtoplaybutton = this.game.add.button(this.game.width * 0.5, this.game.height * 0.7, "howtoplay", this.howtoplay, this);
            howtoplaybutton.input.priorityID = 1;
            howtoplaybutton.anchor.set(0.5);
            var quitButton = this.game.add.button(this.game.width * 0.5, this.game.height * 0.8, "QuitButton", this.exitGame, this);
            quitButton.input.priorityID = 1;
            quitButton.anchor.set(0.5);
            this.saw1 = this.game.add.image(230, 100, "bloody_saw");
            this.saw1.anchor.set(0.5);
            this.saw1.scale.set(0.3);
            this.saw2 = this.game.add.image(1130, 230, "bloodier_saw");
            this.saw2.scale.set(0.4);
            this.saw2.anchor.set(0.5);
            this.saw3 = this.game.add.image(50, 670, "bloodier_saw");
            this.saw3.scale.set(0.9);
            this.saw3.anchor.set(0.5);
            this.sawGroup = this.game.add.group();
            this.sawGroup.addMultiple([this.saw1, this.saw2, this.saw3]);
            var bloodEmitter = new CowVsButcher.BloodEmitter(this.game, 50, 1000);
            bloodEmitter.emitter.x = this.game.width * 0.18;
            bloodEmitter.emitter.y = this.game.height * 0.18;
            bloodEmitter.emitter.start(false, 1000, 0, 5000, false);
            var cow = new CowVsButcher.Cow(this.game);
            cow.states.position.set(250, 500);
            cow.states.scale.set(1.4);
            cow.states.anchor.set(0.5, 0.5);
            cow.states.body.immovable = true;
            cow.states.body.moves = false;
            cow.changeAnimationRepeating("idle");
            cow.inputBG.inputEnabled = false;
            cow.spaceKey.enabled = false;
            var butcher = new CowVsButcher.Butcher(this.game, 0);
            butcher.states.position.set(1100, 600);
            butcher.states.anchor.set(0.5, 0.5);
            butcher.states.scale.set(-1.4, 1.4);
            butcher.states.animations.play("idle", null, true);
            butcher.states.body.immovable = true;
            butcher.states.body.moves = false;
            var bloodEmitter2 = new CowVsButcher.BloodEmitter(this.game, 50, 1000);
            bloodEmitter2.emitter.x = this.game.width * 0.88;
            bloodEmitter2.emitter.y = this.game.height * 0.4;
            bloodEmitter2.emitter.start(false, 1000, 0, 5000, false);
            this.game.world.bringToTop(this.sawGroup);
        };
        Menu.prototype.update = function () {
            this.saw1.rotation += 0.04;
            this.saw2.rotation -= 0.05;
            this.saw3.rotation += 0.02;
        };
        Menu.prototype.startGame = function () {
            this.game.state.start("Game");
        };
        Menu.prototype.exitGame = function () {
            this.game.destroy();
        };
        return Menu;
    })(Phaser.State);
    CowVsButcher.Menu = Menu;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Menu.js.map