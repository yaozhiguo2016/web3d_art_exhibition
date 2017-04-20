/**
 * Created by Stanley on 2016/8/31.
 */
var APP = APP || {};

APP.Scene = function(){
    APP.EventDispatcher.apply(this, arguments);
};

APP.Utils.inherit(APP.Scene, APP.EventDispatcher);

/**
 * 构建渲染环境
 * @param canvas
 */
APP.Scene.prototype.setUp = function(canvas){

    this.render = canvas;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0, 0, 0);
    this.scene.collisionsEnabled = true;
	//this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    this.setCamera();
	this.setLight();
	this.setSkyBox();
    //this.setDebug();
    //this.setPhysics();

    var that = this;
    this.engine.runRenderLoop(function () {
        that.scene.render();
        that.checkJoyStickInput();
    });

    window.addEventListener("resize", function () {
        that.engine.resize();
    });

    var canvas = this.engine.getRenderingCanvas();
    canvas.addEventListener(device.mobile() ? 'touchend' : "click", function () {

        var pickResult = that.scene.pick(that.scene.pointerX, that.scene.pointerY);
        //console.log(pickResult.getNormal(true));
        console.log(pickResult.pickedPoint);
        //console.log(pickResult.pickedMesh._boundingInfo);
        console.log(pickResult.pickedMesh.name);

        if (pickResult.pickedMesh.parent && pickResult.pickedMesh.parent instanceof APP.PictureFrame){
            //console.log(pickResult.pickedMesh.parent.name);
            if (that.isInAnimation)return;
            if (device.mobile()){
                that.pickResult = pickResult;
                that.ui.setWorkCheckState();
                
                var picName = pickResult.pickedMesh.parent.name;
                var picTexture = pickResult.pickedMesh.parent._children[1].material.emissiveTexture;//.url;
                var picInfo = APP.AppConfig.getPictureInfoByName(APP.roomIndex, picName);
                that.ui.setPicturePath(picTexture);

                that.ui.setPictureDesc({
                    name:picInfo.descName,
                    type:picInfo.descType,
                    date:picInfo.descDate,
                    content:picInfo.descContent
                });
            }else{
                that.gotoPicture(that, pickResult);
            }   
        }
    });

    canvas.addEventListener('mousemove', function(){
        var pickResult2 = that.scene.pick(that.scene.pointerX, that.scene.pointerY);
        if (pickResult2.pickedMesh.parent && pickResult2.pickedMesh.parent instanceof APP.PictureFrame){
            //console.log(pickResult2.pickedMesh.parent.name);
            var picName = pickResult2.pickedMesh.parent.name;
            var picInfo = APP.AppConfig.getPictureInfoByName(APP.roomIndex, picName);
            that.ui.setPictureDesc({
                name:picInfo.descName,
                type:picInfo.descType,
                date:picInfo.descDate,
                content:picInfo.descContent
            });
            that.ui.setDescVisible(true);
        }else{
            that.ui.setDescVisible(false);
        }
    });

    this.isInAnimation = false;
};

APP.Scene.prototype.setCamera = function(){

    var cameraConfig = APP.AppConfig.getRoomCameraInfo(APP.roomIndex);
    var cameraPos = cameraConfig['pos'];
    var cameraTarget = cameraConfig['target'];

    this.camera = new BABYLON.FreeCamera("camera1",
        new BABYLON.Vector3(cameraPos[0], cameraPos[1], cameraPos[2]),
        this.scene);
    if(device.mobile()){
        this.camera.inputs.remove(this.camera.inputs.attached.keyboard);
        // console.log('ssssssssssssssss', this.camera.angularSensibility);
        this.camera.angularSensibility = 4000;
    }
    else{
        this.camera.keysUp.push(87); // W
        this.camera.keysDown.push(83); // S
        this.camera.keysLeft.push(65); // A
        this.camera.keysRight.push(68); // D
    }
    this.camera.setTarget(new BABYLON.Vector3(cameraTarget[0], cameraTarget[1], cameraTarget[2]));
    this.camera.attachControl(this.render, false);
    this.camera.ellipsoid = new BABYLON.Vector3(4, 8, 4);
    this.camera.checkCollisions = true;
    this.camera.applyGravity = APP.AppConfig.getRoomGravity(APP.roomIndex);//true; //防止穿透屋顶
};

APP.Scene.prototype.setLight = function(){

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
    // Dim the light a small amount
    light.intensity = 1.5;
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(1, 1, 1);
    light.groundColor = new BABYLON.Color3(1, 1, 1);

    /*var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, 1, 0), this.scene);
    light0.diffuse = new BABYLON.Color3(1, 0, 0);
    light0.specular = new BABYLON.Color3(1, 1, 1);*/

    /*var light0 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(68, -110, 40), new BABYLON.Vector3(0, 1, 0), 0.8, 2, this.scene);
    light0.diffuse = new BABYLON.Color3(1, 0, 0);
    light0.specular = new BABYLON.Color3(1, 1, 1);*/
};

APP.Scene.prototype.setPhysics = function(){

    var gravityVector = new BABYLON.Vector3(0, -9.8, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    this.scene.enablePhysics(gravityVector, physicsPlugin);

    this.camera.physicsImpostor =
        new BABYLON.PhysicsImpostor(this.camera,
            BABYLON.PhysicsImpostor.SphereImpostor,
            {
                mass: 0.1,
                friction:0.9,
                restitution: 0.0
            },
            this.scene);
    var pns = ['Ground01', 'Ground02'];
    for (var i in pns){
        var name = pns[i];
        var mesh = this.scene.getMeshByName(name);
        if (mesh){
            mesh.physicsImpostor =
                new BABYLON.PhysicsImpostor(mesh,
                    BABYLON.PhysicsImpostor.BoxImpostor,
                    { mass: 0, friction:0.9,restitution: 0.0 }, this.scene);
            mesh.checkCollisions = true;
        }
    }
};

APP.Scene.prototype.setSkyBox = function(){
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 1600.0, this.scene, false, BABYLON.Mesh.BACKSIDE);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/skybox/cloudy_noon", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
};

/**
 * 设置调试区域
 */
APP.Scene.prototype.setDebug = function(){
    var debugLayer = new BABYLON.DebugLayer(this.scene);
    debugLayer.show();
    console.log(this.engine.getGlInfo());
};

/**
 * 移动到某个画框
 * @param that
 * @param pickResult
 */
APP.Scene.prototype.gotoPicture = function(that, pickResult){

    this.isInAnimation = true;
    //计算画框中心点向上方向上的某个点，这个点作为每次摄影滑行的终点
    var times = device.mobile() ? 25 : 15;
    function calculateCamrateStarePoint(faceNormal, boxCenter){
        var longVec = faceNormal.multiplyByFloats(times,times,times);
        return boxCenter.add(longVec);
    };
    var pickResult = pickResult || that.pickResult;
    var boxCenter = pickResult.pickedMesh._boundingInfo.boundingBox.center;
    function onFrame(){
        that.camera.setTarget(boxCenter);
    };

    //注册逐帧函数，动态刷新摄影机朝向，一直面向画框中心点
    that.scene.registerBeforeRender(onFrame);

    var ZERO = that.camera.position;
    var END = calculateCamrateStarePoint(pickResult.getNormal(true), boxCenter);
    var easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    BABYLON.Animation.CreateAndStartAnimation(
        'anim',
        that.camera,
        'position',
        60, 120,
        ZERO, END,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
        easingFunction,
        function(){
            //注销逐帧函数
            that.scene.unregisterBeforeRender(onFrame);
            that.isInAnimation = false;
        }
    );
};

APP.Scene.prototype.createMeshes = function(meshTasks){

    this.picFrameTasks = {}; //两个相框的素材
    this.textures = {}; //纹理
    this.frameTextures = {};
    this.nameBoardTexture = null;

    for (var k in meshTasks){
        var task = meshTasks[k];
        if (task.name.indexOf('frame_') != -1){
            this.picFrameTasks[task.name] = task;
        }
        if(task.name.indexOf('pic') != -1){
            this.textures[task.name] = task.texture;
        }
        if(task.name.indexOf('FrameTexture') != -1){
            this.frameTextures[task.name] = task.texture;
        }
        if (task.name.indexOf('nameBoardTexture') != -1){
            this.nameBoardTexture = task.texture;
        }
    }

    for (var i in meshTasks){
        var task = meshTasks[i];
        if (task.name.indexOf('room') != -1){
            this._createRoom(task);
        }
        /*task.run(scene.scene, function(a){

         }, function(error){
         console.log(error);
         });*/
    }
    this._createPicureFrame();
    console.log('create room Complete');

    //this.setPhysics();
};

APP.Scene.prototype._createHorizontalFrameOriginal = function(){

    if (this.hFrameOriginal)return;
    this.hFrameOriginal = new APP.PictureFrame('hPictureFrame', this.scene);
    for (var key in this.picFrameTasks['frame_h'].loadedMeshes){
        var mesh = this.picFrameTasks['frame_h'].loadedMeshes[key];
        //mesh.position = new BABYLON.Vector3(mesh.position.x - 25, mesh.position.y + 25, mesh.position.z + 2.5);
        mesh.checkCollisions = true;
        mesh.isPickable = true;
        mesh.receiveShadows = false;
        mesh.parent = this.hFrameOriginal;
        //mesh.showBoundingBox = true;
        //mesh.showSubMeshesBoundingBox = true;
        //this.scene.addMesh(meshTask.loadedMeshes[key]);
    }
    //this.scene.addMesh(frame);
    this.hFrameOriginal.setEnabled(false);
};

APP.Scene.prototype._createVerticalFrameOriginal = function(){

    if (this.vFrameOriginal)return;
    this.vFrameOriginal = new APP.PictureFrame('vPictureFrame', this.scene);
    for (var key in this.picFrameTasks['frame_v'].loadedMeshes){
        var mesh = this.picFrameTasks['frame_v'].loadedMeshes[key];
        //mesh.position = new BABYLON.Vector3(mesh.position.x - 25, mesh.position.y + 25, mesh.position.z + 2.5);
        mesh.checkCollisions = true;
        mesh.isPickable = true;
        mesh.receiveShadows = false;
        mesh.parent = this.vFrameOriginal;
        //mesh.showBoundingBox = true;
        //mesh.showSubMeshesBoundingBox = true;
        //this.scene.addMesh(meshTask.loadedMeshes[key]);
    }
    this.vFrameOriginal.setEnabled(false);
    //this.scene.addMesh(frame);
};

APP.Scene.prototype._createPicureFrame = function(){

    var picCount = APP.AppConfig.getRoomPicCount(APP.roomIndex);
    for (var i = 0; i < picCount; i++){
        var picInfo = APP.AppConfig.getRoomPicInfo(APP.roomIndex, i);
        if (picInfo.pic === void 0)continue;
        var curFrame,frameTexture;
        var texture = this.textures[picInfo.pic];
        var textureSize = texture.getBaseSize(); //获取纹理尺寸
        if (textureSize.width > textureSize.height){
            //this._createHorizontalFrameOriginal()
            frameTexture = this.frameTextures['hFrameTexture'];
            curFrame = new APP.PictureFrame(picInfo.name, this.scene);//, null, this.hFrameOriginal);
        }else {
            //this._createVerticalFrameOriginal();
            frameTexture = this.frameTextures['hFrameTexture'];
            curFrame = new APP.PictureFrame(picInfo.name, this.scene);//, null, this.vFrameOriginal);
        }
        curFrame.position = new BABYLON.Vector3(picInfo.pos[0], picInfo.pos[1], picInfo.pos[2]);
        curFrame.rotation = new BABYLON.Vector3(picInfo.rot[0], picInfo.rot[1], picInfo.rot[2]);
        if(picInfo.pic !== void 0){
            curFrame.setPicture(texture, frameTexture);//给相框添加画的内容纹理
        }
        this.scene.addMesh(curFrame);
    }
};

APP.Scene.prototype._createRoom = function(meshTask){
    for (var key in meshTask.loadedMeshes){
        var mesh = meshTask.loadedMeshes[key];
        mesh.checkCollisions = true;
        mesh.isPickable = true;
        mesh.receiveShadows = false;
        mesh.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
        console.log(mesh.name);
        if(mesh.material){
            mesh.material.backFaceCulling = false;
            mesh.material.fogEnabled = false;
            //special for alpha png
            if(mesh.material.diffuseTexture &&
            (mesh.material.diffuseTexture.name === 'LightBox.png'
            ||mesh.material.diffuseTexture.name === 'Light.png'
            ||mesh.material.diffuseTexture.name === 'WindowBig.png'))
            {
                mesh.material.diffuseTexture.hasAlpha = true;
                mesh.material.useAlphaFromDiffuseTexture = true;
                mesh.checkCollisions = false;
            }
            //mesh.material.alpha = 0.5;
            mesh.disableLighting = true;
        }
        this.scene.addMesh(meshTask.loadedMeshes[key]);
    }

    //姓名牌的处理
    var nameBoard = this.scene.getMeshByName('NameBoard') || this.scene.getMeshByName('NameBoard01');
    if (nameBoard && this.nameBoardTexture){
        var nameBoardMat = new BABYLON.StandardMaterial('nameBoardMat', this.scene);
        nameBoardMat.disableLighting = true;
        nameBoardMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        nameBoardMat.emissiveTexture = this.nameBoardTexture;//new BABYLON.Texture('./resource/ui/MiniMap.jpg', this.scene);
        nameBoard.material = nameBoardMat;
    }
};

APP.Scene.prototype.checkJoyStickInput = function(){
    if (APP.Globals.JOY_STICK_DOWN){
        //console.log('joystick down...');
        var speed = this.camera._computeLocalCameraSpeed() / 3;
        this.camera._localDirection.copyFromFloats(speed * APP.Globals.joyStickDirection.x, 0,
            speed * APP.Globals.joyStickDirection.z);
        this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
        BABYLON.Vector3.TransformNormalToRef(this.camera._localDirection,
            this.camera._cameraTransformMatrix,
            this.camera._transformedDirection);
        this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);
    }
};