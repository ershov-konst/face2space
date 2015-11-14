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
        score = gameDisplay.find('.score'),
        achievem = gameDisplay.find('.achievemgame'),
        livesCount = 0;

    function changeLives(i) {
        lives.empty();
        for (var j = 0; j < i; j++) {
            lives.append('<div class="live"></div>');
        }
    }

    function changeScore(score) {
        score.html(score);
    }

    function showAchiev(ach) {
        achievem.html(ach);
        achievem.fadeIn('slow');
        setTimeout(achievem.fadeOut(2000), 5000);
    }

    $(document).on('keydown', function (e) {
        if (e.keyCode === 32) {

            //Обработка пробела

            if (STATUS_STOPED) {

                var g = new Game(forRender);
                livesCount = 3;
                changeLives(livesCount);
                mainDisplay.hide();
                gameDisplay.show();

                g.start();
                g.on('changeLives', function (lives) {
                    changeLives(lives);
                });

                setInterval(function () {
                    changeScore(g.getScore());
                }, 1000 / 10);

            }
        }

    });

    mainDisplay.show();

});