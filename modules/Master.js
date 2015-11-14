define(['jquery', 'Game'], function ($, Game) {
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
        livesCount = 0;

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

    $(document).on('keydown', function (e) {
        if (e.keyCode === 32) {

            //Обработка пробела

            if (gameStatus == STATUS_STOPED) {

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
                        /*g.stop();*/
                    }
                });

                g.on('hitBonus', function() {
                    console.log('BONUS!');
                });

                setInterval(function () {
                    if (gameStatus == STATUS_STARTED)
                        changeScore(Math.floor(g.getScore()));
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