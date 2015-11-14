
define(function(){
    function Generator(x0, x1, y0, y1, FlagBonus) {
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.FlagBonus = FlagBonus != undefined ? FlagBonus : false;
    }

    Generator.prototype.getObject = function () {
        var resObject = {};
        resObject.positionX = Math.floor(Math.random() * (this.x1  - this.x0 + 1) + this.x0);
        resObject.positionY = Math.floor(Math.random() * (this.y1  - this.y0 + 1) + this.y0);
        resObject.positionZ = 0;
        resObject.radius = 1;
        resObject.type = "sphere";
        resObject.isBonus =  Math.floor(Math.random() * 51) == 50 ? true : false;
        return resObject;
    }
    return Generator;
});
