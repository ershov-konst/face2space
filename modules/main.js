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
    //пример использования
   // var scene = {
   //     minX: 0,
   //     maxX: window.innerWidth + 1000,
   //     minY: 0,
   //     maxY: window.innerHeight + 1000
   // };
   // var check = new Checker({positionX: window.innerWidth / 2, positionY: window.innerHeight / 2, positionZ: 0});
   // var t = new Generator(scene);
   // var k;
   // for ( var i = 0; i < 100 ; i ++)
   // {
   //     k = t.getObject();
   //     console.log(k);
   //     console.log(check.checkObject(k));
   // }
});
