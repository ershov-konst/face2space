define(function(){
    function Checker(Camera) {
        this.camera = Camera;
        var vFOV = this.camera.fov * Math.PI / 180;
        console.log(this.camera.fov);
        console.log(vFOV);
        var aspect = window.innerWidth / window.innerHeight;
        this.halfHitBoxHeight = 1;
        this.halfHitBoxWidth  = (this.halfHitBoxHeight * aspect)/2;
    }

    Checker.prototype.checkObject = function (sceneObject) {
        console.log(this.camera.position.x, this.camera.position.y);
        if ( sceneObject.position.z < this.camera.position.z - 10 )
            return Checker.FAR; //недолет
        else if (
            (
                sceneObject.position.x >= this.camera.position.x - this.halfHitBoxWidth &&
                sceneObject.position.x <= this.camera.position.x + this.halfHitBoxWidth
            )
            ||
            (
                sceneObject.position.y >= this.camera.position.y - this.halfHitBoxHeight &&
                sceneObject.position.y <= this.camera.position.y + this.halfHitBoxHeight
            )
        ){
            if (sceneObject.isBonus) {
                return Checker.HIT_BONUS; // hit bonus
            }
            return Checker.HIT; // попадание
        }
            else
                return Checker.MISS; // мимо
    };

    Checker.HIT = 0;
    Checker.MISS = -1;
    Checker.FAR = 1;
    Checker.HIT_BONUS = 2;
    return Checker;
});
