/**
 * Created by Stanley on 2016/8/31.
 * 根程序，启动项目的入口
 */
var APP = APP || {};
APP.Main = function(canvas){
    this.canvas = canvas;
};

APP.Main.prototype.start = function(roomIndex){

    APP.roomIndex = roomIndex;

    var scene = new APP.Scene();
    scene.setUp(this.canvas);

    var ui = new APP.UI(this.canvas);
    ui.start();
    scene.ui = ui;

    var loading = new APP.Loading(scene);
    loading.load();
    loading.addEventListener('loadComplete', function(e){
        scene.createMeshes(e.tasks);
    });

    ui.addEventListener('pictureClicked', function(e){
        scene.gotoPicture(scene, scene.pickResult)
    })
};