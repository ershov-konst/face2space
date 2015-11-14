define(['jquery', 'Game', 'HeadTracker', 'smoother'], function ($, Game, HeadTracker, smoother) {
    //TODO тут все норм, пока это не трогаем

    var
        STATUS_STOPED = 0,
        STATUS_STARTED = 1,
        STATUS_PAUSED = 2,
        STATUS_ENTER_YOUR_NAME = 3;

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
        scoreForUser = mainDisplay.find('.scoreuser'),
        livesCount = 0,
        changeScoreInterval;

    scoreForUser.find('input').bind('keydown', function(e){
        // сохраняем имя

    });

    var htracker = new HeadTracker.Tracker({ui: false, smoothing : false, fadeVideo : true});
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

    function start(){

    }

    var g;
    $(document).on('facetrackingEvent', function(e,k) {
        if (g != undefined && gameStatus == STATUS_STARTED) {
            var x = - (e.originalEvent.x - canvasWidth/2) * 0.3;
            var y = - (e.originalEvent.y - canvasHeight/2) * 0.4;
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
        if (e.keyCode === 32  && faceFounded && gameStatus != STATUS_ENTER_YOUR_NAME) {

            //Обработка пробела

            if (gameStatus == STATUS_STOPED ) {

                g = new Game(forRender);
                livesCount = 3;
                changeLives(livesCount);
                mainDisplay.hide();
                gameDisplay.show();
                scoreForUser.hide();

                g.start();
                g.on('changeLives', function () {
                    livesCount--;
                    changeLives(livesCount);
                    if (livesCount == 0) {
                        clearInterval(changeScoreInterval);
                        g.stop();
                        gameStatus = STATUS_ENTER_YOUR_NAME;
                        gameDisplay.hide();
                        mainDisplay.show();
                        scoreForUser.show();
                        scoreForUser.find('.totalscore')
                            .html(g.getScore());
                        scoreForUser.find('input').focus();
                    }
                });

                g.on('hitBonus', function() {
                    console.log('BONUS!');
                });

                setInterval(function () {
                    if (gameStatus == STATUS_STARTED)
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
