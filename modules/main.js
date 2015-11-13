requirejs.config({
   paths: {
      'three': '../lib/three',
      'EventBus': '../lib/EventBus'
   }
});

require(['three', 'EventBus'], function(tm, THREE, EventBus){

   var t = new tm();
   console.log(t.testMethod(2));
   console.log(THREE);
   console.log(EventBus);
});