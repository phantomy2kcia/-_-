/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="Cow.ts"/>
///<reference path="..\GraphicUtils\ItemButton.ts"/>

module CowVsButcher{
    export class Chest{
        game:Phaser.Game;
        chest:Phaser.Sprite;
        constructor(game:Phaser.Game){
            this.game = game;

            var x = Math.abs(RNG(1000,1380));
            this.chest = this.game.add.sprite(x,0,"Chests");
            this.chest.animations.add("ammo", [0,1,2,3,4,5,6,7,8,9],30);
            this.chest.animations.add("GMO",[10,11,12,13,14,15,16,17,18,19],30);
            this.chest.animations.add("grenade",[20,21,22,23,24,25,26,27,28,29],30);

            this.chest.anchor.set(0.5,0.5);
            this.game.physics.enable(this.chest);
            this.chest.body.setSize(40,40,0,60);
            this.chest.body.gravity.y = -1000;
            this.chest.body.mass = 0;

            var randomAnimation = Math.random();

            if(randomAnimation<0.49){
                this.chest.animations.play("grenade",null,true);
            }
            else if(randomAnimation>=0.49 && randomAnimation<=0.9){
                this.chest.animations.play("ammo",null,true);
            }
            else {
                this.chest.animations.play("GMO",null,true);
            }
        }
        update(cow:Cow, grenadeButton:ItemButton, shotgunButton:ItemButton, gmoButton:ItemButton, chestItems:Array<Chest>){
            this.game.physics.arcade.overlap(this.chest,cow.states,()=>{
                if(this.chest.animations.currentAnim.name ==="ammo"){
                    shotgunButton.pickUpItem(8);
                }
                else if (this.chest.animations.currentAnim.name === "grenade"){
                    grenadeButton.pickUpItem(3);
                }
                else{
                    gmoButton.pickUpItem(1);
                }
                chestItems.splice(chestItems.indexOf(this),1);
                this.chest.destroy();
            });

            if(this.chest.body && this.chest!==null){
                this.chest.body.velocity.x = -800;
            }
        }
    }
}