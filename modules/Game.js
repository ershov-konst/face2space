define(['three', 'EventBus', 'generator','checker'], function(Three, EventBus, Generator, Checker){

    var renderer,
        scene,
        camera,
        asteroid;

    var lastHeadPosition = { x: null, y: null };
    var initialCameraPosition = new Three.Vector3(5000, 5000, 10000);
    var cameraVectorOfView = new Three.Vector3(5000, 5000, 0);

    var generator = new Generator(0, 10000, 0, 10000);
    //var checker = new Checker();
    var asteroidSpheres = [];

    setInterval(function() {
        var newAsteroid = generator.getObject();
        var sphere = getAsteroid(newAsteroid.radius);
        sphere.position.set(newAsteroid.positionX, newAsteroid.positionY, 0);
        scene.add(sphere);
        asteroidSpheres.push(sphere);
    }, getAsteroidCreationInterval());

    /**
     * The class that draws the scene and performs all basic operations of the game
     * @param $placeholder jQuery wrapped DOM element where the scene will be rendered
     */
    function Game($placeholder) {
        scene = new Three.Scene();
        var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 12000;
        var myPlane = new Three.PlaneGeometry(340, 170, 1, 1);
        var material = new Three.MeshBasicMaterial({color: "red", transparent: true, opacity: 0.1});
        var test = new Three.Mesh(myPlane, material);
        test.position.x = 5000;
        test.position.y = 5000;
        test.position.z = 9800;
        scene.add(test);
        camera = new Three.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
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

    function getAsteroid(radius) {
        var sphereGeometry = new Three.SphereGeometry(radius, 20, 20);
        var sphereMaterial = new Three.MeshBasicMaterial({color: 0xFFFFFF});

        return new Three.Mesh(sphereGeometry, sphereMaterial);
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
        asteroidSpheres.filter(function (curElem) {

            a.position.z += getVelocity();
        })
        asteroidSpheres.forEach(function(a) {


// console.log(a.position.z);
        });

        moveCamera();
    };

    /**
     * Call it when the user moves their head.
     * We've got a method, not event, here to avoid circular dependencies
     */
    Game.prototype.headMoved = function(x, y) {
        lastHeadPosition.x = x;
        lastHeadPosition.y = y;
    };

    function moveCamera() {
        if (!lastHeadPosition)
            return;

        camera.position.x = initialCameraPosition.x + lastHeadPosition.x * (-100);
        camera.position.y = initialCameraPosition.y + lastHeadPosition.y * 10;

        camera.lookAt(new Three.Vector3(
            cameraVectorOfView.x - lastHeadPosition.x * 30,
            cameraVectorOfView.y - lastHeadPosition.y * 30
        ));
    }

    Game.prototype._render = function() {
        renderer.render(scene, camera);
    };

    // TODO: logic of velocity changing
    function getVelocity() {
        return 30;
    };

    function getAsteroidCreationInterval() {
        return 500;
    };

    return Game;
});
