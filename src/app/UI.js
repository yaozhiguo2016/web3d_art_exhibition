/**
 * Created by Stanley on 2016/9/3.
 */
var APP = APP || {};

APP.UI = function(canvas){

    APP.EventDispatcher.apply(this, arguments);
    this.canvas = canvas;
};

APP.Utils.inherit(APP.UI, APP.EventDispatcher);

APP.UI.prototype.start = function(){

    var css = "button{cursor:pointer}";
    CASTORGUI.GUIManager.convertPixelToPercent = true; // for converte pixel value in percentage
    var options = {themeRoot:'./css/', themeGUI:'default', pixel:true};
    var guiSystem = new CASTORGUI.GUIManager(this.canvas, css, options);

    var size = guiSystem.getCanvasSize();
    this.size = size;
    this.guiSystem = guiSystem;

    this.createControlBar();
    this.createHelpWindow();
    if(device.desktop())this.createDescWindow();
    this.HelpForm.setVisible(false);
};

APP.UI.prototype.createControlBar = function(){

    var _this = this;
    var size = this.size;

    if (device.mobile()){
        this.createJoyStick();
        this.btnWorkCheck = new CASTORGUI.GUIButton('btnWorkCheck', {
            w:60, h:60,x:size.width - 80,y:size.height - 80,
            backgroundImage:'./assets/ui/work_check.png',
            value:' '
        }, this.guiSystem, function(e){
            _this.btnWorkCheck.setVisible(false);
            _this.mobileControlBarGroup.setVisible(true);
            _this.dispatchEvent({'type':'pictureClicked'});
        });
        this.btnWorkCheck.setVisible(false);
        this._createMobileControlBar();
        this._createMobileWorkInfoWindow();
        this.createEnlargePicture();
    }else {
        this.moveTip = new CASTORGUI.GUITexture('moveTip', './assets/ui/move_tip.png', {
            w:260,h:140,x:0,y:size.height - 140
        }, this.guiSystem);
        //帮助按钮
        this.btnHelp = new CASTORGUI.GUIButton('btnHelp', {
            w:45, h:35, x:size.width - 100,y:size.height - 50,value:'HELP'
        }, this.guiSystem, function(e){
            _this.HelpForm.setVisible(!_this.HelpForm.isVisible());
        });
    }
};

/**
 * 进入作品查看模式
 */
APP.UI.prototype.setWorkCheckState = function(){
    this.btnWorkCheck.setVisible(true);
    this.mobileControlBarGroup.setVisible(false);
    this.joy.setVisible(false);
};

APP.UI.prototype.offWorkCheckState = function(){
    this.mobileControlBarGroup.setVisible(false);
    this.btnWorkCheck.setVisible(false);
    this.joy.setVisible(true);
};
/**
 * 移动平台模式下点击就近查看时显示的按钮栏，包括‘作品信息’，‘放大’，‘关闭’按钮
 */
APP.UI.prototype._createMobileControlBar = function(){
    var _this = this;
    var size = this.size;

    var btnWorkInfo = new CASTORGUI.GUIButton('btnWorkInfo', {
        w:60, h:60,x:size.width - 220,y:size.height - 80,
        backgroundImage:'./assets/ui/work_info.png',
        value:' '
    }, this.guiSystem, function(e){
        _this.mobileWorkInfoWindow.setVisible(true);
    });

    var btnWorkEnlarge = new CASTORGUI.GUIButton('btnWorkEnlarge', {
        w:60, h:60,x:size.width - 150,y:size.height - 80,
        backgroundImage:'./assets/ui/work_enlarge.png',
        value:' '
    }, this.guiSystem, function(e){
        _this.picEnlarge.setVisible(true);
        _this.pictureBg.setVisible(true);
    });

    var btnWorkClose = new CASTORGUI.GUIButton('btnWorkClose', {
        w:60, h:60,x:size.width - 80,y:size.height - 80,
        backgroundImage:'./assets/ui/work_close.png',
        value:' '
    }, this.guiSystem, function(e){
        _this.offWorkCheckState();
    });

    this.mobileControlBarGroup = new CASTORGUI.GUIGroup('mobileControlBarGroup',
        {x:size.width - 250,
        y:size.height - 40}, this.guiSystem);

    this.mobileControlBarGroup.add(btnWorkInfo);
    this.mobileControlBarGroup.add(btnWorkEnlarge);
    this.mobileControlBarGroup.add(btnWorkClose);

    this.mobileControlBarGroup.setVisible(false);
};

APP.UI.prototype._createMobileWorkInfoWindow = function(){
    var size = this.size;
    var WIDTH = 400;
    var HEIGHT = 200;
    this.mobileWorkInfoWindow = new CASTORGUI.GUIWindow('mobileWorkInfoWindow', {
        x:(size.width - WIDTH) * 0.5,
        y:(size.height - HEIGHT) * 0.5,
        w:WIDTH,
        h:HEIGHT,
        textTitle:'作品信息',
        draggable:false,
        //bakgroundColor:'#222222',
        //zIndex:100
    }, this.guiSystem);

    var workWindowBg = new CASTORGUI.GUITexture('workWindowBg', 'assets/ui/des_bg.png', {
        w:WIDTH,
        h:HEIGHT - 38,
        x:0,
        y:36
    }, this.guiSystem, null, false);

    // this.mobileWorkInfoWindow.add(workWindowBg);

    this.descName = new CASTORGUI.GUIText('descName', {
        x:20,
        y:50,
        size:14,
        color:'white',
        text:'画作名称:'
    }, this.guiSystem, false);

    this.descType = new CASTORGUI.GUIText('descType', {
        x:20,
        y:75,
        size:14,
        color:'white',
        text:'画作分类:'
    }, this.guiSystem, false);

    this.descDate = new CASTORGUI.GUIText('descDate', {
        x:20,
        y:100,
        size:14,
        color:'white',
        text:'创作日期:'
    }, this.guiSystem, false);

    this.descDetail = new CASTORGUI.GUIText('descDetail', {
        x:20,
        y:125,
        size:14,
        color:'white',
        text:'画作介绍:'
    }, this.guiSystem, false);

    this.mobileWorkInfoWindow.add(workWindowBg);
    this.mobileWorkInfoWindow.add(this.descName);
    this.mobileWorkInfoWindow.add(this.descType);
    this.mobileWorkInfoWindow.add(this.descDate);
    this.mobileWorkInfoWindow.add(this.descDetail);

    this.descDetail.textElement.style.width = '380px';
    this.descDetail.textElement.style.height = '80px';
    this.descDetail.textElement.style.wordWrap = 'break-word';
};

/**
 * 帮助界面
 */
APP.UI.prototype.createHelpWindow = function(){
    var _this = this;
    var size = this.size;

    var WIDTH = device.mobile() ? 260:800;
    var HEIGHT = device.mobile() ? 500:500;

    this.HelpForm = new CASTORGUI.GUIWindow('HelpForm', {
        x:(size.width - WIDTH) * 0.5,
        y:(size.height - HEIGHT) * 0.5,
        w:WIDTH,
        h:HEIGHT,
        textTitle:'操作指南',
        draggable:false,
        bakgroundColor:'#222222',
        zIndex:100
    }, this.guiSystem);

    var url = './assets/ui/' + (device.mobile() ? 'help_mobile.png' : 'help_pc.png');

    this.opTip = new CASTORGUI.GUITexture('opTip', url, {
        w:WIDTH,
        h:HEIGHT - 40,
        x:0,
        y:40
    }, this.guiSystem, null, false);

    this.HelpForm.add(this.opTip);
    this.HelpForm.setVisible(false);
};

APP.UI.prototype.createDescWindow = function(){
    var size = this.size;

    this.descGroup = new CASTORGUI.GUIGroup('descGroup',
        {x:(size.width - 450) * 0.5,
        y:0}, this.guiSystem);


    this.descBg = new CASTORGUI.GUITexture('descBg', 'assets/ui/des_bg.png', {
        w:450,
        h:120,
        x:(size.width - 450) * 0.5,
        y:0
    }, this.guiSystem);

    this.descName = new CASTORGUI.GUIText('descName', {
        x:(size.width - 450) * 0.5 + 20,
        y:10,
        size:14,
        color:'white',
        text:'画作名称:'
    }, this.guiSystem);

    this.descType = new CASTORGUI.GUIText('descType', {
        x:(size.width - 450) * 0.5 + 20,
        y:30,
        size:14,
        color:'white',
        text:'画作分类:'
    }, this.guiSystem);

    this.descDate = new CASTORGUI.GUIText('descDate', {
        x:(size.width - 450) * 0.5 + 20,
        y:50,
        size:14,
        color:'white',
        text:'创作日期:'
    }, this.guiSystem);

    this.descDetail = new CASTORGUI.GUIText('descDetail', {
        x:(size.width - 450) * 0.5 + 20,
        y:70,
        size:14,
        color:'white',
        text:'画作介绍:'
    }, this.guiSystem);

    this.descGroup.add(this.descBg);
    this.descGroup.add(this.descName);
    this.descGroup.add(this.descType);
    this.descGroup.add(this.descDate);
    this.descGroup.add(this.descDetail);
    this.descGroup.setVisible(false);

    this.descDetail.textElement.style.width = '400px';
    this.descDetail.textElement.style.height = '80px';
    this.descDetail.textElement.style.wordWrap = 'break-word';
};

APP.UI.prototype.setPictureDesc = function(content){
    this.descName.textElement.innerHTML = '画作名称:' + content.name;
    this.descType.textElement.innerHTML = '画作分类:' + content.type;
    this.descDate.textElement.innerHTML = '创作日期:' + content.date;
    this.descDetail.textElement.innerHTML = '画作介绍:' + content.content;
};

APP.UI.prototype.setDescVisible = function(visible){
    this.descGroup.setVisible(visible);
};

APP.UI.prototype.createEnlargePicture = function(){
    var size = this.size;
    var _this = this;

    this.pictureBg = new CASTORGUI.GUITexture('descBg', 'assets/ui/des_bg.png', {
        w:size.width,
        h:size.height,
        x:0,
        y:0
    }, this.guiSystem, function(){
        _this.picEnlarge.setVisible(false);
        _this.pictureBg.setVisible(false);
    });

    this.pictureBg.setVisible(false);

    this.picEnlarge = new CASTORGUI.GUITexture('picEnlarge','', {
        /*w:300,
        h:100,
        x:(size.width - 300) * 0.5,
        y:(size.height - 100) * 0.5 */
    }, this.guiSystem, function(){
        _this.picEnlarge.setVisible(false);
        _this.pictureBg.setVisible(false);
    }, true);

    this.picEnlarge.setVisible(false);

    //触屏操作拉伸图片
    var img = this.picEnlarge.img;
    var currentLen = 0;
    var startTouchX = 0;
    var startTouchY = 0;

    img.addEventListener('touchstart', function(event){
        event.preventDefault();
        var touches = event.touches;
        if (touches.length === 1){
            startTouchX = touches[0].pageX;
            startTouchY = touches[0].pageY;
        }
        if (touches.length != 2)return;
        currentLen = distanceBetween(touches[0], touches[1]);
    });

    img.addEventListener('touchmove', function(event){
        event.preventDefault();

        var currentWidth = trimNum(img.style.width);
        var currentHeight = trimNum(img.style.height);
        var deltaMoveX = 0;
        var deltaMoveY = 0;

        var touches = event.touches;

        if (touches.length === 1){
            console.log(touches[0]);
            deltaMoveX = touches[0].pageX - startTouchX;
            deltaMoveY = touches[0].pageY - startTouchY;
            img.style.left = trimNum(img.style.left) + deltaMoveX + 'px';
            img.style.top = trimNum(img.style.top) + deltaMoveY + 'px';
            startTouchX = touches[0].pageX;
            startTouchY = touches[0].pageY;
        }
        if (touches.length != 2)return;

        var distance = distanceBetween(touches[0], touches[1]);
        var delta = distance - currentLen;
        //指间距离增加，zoomout

        if (delta > 0){
            img.style.width = currentWidth * 1.05 + 'px';
            img.style.height = currentHeight * 1.05 + 'px';
        }else{
            img.style.width = currentWidth * 0.95 + 'px';
            img.style.height = currentHeight * 0.95 + 'px';
        }
        img.style.left = (size.width - currentWidth) * 0.5 + 'px';
        img.style.top = (size.height - currentHeight) * 0.5 + 'px';
    });

    img.addEventListener('touchend', function(event){
        currentLen = 0;
    });

    function distanceBetween(t1, t2){
        var v1 = new BABYLON.Vector2(t1.pageX, t1.pageY);
        var v2 = new BABYLON.Vector2(t2.pageX, t2.pageY);
        return v1.subtract(v2).length();
    }

    function trimNum(substr){
        return parseFloat(substr.substr(0, substr.length - 2));
    };
};

APP.UI.prototype.setPicturePath = function(textureUrl){
    var size = this.size;
    var textureSize = textureUrl.getBaseSize();
    this.picEnlarge.img.src = textureUrl.url;
    var rat = 1;
    this.picEnlarge.img.style.width = textureSize.width / rat + 'px';
    this.picEnlarge.img.style.height = textureSize.height / rat + 'px';
    this.picEnlarge.img.style.left = (size.width - textureSize.width / rat) * 0.5 + 'px';
    this.picEnlarge.img.style.top = (size.height - textureSize.height / rat) * 0.5 + 'px';
};