/// <reference path="../Lib/phaser.d.ts"/>
///<reference path="Level.ts"/>
///<reference path="..\GraphicUtils\BackgroundItem.ts"/>
///<reference path="..\GraphicUtils\Bird.ts"/>
module CowVsButcher {
    export class LevelTwo extends Level {
        game:Phaser.Game;
        //background: ParallaxBackground;
        mountains_front:ParallaxBackground;
        mountains_back:ParallaxBackground;
        grass:ParallaxBackground;

        rockCollection:Array<BackgroundItem>;
        randomRockSpawnTime:number;

        treeCollection:Array<BackgroundItem>;
        randomTreeSpawnTime:number;

        birdCollection:Array<Bird>;
        randomBirdSpawnTime:number;

        constructor(game:Phaser.Game) {
            super(game);
        }

        create(difficulty:Difficulty) {
            this.levelGroup = this.game.add.group();
            this.background = new ParallaxBackground(this.game, "sky", 2.5, -100, this.levelGroup);
            this.mountains_back = new ParallaxBackground(this.game, "mountains_back", 0.5, 200, this.levelGroup);
            this.mountains_front = new ParallaxBackground(this.game, "mountains_front", 1, 300, this.levelGroup);
            this.ground = new ParallaxBackground(this.game, "floor_outdoor", difficulty.levelSpeed, 586, this.levelGroup);
            this.grass = new ParallaxBackground(this.game, "grass", difficulty.levelSpeed, 570, this.levelGroup);

            this.treeCollection = [];
            this.rockCollection = [];
            this.birdCollection = [];

            this.randomTreeSpawnTime = this.game.time.now;
            this.randomRockSpawnTime = this.game.time.now;
            this.randomBirdSpawnTime = this.game.time.now;

            super.create(difficulty);

        }

        update(killerCollection:KillerCollection, cow:Cow, difficulty:Difficulty) {
            super.update(killerCollection,cow,difficulty);
            this.mountains_back.update();
            this.mountains_front.update();
            this.grass.update();

            this.updateTrees(difficulty);
            this.updateRocks(difficulty);
            this.updateBirds(killerCollection);
            this.spawnPlatform("platformOutdoor",difficulty);
            this.updatePlatforms(cow,difficulty);
            this.spawnWall("wallOutdoor",difficulty);
            this.updateWalls(cow,difficulty);
        }

        updateTrees(difficulty:Difficulty) {
            if (this.game.time.now > this.randomTreeSpawnTime) {
                this.randomTreeSpawnTime = this.game.time.now + RNG(3, 8) * 1000;
                var tree = new BackgroundItem(this.game, "tree", difficulty.levelSpeed, 595, this.levelGroup);
                this.treeCollection.push(tree);
                this.levelGroup.addChildAt(tree.image, 6);
            }
            this.treeCollection.forEach((tree)=> {
                tree.update();

                if (tree.image.position.x <= -tree.image.width) {
                    tree.image.alpha = 0;
                    tree.image.kill();
                }
            });
            if (this.treeCollection[0] && this.treeCollection[0].image.alpha === 0) {
                this.treeCollection.splice(0, 1);
            }
        }

        updateRocks(difficulty:Difficulty) {
            if (this.game.time.now > this.randomRockSpawnTime) {
                this.randomRockSpawnTime = this.game.time.now + RNG(1, 3) * 1000;
                var randomRockNumber = RNG(1, 3) | 0;
                var rock = new BackgroundItem(this.game, "rock" + randomRockNumber.toString(), difficulty.levelSpeed, 710, this.levelGroup);
                this.rockCollection.push(rock);
            }
            this.rockCollection.forEach((rock)=> {
                rock.update();

                if (rock.image.position.x <= -rock.image.width) {
                    rock.image.alpha = 0;
                    rock.image.kill();
                }
            });
            if (this.rockCollection[0] && this.rockCollection[0].image.alpha === 0) {
                this.rockCollection.splice(0, 1);
            }
        }

        updateBirds(killerCollection) {
            if (this.game.time.now > this.randomBirdSpawnTime) {
                this.randomBirdSpawnTime = this.game.time.now + RNG(5, 8) * 1000;
                var bird = new Bird(this.game, "Bird", 12, 120, this.levelGroup);
                this.birdCollection.push(bird);
                this.levelGroup.addChildAt(bird.sprite, 6);
            }
            this.birdCollection.forEach((bird)=> {
                bird.update(killerCollection);

                if (bird.sprite.position.x <= 0) {
                    bird.sprite.alpha = 0;
                    bird.sprite.kill();
                }
            });
            if (this.birdCollection[0] && this.birdCollection[0].sprite.alpha === 0) {
                this.birdCollection.splice(0, 1);
            }
        }


    }
}