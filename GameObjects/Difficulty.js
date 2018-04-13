var CowVsButcher;
(function (CowVsButcher) {
    var Difficulty = (function () {
        function Difficulty(index, rngChestLow, rngChestHigh, rngButchLow, rngButchHigh, butchSpeed, rngPlatformLow, rngPlatformHigh, rngWallLow, rngWallHigh, rngBBQLow, rngBBQHigh, levelSpeed) {
            this.index = index;
            this.rngChestLow = rngChestLow;
            this.rngChestHigh = rngChestHigh;
            this.rngButchLow = rngButchLow;
            this.rngButchHigh = rngButchHigh;
            this.butchSpeed = butchSpeed;
            this.rngPlatformLow = rngPlatformLow;
            this.rngPlatformHigh = rngPlatformHigh;
            this.rngWallLow = rngWallLow;
            this.rngWallHigh = rngWallHigh;
            this.rngBBQLow = rngBBQLow;
            this.rngBBQHigh = rngBBQHigh;
            this.levelSpeed = levelSpeed;
        }
        return Difficulty;
    })();
    CowVsButcher.Difficulty = Difficulty;
})(CowVsButcher || (CowVsButcher = {}));
//# sourceMappingURL=Difficulty.js.map