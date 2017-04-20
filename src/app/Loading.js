/**
 * Created by Stanley on 2016/9/1.
 */
var APP = APP || {};

APP.Loading = function(appScene){

    APP.EventDispatcher.apply(this, arguments);
    this.appScene = appScene;
    this.assetsManager = new BABYLON.AssetsManager(appScene.scene);
    this.assetsManager.useDefaultLoadingScreen = true;
};

APP.Utils.inherit(APP.Loading, APP.EventDispatcher);

APP.Loading.prototype.load = function(){

    var roomIndex = APP.roomIndex;

    var that = this;
    this.appScene.engine.loadingUIText = '加载中...';
    this.assetsManager.reset();

    var roomInfo = APP.AppConfig.getRoomInfo(roomIndex);

    this.assetsManager.addMeshTask('room' + roomIndex, '', './assets/' + roomInfo.fileName + '/',
        roomInfo.fileName + '.babylon');
    //this.assetsManager.addMeshTask('frame_h', '', './assets/FramePicture_Horizontal/', 'FramePicture_Horizontal.babylon');
    //this.assetsManager.addMeshTask('frame_v', '', './assets/FramePicture_Vertical/', 'FramePicture_Vertical.babylon');

    for (var key in roomInfo['pics']){
        var config = roomInfo['pics'][key];
        if (config.pic){
            if (APP.AppConfig.mode === 'dev'){
                this.assetsManager.addTextureTask(config.pic, 'pictures/' + config.pic, true, true);
            }else{
                var imgUrl = config.pic;
                var idx = imgUrl.lastIndexOf('.');
                var picUrl = imgUrl.substring(0, idx-3) + imgUrl.substring(idx, imgUrl.length);
                this.assetsManager.addTextureTask(config.pic, picUrl, true, true);
            }
            console.log('ssssssssssssssssssss:', config.pic, picUrl);
        }
    }

    //name board texture
    if (roomInfo.mp && roomInfo.mp.length > 0){
        this.assetsManager.addTextureTask('nameBoardTexture', roomInfo.host + roomInfo.mp, true, true);
    }

    this.assetsManager.addTextureTask('hFrameTexture',
        './assets/FramePicture_Horizontal/Frame.jpg', true, false);
    //this.assetsManager.addTextureTask('vFrameTexture',
    //    './assets/FramePicture_Vertical/FramePictureVertical.jpg', true, true);

    this.assetsManager.load();

    this.assetsManager.onTaskSuccess = function(task){
        console.log(task);
    };
    this.assetsManager.onError = function(msg){
        console.log(msg);
    };
    this.assetsManager.onFinish = function(tasks){
        that.dispatchEvent({type:'loadComplete', tasks:tasks});
    };
};