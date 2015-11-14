define(['three', 'EventBus', 'generator','checker'], function(Three, EventBus, Generator, Checker){

    var renderer,
        scene,
        camera,
        checker;

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 20, FAR = 200;

    var lastHeadPosition = { x: null, y: null };
    var initialCameraPosition = new Three.Vector3(0, 0, 200);
    var cameraVectorOfView = new Three.Vector3(0, 0, 0);

    var generator = new Generator(-50*ASPECT, 50*ASPECT, -50, 50);
    var CENTRAL_GENERATOR_RANGE = 10;
    var centralGenerator = new Generator(-CENTRAL_GENERATOR_RANGE*ASPECT, CENTRAL_GENERATOR_RANGE*ASPECT,
        -CENTRAL_GENERATOR_RANGE, CENTRAL_GENERATOR_RANGE);
    var asteroidSpheres = [];

    setInterval(function() {
        createAsteroidWithGenerator(generator);
        createAsteroidWithGenerator(generator);
        createAsteroidWithGenerator(centralGenerator);
    }, getAsteroidCreationInterval());

    function createAsteroidWithGenerator(generator) {
        var newAsteroid = generator.getObject();
        var sphere = getAsteroid(newAsteroid.radius);
        sphere.position.set(newAsteroid.positionX, newAsteroid.positionY, 0);
        scene.add(sphere);
        asteroidSpheres.push(sphere);
    }

    /**
     * The class that draws the scene and performs all basic operations of the game
     * @param $placeholder jQuery wrapped DOM element where the scene will be rendered
     */
    function Game($placeholder) {
        scene = new Three.Scene();

        var myPlane = new Three.PlaneGeometry(340, 170, 1, 1);
        var material = new Three.MeshBasicMaterial({color: "red", transparent: true, opacity: 0.1});
        var test = new Three.Mesh(myPlane, material); // TODO: turn test plane into the hitbox
        /*test.position.x = 5000;
        test.position.y = 5000;
        test.position.z = 9900;
        scene.add(test);*/
        camera = new Three.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(initialCameraPosition.x, initialCameraPosition, initialCameraPosition.z);
        camera.lookAt(cameraVectorOfView);

        renderer = new Three.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x2b2b2b);
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        renderer.render(scene, camera);
        checker = new Checker(camera);

        $placeholder.append(renderer.domElement);
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

        asteroidSpheres.forEach(function (a) {
            a.position.z += getVelocity();
        });

        for (var i = 0; i < asteroidSpheres.length; i++) {
            var a = asteroidSpheres[i];
            var result = checker.checkObject(a);
            switch(result) {
                case Checker.MISS:
                    asteroidSpheres.splice(i, 1);
                    console.log("MISS");
                    break;
                case Checker.HIT:
                    //TODO: emit event 'lose'
                    console.log('HIT'); // TODO: remove objects from the scene
                    break;
            }
        }

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
        return 1;
    };

    function getAsteroidCreationInterval() {
        return 500;
    };

    return Game;
});
