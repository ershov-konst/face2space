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
   //     x0 = 0;
   //     x1 = window.innerWidth + 1000;
   //     y0 = 0;
   //     y1 = window.innerHeight + 1000;
   // var check = new Checker({positionX: window.innerWidth / 2, positionY: window.innerHeight / 2, positionZ: 0});
   // var t = new Generator(x0,x1,y0,y1);
   // var k;
   // for ( var i = 0; i < 100 ; i ++)
   // {
   //     k = t.getObject();
   //     console.log(k);
   //     console.log(check.checkObject(k));
   // }
});
