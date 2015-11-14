define(['jquery', 'Game'], function($, Game){
    var r = $('#root');
    var g = new Game($('#placeholder'));
    g.start();
});