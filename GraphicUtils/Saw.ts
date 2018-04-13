/// <reference path="../Lib/phaser.d.ts"/>

module CowVsButcher {
    export class Saw {
        game:Phaser.Game;
        defaultImage:Phaser.Image;
        bloodyImage:Phaser.Image;
        bloodierImage:Phaser.Image;

        defaultImageEvent:Phaser.TimerEvent;

        constructor(game:Phaser.Game, defaultKey:string, bloodyKey:string,
                    bloodierKey:string, x:number, y:number, scale:number, group:Phaser.Group) {
            this.game = game;
            this.defaultImage = this.game.add.image(x, y, defaultKey, 0, group);
            this.defaultImage.anchor.set(0.5, 0.5);
            this.defaultImage.scale.set(scale, scale);

            this.bloodyImage = this.game.add.image(x, y, bloodyKey, 0, group);
            this.bloodyImage.anchor.set(0.5, 0.5);
            this.bloodyImage.scale.set(scale, scale);
            this.bloodyImage.alpha = 0;

            this.bloodierImage = this.game.add.image(x, y, bloodierKey, 0, group);
            this.bloodierImage.anchor.set(0.5, 0.5);
            this.bloodierImage.scale.set(scale, scale);
            this.bloodierImage.alpha = 0;
        }

        update() {
            this.defaultImage.rotation += 0.06;
            this.bloodyImage.rotation += 0.06;
            this.bloodierImage.rotation += 0.06;
        }

        //The idea is to tween the 3 images to alpha 0 or 1 depending on the case
        //State 1
        private changeToDefaultImage() {
            this.defaultImage.alpha = 1;
            var bloodyTween = this.game.add.tween(this.bloodyImage);
            bloodyTween.to({alpha: 0}, 200, Phaser.Easing.Default, true);
            var bloodierTween = this.game.add.tween(this.bloodierImage);
            bloodierTween.to({alpha: 0}, 200, Phaser.Easing.Default, true);
        }

        //State 2
        private changeToBloodyImage() {
            this.defaultImageEvent = this.game.time.events.add(Phaser.Timer.SECOND * 2, this.changeToDefaultImage, this);

            if (this.bloodierImage.alpha === 1) {
                this.bloodyImage.alpha = 1;
                var bloodierTween = this.game.add.tween(this.bloodierImage);
                bloodierTween.to({alpha: 0}, 200, Phaser.Easing.Default, true);
            }
            else {
                var bloodyTween = this.game.add.tween(this.bloodyImage);
                bloodyTween.to({alpha: 1}, 200, Phaser.Easing.Default, true);
                bloodyTween.onComplete.add(()=> {
                    this.defaultImage.alpha = 0;
                });
                var bloodierTween = this.game.add.tween(this.bloodierImage);
                bloodierTween.to({alpha: 0}, 200, Phaser.Easing.Default, true);
            }

        }

        //State3
        changeToBloodierImage() {
            this.game.time.events.remove(this.defaultImageEvent);
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.changeToBloodyImage, this);
            var bloodierTween = this.game.add.tween(this.bloodierImage);
            bloodierTween.to({alpha: 1}, 200, Phaser.Easing.Default,true);

            bloodierTween.onComplete.add(()=> {
                this.bloodyImage.alpha = 0;
            })
        }

        triggerSaw() {
            if (this.defaultImage.alpha === 1) {
                this.changeToBloodyImage();
            }
            else if (this.bloodyImage.alpha === 1) {
                this.changeToBloodierImage();
            }
            else if (this.bloodierImage.alpha === 1) {
                this.changeToBloodierImage();
            }
        }

    }
}