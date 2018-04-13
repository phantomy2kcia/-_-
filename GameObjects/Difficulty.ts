module CowVsButcher {
    export class Difficulty {
        index:number;
        rngChestLow:number;
        rngChestHigh:number;
        rngButchLow:number;
        rngButchHigh:number;
        butchSpeed:number;
        rngPlatformHigh:number;
        rngPlatformLow:number;
        rngWallLow:number;
        rngWallHigh:number;
        rngBBQLow:number;
        rngBBQHigh:number;
        levelSpeed:number;

        constructor(index, rngChestLow, rngChestHigh, rngButchLow, rngButchHigh,
                    butchSpeed, rngPlatformLow, rngPlatformHigh,rngWallLow,rngWallHigh,rngBBQLow,rngBBQHigh,levelSpeed){
            this.index=index;
            this.rngChestLow=rngChestLow;
            this.rngChestHigh=rngChestHigh;
            this.rngButchLow=rngButchLow;
            this.rngButchHigh=rngButchHigh;
            this.butchSpeed=butchSpeed;
            this.rngPlatformLow = rngPlatformLow;
            this.rngPlatformHigh = rngPlatformHigh;
            this.rngWallLow = rngWallLow;
            this.rngWallHigh = rngWallHigh;
            this.rngBBQLow = rngBBQLow;
            this.rngBBQHigh = rngBBQHigh;
            this.levelSpeed = levelSpeed;
        }
    }
}