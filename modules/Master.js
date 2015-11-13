define(['jquery'], function($){

    var r = $('#root');
    var g = new Game(r);

    $(document).ready(function(){
        $(document).on('keydown', function(e){
            if(e.keyCode === 32) {
                g.start();

                if(g.lose()) {
                    $(location).attr('href', "3экран")
                }
                //changeLives
                setInterval(function(){
                    g.getScore();
                    g.redraw();
                },20);
            }
        });
    });
});