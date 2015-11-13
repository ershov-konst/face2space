
define(function(){
    function Generator(scene) {
        this.scene = scene;
    }

    Generator.prototype.getObject = function () {
        var resObject = {};
        resObject.positionX = Math.floor(Math.random() * (this.scene.maxX - this.scene.minX + 1) + this.scene.minX);
        resObject.positionY = Math.floor(Math.random() * (this.scene.maxY - this.scene.minY + 1) + this.scene.minY);
        resObject.positionZ = 0;
        resObject.radius = 10;
        resObject.type = "sphere";
        return resObject;
    }
    return Generator;
});
