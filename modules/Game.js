define(['three', 'EventBus'], function(Three, EventBus){

    var renderer,
        scene,
        camera,
        asteroid;

    /**
     * The class that draws the scene and performs all basic operations of the game
     * @param $placeholder DOM element where the scene will be rendered
     */
    function Game($placeholder) {
        scene = new Three.Scene();
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 12000;

        var cameraVectorOfView = new Three.Vector3(5000, 5000, 0);

        camera = new Three.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(5000, 5000, 10000);
        camera.lookAt(cameraVectorOfView);
        renderer = new Three.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x2b2b2b);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        $placeholder.append(renderer.domElement);

        var sphereGeometry = new Three.SphereGeometry(50, 20, 20);
        var sphereMaterial = new Three.MeshBasicMaterial({color: 0xFFFFFF});
        asteroid = new Three.Mesh(sphereGeometry, sphereMaterial);
        asteroid.position.set(5000, 5000, 0);

        scene.add(asteroid);
    }

    /**
     * Call this method to start animation
     */
    Game.prototype.start = function() {
        Game.prototype._animate();
    };

    Game.prototype._animate = function() {
        requestAnimationFrame(Game.prototype._animate);
        Game.prototype._render();

        asteroid.position.z += getVelocity();
    };

    Game.prototype._render = function() {
        renderer.render(scene, camera);
    };

    // TODO: logic of velocity changing
    function getVelocity() {
        return 30;
    };

    return Game;
});