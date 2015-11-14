requirejs.config({
   paths: {
      'three': '../lib/three',
      'anaglyph': '../lib/anaglyph',
      'EventBus': '../lib/EventBus',
      'jquery': '../lib/jquery-2.1.4.min',
      'HeadTracker': '../lib/headtrackr'
   },
   shim: {
      anaglyph: {
         deps: ['three']
      }
   }
});

require(['Master'], function(Master){
   //РїСЂРёРјРµСЂ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ
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