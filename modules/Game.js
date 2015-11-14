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
    var velocityIncreasingIntervalLength = 5;

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 5, FAR = 200;

    var lastHeadPosition = { x: null, y: null };
    var initialCameraPosition = new Three.Vector3(0, 0, 200);
    var cameraVectorOfView = new Three.Vector3(0, 0, 0);

    var generator1 = new Generator(-50*ASPECT, 50*ASPECT, -50, 50, true);
    var generator2 = new Generator(-50*ASPECT, 50*ASPECT, -50, 50);
    var CENTRAL_GENERATOR_RANGE = 15;
    var OUTER_GENERATOR_RANGE = 70;

    var centralGenerator = new Generator(-CENTRAL_GENERATOR_RANGE*ASPECT, CENTRAL_GENERATOR_RANGE*ASPECT,
        -CENTRAL_GENERATOR_RANGE, CENTRAL_GENERATOR_RANGE);
    var HeartsGenerator = new Generator(0,0,0,0);
    var asteroidSpheres = [];

    //время работы генераторов
    // var const_t1_max = 12000,
    //     const_t1_min = 9000;
    var tr1 = 10;//"время" до запуска спирали
    var tr2 = 7;//"время в спирали"
    var timer_1 = 0;
    var timer_2 = 0;
    var generateSpiral, generateSimpleObjects;
    function startGeneratingSimpleObjects() {
        if (generateSimpleObjects) {
            clearInterval(generateSimpleObjects);
            generateSimpleObjects = null;
        }

        generateSimpleObjects = setInterval(function () {
            console.log("timer_1 " + timer_1 );
            createAsteroidWithGenerator(generator1);
            timer_1 ++;
            if ( timer_1 == tr1) {
                clearInterval(generateSimpleObjects);
                startGeneratingSpiral();
            }
        } , getAsteroidCreationInterval());
    }

    function startGeneratingSpiral() {
        if (generateSpiral) {
            clearInterval(generateSpiral);
            generateSpiral = null;
        }

        generateSpiral = setInterval(function () {
            console.log("timer_2 " + timer_2 );
            createSpiralWithGenerator(generator2);
            timer_2 ++;
            if ( timer_2 == tr2  ) {
                clearInterval(generateSimpleObjects);
                startGeneratingSimpleObjects();
            }
        } , getSpiralCreationInterval());
    }

    function createAsteroidWithGenerator(generator) {
        var newAsteroidsArr = generator.getObject();
        newAsteroidsArr.forEach(function (newAsteroid) {
            var sphere = getAsteroid(newAsteroid.radius, newAsteroid.isBonus);
            sphere.isBonus = newAsteroid.isBonus;
            sphere.position.set(newAsteroid.positionX, newAsteroid.positionY, 0);
            scene.add(sphere);
            asteroidSpheres.push(sphere);
        });
    }

    function createSpiralWithGenerator(generator) {
        var newAsteroidsArr = generator.getSpiral();
        newAsteroidsArr.forEach(function (newAsteroid) {
            var sphere = getAsteroid(newAsteroid.radius, newAsteroid.isBonus);
            sphere.isBonus = newAsteroid.isBonus;
            sphere.position.set(newAsteroid.positionX, newAsteroid.positionY, 0);
            scene.add(sphere);
            asteroidSpheres.push(sphere);
        });
    }

    function stopIntervals(argument) {
        clearInterval(generateSimpleObjects);
        clearInterval(generateSpiral);
        generateSimpleObjects = null;
        generateSpiral = null;
        timer_1 = 0;
        timer_2 = 0;
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
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
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
            var delta = getVelocityDelta(timeSpent);
            currentVelocity += delta;
            if (delta != 0) {
                //stopGeneratingAsteroids();
                stopIntervals();
                startGeneratingSimpleObjects();
                //startGeneratingAsteroids();
            }

        }, 1000);
    }

    function stopVelocityIncreasing() {
        clearInterval(timeSpentInterval);
    }

    function getVelocityDelta(time) {
        if (time > 200)
            return 0;

        if (Math.floor(time / velocityIncreasingIntervalLength) % 2 == 1)
            return 0.25;

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
            //startGeneratingAsteroids();
            startGeneratingSimpleObjects();
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
        asteroidSpheres = [];
    };

    Game.prototype.pause = function() {
        stopAnimation();
        stopGeneratingAsteroids();
        stopVelocityIncreasing();
    };

    Game.prototype.resume = function() {
        //startGeneratingAsteroids();
        // var heartArr = generateHeart();
        // heartArr.forEach(function (a) {
        //     var newAsteroid = a;
        //     var sphere = getAsteroid(newAsteroid.radius);
        //     sphere.position.set(newAsteroid.positionX, newAsteroid.positionY, 0);
        //     scene.add(sphere);
        //     asteroidSpheres.push(sphere);
        // });
        startGeneratingSimpleObjects();
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
        return Math.floor(this.score);
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
            if (result == Checker.HIT) {
                this._handleHit(a);
                eventBus.dispatch('changeLives');
                break;
            }

            if (result == Checker.HIT_BONUS) {
                this.score += BONUS_SPHERE_PRICE;
                removeSphere(a, i);
                eventBus.dispatch('hitBonus');
            }

            if (result == Checker.MISS) {
                removeSphere(a, i);
            }
        }

        moveCamera();
    };

    function removeSphere(sphere, index) {
        asteroidSpheres.splice(index, 1);
        scene.remove(sphere);
    }

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

    function  generateHeart() {
        stopGeneratingAsteroids();
        setTimeout(function () {
            //startGeneratingAsteroids();
            startGeneratingSimpleObjects();
        }, 2000);
        return HeartsGenerator.getHeartArray();
    }

    function moveCamera() {
        if (!lastHeadPosition)
            return;
        var coef = 1.2;
        camera.position.x = initialCameraPosition.x + lastHeadPosition.x * coef;
        camera.position.y = initialCameraPosition.y + lastHeadPosition.y * coef;

    }

    Game.prototype._handleHit = function(hitAsteroid) {
        stopVelocityIncreasing();
        timeSpent = 0;
        //stopGeneratingAsteroids();
        stopIntervals();
        currentVelocity = -1;
        this._highlightHitAsteroid(hitAsteroid);
        setTimeout(function() {
            currentVelocity = 0.5;
            startVelocityIncreasing();
            startGeneratingSimpleObjects();
            //startGeneratingAsteroids();
        }, 1500);
    };

    Game.prototype._highlightHitAsteroid = function(a) {
        a.material.color.setHex(0xFF0000);
    };

    function getSpiralCreationInterval() {
        return 10;
    }

    Game.prototype._render = function() {
        //this.effect.render(scene, camera);
        renderer.render(scene, camera);
    };

    function getAsteroidCreationInterval() {
        var int = 500 / currentVelocity / 1.2;
        if (int < 50)
            return 50;
        else
            return int;
    }

    return Game;
});
