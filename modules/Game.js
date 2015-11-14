define(['three', 'EventBus', 'generator','checker', 'anaglyph'], function(Three, EventBus, Generator, Checker){

    var renderer,
        scene,
        camera,
        checker,
        eventBus = new EventBus();

    var requestId; // for requestAnimationFrame()
    var createAsteroidInterval;

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
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
        camera.lookAt(cameraVectorOfView);

        renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        this.effect = new THREE.AnaglyphEffect(renderer);
        this.effect.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.effect.render(scene, camera);

        this._bindedAnimate = this._animate.bind(this);

        checker = new Checker(camera);

        startGeneratingAsteroids();

        $placeholder.append(renderer.domElement);
    }

    function startGeneratingAsteroids() {
        createAsteroidInterval =  setInterval(function() {
            createAsteroidWithGenerator(generator);
            createAsteroidWithGenerator(generator);
            createAsteroidWithGenerator(centralGenerator);
        }, getAsteroidCreationInterval());
    }

    function stopGeneratingAsteroids() {
        clearInterval(createAsteroidInterval);
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
        if (!requestId)
            this._animate();
    };

    Game.prototype.stop = function() {
        stopAnimation();
        stopGeneratingAsteroids();
        asteroidSpheres.forEach(function(a) {
            scene.remove(a);
        });
    };

    Game.prototype.pause = function() {
        stopAnimation();
        stopGeneratingAsteroids();
    };

    Game.prototype.resume = function() {
        startGeneratingAsteroids();
        this._animate();
    };

    function stopAnimation() {
        if (requestId) {
            //noinspection JSUnresolvedFunction
            cancelAnimationFrame(requestId);
            requestId = null;
        }
    }

    Game.prototype.getScore = function() {
        return 0;
    };

    Game.prototype._animate = function() {
        requestId = requestAnimationFrame(this._bindedAnimate);
        this._render();

        asteroidSpheres.forEach(function (a) {
            a.position.z += getVelocity();
        });

        for (var i = 0; i < asteroidSpheres.length; i++) {
            var a = asteroidSpheres[i];
            var result = checker.checkObject(a);
            if (result != Checker.FAR) {
                asteroidSpheres.splice(i, 1);
                scene.remove(a);

                if (result == Checker.HIT) {
                    eventBus.dispatch('changeLives');
                }
            }
        }

        moveCamera();
    };

    Game.prototype.on = function(type, callback, scope) {
        eventBus.addEventListener(type, callback, scope);
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

        camera.position.x = initialCameraPosition.x + lastHeadPosition.x * 1.5;
        camera.position.y = initialCameraPosition.y + lastHeadPosition.y * 1.5;

    }

    Game.prototype._render = function() {
        this.effect.render(scene, camera);
        //renderer.render(scene, camera);
    };

    // TODO: logic of velocity changing
    function getVelocity() {
        return 1;
    }

    function getAsteroidCreationInterval() {
        return 500;
    }

    return Game;
});
