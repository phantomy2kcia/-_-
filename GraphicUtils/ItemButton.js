var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GameObjects\Cow.ts"/>
var CowVsButcher;
(function (CowVsButcher) {
    var ItemButton = (function (_super) {
        __extends(ItemButton, _super);
        function ItemButton(game, x, y, key, ammo, cow, cowAnimation) {
            var _this = this;
            this.game = game;
            this.spriteBW = this.game.add.image(x, y, key + "BW");
            this.spriteBW.anchor.set(0.5, 0.5);
            this.ammo = ammo;
            this.buttonPressed = false;
            _super.call(this, this.game, x, y, key, function () {
                if (key !== "gmoButton") {
                    _this.throwItem(cow, cowAnimation);
                }
                else {
                    _this.startGMO();
                }
            }, this);
            this.anchor.set(0.5, 0.5);
            this.input.priorityID = 1;
            this.game.add.existing(this);
            var ammoTextStyle = { fill: "#8B1914" };
            this.ammoText = this.game.add.text(x, y, this.ammo.toString(), ammoTextStyle);
            this.ammoText.anchor.set(0, 0);
            this.ammoText.font = "28-days-later";
            this.ammoText.fontSize = 60;
            this.ammoText.fontWeight = "normal";
            this.ammoText.strokeThickness = 8;
            this.ammoText.stroke = "#FFF";
            if (this.ammo === 0) {
                this.spriteBW.alpha = 1;
                this.alpha = 0;
            }
            else {
                this.spriteBW.alpha = 0;
                this.alpha = 1;
            }
        }
        ItemButton.prototype.throwItem = function (cow, cowAnimation) {
            var _this = this;
            if (this.ammo > 0) {
                cow.changeAnimation(cowAnimation);
                cow.states.animations.currentAnim.onComplete.addOnce(function () {
                    _this.buttonPressed = true;
                }, this);
                cow.currentState = 5 /* THROWING_ITEM */;
                this.ammo--;
                this.ammoText.text = this.ammo.toString();
                if (this.ammo === 0) {
                    this.spriteBW.alpha = 1;
                    this.alpha = 0;
                }
            }
        };
        ItemButton.prototype.startGMO = function () {
            if (this.ammo > 0) {
                this.buttonPressed = true;
                this.ammo--;
                this.ammoText.text = this.ammo.toString();
                if (this.ammo === 0) {
                    this.spriteBW.alpha = 1;
                    this.alpha = 0;
                }
            }
        };
        ItemButton.prototype.pickUpItem = function (amount) {
            this.ammo += amount;
            this.ammoText.text = this.ammo.toString();
            this.alpha = 1;
            this.spriteBW.alpha = 0;
        };
        return ItemButton;
    })(Phaser.Button);
    CowVsButcher.ItemButton = ItemButton;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=ItemButton.js.map