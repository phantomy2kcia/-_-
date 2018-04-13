/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="..\GameObjects\Cow.ts"/>
module CowVsButcher{
    export class ItemButton extends Phaser.Button{
        ammo:number;
        spriteBW:Phaser.Image;
        ammoText:Phaser.Text;
        buttonPressed:boolean;

        constructor(game:Phaser.Game,x:number, y:number, key:string, ammo:number, cow:Cow, cowAnimation:string){
            this.game = game;
            this.spriteBW = this.game.add.image(x,y,key+"BW");
            this.spriteBW.anchor.set(0.5,0.5);
            this.ammo = ammo;
            this.buttonPressed = false;
            super(this.game,x,y,key,()=>{
                if(key!=="gmoButton"){
                    this.throwItem(cow, cowAnimation);
                }
                else{
                    this.startGMO();
                }
            },this);

            this.anchor.set(0.5,0.5);
            this.input.priorityID = 1;
            this.game.add.existing(this);

            var ammoTextStyle = {fill: "#8B1914"};
            this.ammoText = this.game.add.text(x,y, this.ammo.toString(), ammoTextStyle);
            this.ammoText.anchor.set(0,0);
            this.ammoText.font = "28-days-later";
            this.ammoText.fontSize = 60;
            this.ammoText.fontWeight = "normal";
            this.ammoText.strokeThickness = 8;
            this.ammoText.stroke = "#FFF";

            if(this.ammo === 0 ){
                this.spriteBW.alpha = 1;
                this.alpha = 0;
            }

            else{
                this.spriteBW.alpha =0;
                this.alpha = 1;
            }
        }

        throwItem(cow:Cow, cowAnimation:string):void{
            if(this.ammo>0){
                cow.changeAnimation(cowAnimation);
                cow.states.animations.currentAnim.onComplete.addOnce(()=>{this.buttonPressed = true},this);
                cow.currentState = CowStates.THROWING_ITEM;
                this.ammo--;
                this.ammoText.text = this.ammo.toString();
                if(this.ammo ===0){
                    this.spriteBW.alpha = 1;
                    this.alpha = 0;
                }
            }
        }
        startGMO(){
            if(this.ammo>0){
                this.buttonPressed = true;
                this.ammo--;
                this.ammoText.text = this.ammo.toString();

                if(this.ammo ===0){
                    this.spriteBW.alpha = 1;
                    this.alpha = 0;
                }
            }
        }

        pickUpItem(amount:number){
            this.ammo += amount;
            this.ammoText.text = this.ammo.toString();
            this.alpha = 1;
            this.spriteBW.alpha = 0;
        }

    }
}