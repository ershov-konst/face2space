define(['jquery', 'Game'], function ($, Game) {
    //TODO тут все норм, пока это не трогаем

    var
        STATUS_STOPED  = 0,
        STATUS_STARTED = 1,
        STATUS_PAUSED  = 2;

    var
        gameStatus = STATUS_STOPED,
        forRender = $('#render'),
        mainDisplay = $('.main-display'),
        gameDisplay = $('.game-display');

    $(document).on('keydown', function (e) {
        if (e.keyCode === 32) {

            //Обработка пробела

            if (STATUS_STOPED){

                var g = new Game(forRender);
                g.start();
                g.on('lose', function(){
                    //показываем финальный экран
                });

                setInterval(function () {
                    //g.getScore();

                }, 1000/10);

            }
        }

    });

});