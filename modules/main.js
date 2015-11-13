requirejs.config({
   paths: {
      'three': '../lib/three',
      'EventBus': '../lib/EventBus',
      'jquery': '../lib/jquery-2.1.4.min'
   }
});

require(['Master'], function(Master){

});