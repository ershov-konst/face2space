define(['jquery', 'Game', 'HeadTracker', 'smoother'], function ($, Game, HeadTracker, smoother) {
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
<<<<<<< HEAD
        videoInput = document.getElementById('inputVideo'),
        canvasInput = document.getElementById('inputCanvas'),
        canvasHeight = canvasInput.height,
        canvasWidth  = canvasInput.width,
        faceFounded = false,
        scoreForUser = mainDisplay.find('.scoreuser'),
        livesCount = 0,
        changeScoreInterval;

    scoreForUser.find('input').bind('keydown', function(e) {
        var user  = $(this).val();
        mainDisplay.find('.startbutton').hide();
        if (e.keyCode === 13) {
            localStorage.setItem("username", user);
           mainDisplay.find('.scoreuser').hide();
            //mainDisplay.find('.startbutton').show();
            start();
        }
    });

    var htracker = new HeadTracker.Tracker({ui: false, smoothing : false, fadeVideo : true});
    htracker.init(videoInput, canvasInput);
    htracker.start();

=======
        scoreForUser = mainDisplay.find('.scoreuser');
        livesCount = 0;
>>>>>>> 4667523a9e8957ee795ba387cb5ba359c7ad6475

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

<<<<<<< HEAD
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
        mainDisplay.find('.startbutton').hide();
        if ( status == 'found' ) {
            faceFounded = true;
            mainDisplay.find('.startbutton').show();
            $(document).on('headtrackrStatus', function (e) {
                var status = e.originalEvent.status;
                mainDisplay.find('.startbutton').hide();
                if ( status == 'found' ) {
                    faceFounded = true;
                    mainDisplay.find('.startbutton').show();
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
            $(document).on('headtrackrStatus', function (e) {
                var status = e.originalEvent.status;
                mainDisplay.find('.startbutton').hide();
                if ( status == 'found' ) {
                    faceFounded = true;
                    mainDisplay.find('.startbutton').show();
                    start();
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

    function start() {
        $(document).on('keydown', function (e) {
            if (e.keyCode === 32 && faceFounded) {

                //Обработка пробела
=======
    $(document).on('keydown', function (e) {
        if (e.keyCode === 32) {

            //Обработка пробела

            if (gameStatus == STATUS_STOPED) {

                var g = new Game(forRender);
                livesCount = 3;
                changeLives(livesCount);
                mainDisplay.hide();
                gameDisplay.show();
>>>>>>> 4667523a9e8957ee795ba387cb5ba359c7ad6475

                if (gameStatus == STATUS_STOPED) {

                    g = new Game(forRender);
                    livesCount = 3;
                    changeLives(livesCount);
<<<<<<< HEAD
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
                            gameDisplay.hide();
                            mainDisplay.show();
                            mainDisplay.find('.startbutton').hide();
                            scoreForUser.show();
                            scoreForUser.find('.totalscore')
                                .html(g.getScore());
                            scoreForUser.find('input').focus();

                        }
                    });

                    changeScoreInterval = setInterval(function () {
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
=======
                    if (livesCount == 0){
                        g.stop();
                        gameDisplay.hide();
                        mainDisplay.show();
                        mainDisplay.append('<div class="scoreuser"></div>');
                        $('.scoreuser').html(g.getScore());
                        $('.scoreuser').append('<input id="username" type=" WORD" maxlength="10">');
                    }
                });

                setInterval(function () {
                    changeScore(g.getScore());
                }, 1000 / 10);

            }
        }
>>>>>>> 4667523a9e8957ee795ba387cb5ba359c7ad6475

        });
    }

    start();
    mainDisplay.show();
});
