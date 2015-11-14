define(['jquery', 'Game','HeadTracker'], function($, Game, HeadTracker){
    var r = $('#root');
    var g = new Game($('#placeholder'));
    var videoInput = document.getElementById('inputVideo');
    var canvasInput = document.getElementById('inputCanvas');

    var htracker = new HeadTracker.Tracker();
    console.log(htracker);
    htracker.init(videoInput, canvasInput);
    htracker.start();
    $(document).on('headtrackingEvent', function(e,k) {
        var x = e.originalEvent.x;
        var y = e.originalEvent.y;
        var z = e.originalEvent.z;
        console.log(x + " = " + y + " - " + z);
        g.headMoved(x, y);
        // console.log(x + " - " + y);
    });
    $(document).on('headtrackrStatus', function (e) {
        var status = e.originalEvent.status;
    })

    //g.start();
});
