define(['jquery', 'Game', 'HeadTracker'], function ($, Game, HeadTracker) {
    //TODO тут все норм, пока это не трогаем

    var
        STATUS_STOPED = 0,
        STATUS_STARTED = 1,
        STATUS_PAUSED = 2;

    var
        gameStatus = STATUS_STOPED,
        forRender = $('#render'),
        mainDisplay = $('.main-display'),
        gameDisplay = $('.game-display'),
        lives = gameDisplay.find('.lives'),
        scoreElem = gameDisplay.find('.score'),
        achievem = gameDisplay.find('.achievemgame'),
        videoInput = document.getElementById('inputVideo'),
        canvasInput = document.getElementById('inputCanvas'),
        canvasHeight = canvasInput.height,
        canvasWidth  = canvasInput.width,
        faceFounded = false,
        livesCount = 0;

    var htracker = new HeadTracker.Tracker({ui: false, detectionInterval: 50});
    htracker.init(videoInput, canvasInput);
    htracker.start();


    function changeLives(i) {
        lives.empty();
        for (var j = 0; j < i; j++) {
            lives.append('<div class="live"></div>');
        }
    }

    function changeScore(score) {
        scoreElem.html(score);
    }

    function showAchiev(ach) {
        achievem.html(ach);
        achievem.fadeIn('slow');
        setTimeout(achievem.fadeOut(2000), 5000);
    }

    var g;
    $(document).on('facetrackingEvent', function(e,k) {
        if (g != undefined && gameStatus == STATUS_STARTED) {
            var x = - (e.originalEvent.x - canvasWidth/2) * 0.1;
            var y = - (e.originalEvent.y - canvasHeight/2) * 0.1;
            g.headMoved(x, y);
        }
    });
    $(document).on('headtrackrStatus', function (e) {
        var status = e.originalEvent.status;
        if ( status == 'found' ) {
            faceFounded = true;
            if (g != undefined && gameStatus == STATUS_PAUSED ) {
                gameStatus = STATUS_STARTED;
                g.resume();
            }
        }
        else if (g != undefined && gameStatus == STATUS_STARTED) {
            g.pause();
            gameStatus = STATUS_PAUSED;
            faceFounded = false;
        }
    });
    $(document).on('keydown', function (e) {
        if (e.keyCode === 32  && faceFounded) {

            //Обработка пробела

            if (gameStatus == STATUS_STOPED ) {

                g = new Game(forRender);
                livesCount = 3;
                changeLives(livesCount);
                mainDisplay.hide();
                gameDisplay.show();

                g.start();
                g.on('changeLives', function () {
                    livesCount--;

                    changeLives(livesCount);
                    if (livesCount == 0){
                        //g.stop();
                    }
                });

                setInterval(function () {
                    changeScore(g.getScore());
                }, 1000 / 10);

                gameStatus = STATUS_STARTED;

            }
            else if (gameStatus == STATUS_STARTED) {
                g.pause();
                gameStatus = STATUS_PAUSED;
            }
            else {
                gameStatus = STATUS_STARTED;
                g.resume();
            }
        }

    });

    mainDisplay.show();
});
