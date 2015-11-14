define(['three', 'EventBus', 'generator','checker', 'anaglyph'], function(Three, EventBus, Generator, Checker){

    var renderer,
        scene,
        camera,
        checker,
        eventBus = new EventBus();

    var requestId; // for requestAnimationFrame()
    var createAsteroidInterval, timeSpentInterval;
    var INITIAL_VELOCITY = 0.5;
    var BONUS_SPHERE_PRICE = 100;
    var currentVelocity = INITIAL_VELOCITY;
    var timeSpent = 0;
    var velocityIncreasingIntervalLength = 10;

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 20, FAR = 200;

    var lastHeadPosition = { x: null, y: null };
    var initialCameraPosition = new Three.Vector3(0, 0, 200);
    var cameraVectorOfView = new Three.Vector3(0, 0, 0);

    var generator1 = new Generator(-50*ASPECT, 50*ASPECT, -50, 50, true);
    var generator2 = new Generator(-50*ASPECT, 50*ASPECT, -50, 50);
    var CENTRAL_GENERATOR_RANGE = 10;
    var centralGenerator = new Generator(-CENTRAL_GENERATOR_RANGE*ASPECT, CENTRAL_GENERATOR_RANGE*ASPECT,
        -CENTRAL_GENERATOR_RANGE, CENTRAL_GENERATOR_RANGE);
    var asteroidSpheres = [];

    function createAsteroidWithGenerator(generator) {
        var newAsteroid = generator.getObject();
        var sphere = getAsteroid(newAsteroid.radius, newAsteroid.isBonus);
        sphere.isBonus = newAsteroid.isBonus;
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
        camera = new Three.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        scene.add(camera);
        camera.position.set(initialCameraPosition.x, initialCameraPosition, initialCameraPosition.z);
        camera.lookAt(cameraVectorOfView);

        renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        this.effect = new THREE.AnaglyphEffect(renderer);
        this.effect.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.effect.render(scene, camera);

        this._bindedAnimate = this._animate.bind(this);

        checker = new Checker(camera);

        $placeholder.append(renderer.domElement);
    }

    function startGeneratingAsteroids() {
        createAsteroidInterval =  setInterval(function() {
            createAsteroidWithGenerator(generator1);
            createAsteroidWithGenerator(generator2);
            createAsteroidWithGenerator(centralGenerator);
        }, getAsteroidCreationInterval());
    }

    function stopGeneratingAsteroids() {
        clearInterval(createAsteroidInterval);
    }

    function startVelocityIncreasing() {
        timeSpentInterval = setInterval(function () {
            timeSpent++;
            currentVelocity += getVelocityDelta(timeSpent);
        }, 1000);
    }

    function stopVelocityIncreasing() {
        clearInterval(timeSpentInterval);
    }

    function getVelocityDelta(time) {
        if (time > 100)
            return 0;

        if (Math.floor(time / velocityIncreasingIntervalLength) % 2 == 1)
            return 0.05;

        return 0;
    }

    function getAsteroid(radius, isBonus) {
        var sphereGeometry = new Three.SphereGeometry(radius, 20, 20);
        var sphereMaterial = new Three.MeshBasicMaterial( {color: isBonus ? 0xFFD000 : 0xFFFFFF} );

        return new Three.Mesh(sphereGeometry, sphereMaterial);
    }

    /**
     * Call this method to start animation
     */
    Game.prototype.start = function() {
        if (!requestId) {
            this._animate();
            startGeneratingAsteroids();
            currentVelocity = INITIAL_VELOCITY;
            startVelocityIncreasing();
            this.score = 0;
        }
    };

    Game.prototype.stop = function() {
        stopAnimation();
        stopGeneratingAsteroids();
        stopVelocityIncreasing();
        currentVelocity = 0;
        timeSpent = 0;

        asteroidSpheres.forEach(function(a) {
            scene.remove(a);
        });
    };

    Game.prototype.pause = function() {
        stopAnimation();
        stopGeneratingAsteroids();
        stopVelocityIncreasing();
    };

    Game.prototype.resume = function() {
        startGeneratingAsteroids();
        startVelocityIncreasing();
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
        this.score += currentVelocity;
        return this.score;
    };

    Game.prototype._animate = function() {
        requestId = requestAnimationFrame(this._bindedAnimate);
        this._render();

        asteroidSpheres.forEach(function (a) {
            a.position.z += currentVelocity;
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

                if (result == Checker.HIT_BONUS) {
                    this.score += BONUS_SPHERE_PRICE;
                    eventBus.dispatch('hitBonus');
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

        camera.position.x = initialCameraPosition.x + lastHeadPosition.x * (-100);
        camera.position.y = initialCameraPosition.y + lastHeadPosition.y * 10;

        camera.lookAt(new Three.Vector3(
            cameraVectorOfView.x - lastHeadPosition.x * 30,
            cameraVectorOfView.y - lastHeadPosition.y * 30
        ));
    }

    Game.prototype._render = function() {
        this.effect.render(scene, camera);
        //renderer.render(scene, camera);
    };

    function getAsteroidCreationInterval() {
        return 500;
    }

    return Game;
});
