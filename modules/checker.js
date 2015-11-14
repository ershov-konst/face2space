define(function(){
    function Checker(Camera) {
        this.camera = Camera;
    }

    Checker.prototype.checkObject = function (sceneObject) {
        var vFOV = camera.fov * Math.PI / 180;
        var aspect = window.innerWidth / window.innerHeight;
        var cameraX0 = -0.1 * aspect * Math.tan(vFOV / 2) * this.camera.position.z;
        var cameraX1 =  0.1 * aspect * Math.tan(vFOV / 2) * this.camera.position.z;
        var cameraY0 = -0.1 * Math.tan(vFOV / 2) * this.camera.position.z;
        var cameraY1 =  0.1 * Math.tan(vFOV / 2) * this.camera.position.z;
        if ( sceneObject.position.z < this.camera.position.z )
            return Checker.FAR; //недолет
        else if (  sceneObject.position.x >= cameraX0 && sceneObject.position.x <= cameraX1 && sceneObject.position.y >= cameraY0 && sceneObject.position.y <= cameraY1 )
                return Checker.HIT; // попадание
            else
                return Checker.MISS; // мимо
    }
    Checker.HIT = 0;
    Checker.MISS = -1;
    Checker.FAR = 1;
    return Checker;
});
