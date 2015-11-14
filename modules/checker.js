define(function(){
    function Checker(Camera) {
        this.camera = Camera;

    }

    Checker.prototype.checkObject = function (sceneObject) {
            if ( sceneObject.positionZ < this.camera.positionZ )
                return -1; //недолет
            else if ( sceneObject.positionX <= ( this.camera.positionX + window.innerWidth / 2 ) && sceneObject.positionX >= ( this.camera.positionX - window.innerWidth / 2 )
                        && sceneObject.positionY <= ( this.camera.positionY + window.innerHeight / 2 ) && sceneObject.positionY >= ( this.camera.positionY - window.innerHeight / 2 ))
                    return 0; // попадание
                else
                    return 1; // мимо
    }
    return Checker;
});
