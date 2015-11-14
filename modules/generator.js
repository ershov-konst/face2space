
define(function(){
    function Generator(x0, x1, y0, y1, FlagBonus) {
        this.x0 = x0;
        this.x1 = x1;
        this.y0 = y0;
        this.y1 = y1;
        this.FlagBonus = FlagBonus != undefined ? FlagBonus : false;
        this.lastObject = null;
        this.settings = null;
    }

    Generator.prototype.getObject = function () {
        var resObject = {};
        resObject.positionX = Math.floor(Math.random() * (this.x1  - this.x0 + 1) + this.x0);
        resObject.positionY = Math.floor(Math.random() * (this.y1  - this.y0 + 1) + this.y0);
        resObject.positionZ = 0;
        resObject.radius = 1;
        resObject.type = "sphere";
        resObject.IsBonus =  Math.floor(Math.random() * 51) == 50 ? true : false;
        return resObject;
    }

    Generator.prototype.getSpiral = function () {
        //создаем туннель
        if ( this.settings === null ) {
            this.settings = {};
            this.settings.circleRadius = 40;
            this.settings.angle = Math.PI / 8;
            this.settings.step = -0.05;
        }
        var newObject = {
            positionX : this.settings.circleRadius * Math.sin( this.settings.angle ),
            positionY : this.settings.circleRadius * Math.cos( this.settings.angle ),
            positionZ : 0,
            radius : 1,
            type : "circle",
            IsBonus : false
        };
        this.settings.angle = Math.PI / 32 + this.settings.angle;
        this.settings.circleRadius += this.settings.step;
        this.settings.step = this.settings.circleRadius < 10 ? 0.1 : this.settings.step;
        this.settings.step = this.settings.circleRadius > 40 ? -0.1 : this.settings.step;
        this.lastObject = newObject;
        return this.lastObject;
    }
    return Generator;
});
