/**
 * Created by Stanley on 2016/9/25.
 */
var APP = APP || {};

APP.UI.prototype.createJoyStick = function(){
    var size = this.size;
    this.joy = new CASTORGUI.GUIGroup('grp', {
        x:10,
        y:size.height - 10
    }, this.guiSystem);

    var stickBg = new CASTORGUI.GUITexture(
        'stickBg',
        './assets/ui/JoystickBG.png',
        {
            w:103,
            h:103,
            x:10,
            y:size.height - 103 - 10
        },
        this.guiSystem
    );

    var stick = new CASTORGUI.GUITexture(
        'stick',
        './assets/ui/Joystick.png',
        {
            w:73,
            h:78,
            x:10,
            y:size.height - 103 - 10
        },
        this.guiSystem
    );

    var bgPos = stickBg.imagePosition;
    var bgSize = stickBg.imageSize;
    var stickSize = stick.imageSize;
    centerLayout();

    var CENTER = {x:bgPos.x + (bgSize.width - stickSize.width) * 0.5,
                  y:bgPos.y + (bgSize.height - stickSize.height) * 0.5};
    var RADIUS = bgSize.width * 0.5;

    stick.img.addEventListener('touchstart', function(event){
        console.log(event);
        event.preventDefault();
    });

    stick.img.addEventListener('touchmove', function(event){
        event.preventDefault();
        var touch = event.changedTouches[0];
        var trX = touch.clientX - stickBg.imageSize.width * 0.5;
        var trY = touch.clientY - stickBg.imageSize.height * 0.5;
        //console.log(touch);
        var dis = distance({x:trX, y:trY}, CENTER);
        if (dis <= RADIUS){ //半径内鼠标跟随
            setPosition(touch.clientX, touch.clientY);
        }else { //限定在圆圈外围
            var angle = Math.atan((trY - CENTER.y)/(trX - CENTER.x));
            var cx = CENTER.x + RADIUS * Math.cos(angle);
            var cy = CENTER.y + RADIUS * Math.sin(angle);
            //第二，四象限
            if (touch.clientX < CENTER.x + stickBg.imageSize.height * 0.5){
                cx = CENTER.x - RADIUS * Math.cos(angle);
                cy = CENTER.y - RADIUS * Math.sin(angle);
            }
            setPosition(cx  + stick.imageSize.width * 0.5, cy + stick.imageSize.height * 0.5);
        }
        APP.Globals.JOY_STICK_DOWN = true;
        APP.Globals.joyStickDirection =
            new BABYLON.Vector3((trX - CENTER.x) / RADIUS, 0, (CENTER.y - trY)/RADIUS);
    });

    stick.img.addEventListener('touchend', function(event){
        event.preventDefault();
        centerLayout();
        APP.Globals.JOY_STICK_DOWN = false;
    });

    function centerLayout(){
        stick.img.style.left = bgPos.x + (bgSize.width - stickSize.width) * 0.5 + 'px';
        stick.img.style.top = bgPos.y + (bgSize.height - stickSize.height) * 0.5 + 'px';
    };

    function setPosition(x, y){
        stick.img.style.left = x - stick.imageSize.width*0.5 + 'px';
        stick.img.style.top = y - stick.imageSize.height*0.5 + 'px';
    };

    function distance(p1, p2){
        var deltaX = p1.x - p2.x;
        var deltaY = p1.y - p2.y;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };

    this.joy.add(stickBg);
    this.joy.add(stick);
};