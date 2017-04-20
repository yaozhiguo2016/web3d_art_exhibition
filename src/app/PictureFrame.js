/**
 * Created by Stanley on 2016/9/3.
 */
var APP = APP || {};

/**
 * @constructor
 * @param {string} name The value used by scene.getMeshByName() to do a lookup.
 * @param {Scene} scene The scene to add this mesh to.
 * @param {Node} parent The parent of this mesh, if it has one
 * @param {Mesh} source An optional Mesh from which geometry is shared, cloned.
 * @param {boolean} doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
 *                  When false, achieved by calling a clone(), also passing False.
 *                  This will make creation of children, recursive.
 */
APP.PictureFrame = function(name, scene){
    BABYLON.Mesh.apply(this, arguments);
};

APP.Utils.inherit(APP.PictureFrame, BABYLON.Mesh);

/**
 * 给相框设置纹理（画）
 * @param texture 画对应的纹理
 * @param frameType 画框类型，横or竖版
 */
APP.PictureFrame.prototype.setPicture = function(texture, frameTexture){
    console.log(texture.getSize(), texture.getBaseSize());

    var SCALE_SIZE = 50; //比例尺 1：500，即纹理的尺寸和Mesh的尺寸比例

    var textureSize = texture.getBaseSize();
    var meshWidth = textureSize.width / SCALE_SIZE;
    var meshHeight = textureSize.height / SCALE_SIZE;

    this.createStructure(meshWidth, meshHeight, frameTexture);

   /* var hfSize = {width:11.78, height:7.008}; //水平画框模型的宽高
    var vfSize = {width:3.25, height:4.36}; //垂直画框模型的宽高
    var currentFrameSize = frameType === 'h' ? hfSize : vfSize;

    var R = 1.75;
    var frameScaleX = meshWidth / (currentFrameSize.width);
    var frameScaleY = meshHeight / (currentFrameSize.height);

    var w2h = (textureSize.width * 370) / (textureSize.height * 620);
    var picRatio = textureSize.width / textureSize.height;*/

    //{ size: number, width: number, height: number, sideOrientation: number, updatable: boolean, sourcePlane: Plane }
    var picMesh = new BABYLON.MeshBuilder.CreatePlane(
        texture.name,
        {
            width:meshWidth,
            height:meshHeight,
            updatable:false
        },
        this._scene
    );
    var picMeshMat = new BABYLON.StandardMaterial('mapMat', this._scene);
    picMeshMat.disableLighting = true;
    picMeshMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    picMeshMat.emissiveTexture = texture;//new BABYLON.Texture('./resource/ui/MiniMap.jpg', this.scene);
    picMesh.material = picMeshMat;
    picMesh.backFaceCulling = true;
    //picMesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
    picMesh.position = new BABYLON.Vector3(0.11, 0, 0);
    picMesh.rotation  = new BABYLON.Vector3(0, -Math.PI/2, 0);
    //picMesh.scaling = new BABYLON.Vector3(2.2, 1.27, 1);
    //picMesh.scaling = new BABYLON.Vector3(baseSize.width / baseSize.height, 1.0, 1.0);
    //picRatio > 1 ? (picMesh.scaling.x = picRatio) : (picMesh.scaling.y = w2h/picRatio);
    //picRatio > 1 ? this.scaling.x = w2h : this.scaling.y = 1/w2h;

    //picMesh.setEnabled(false);
    picMesh.parent = this;

    //this.scaling.x = frameScaleX;
    //this.scaling.y = frameScaleY;
    //picMesh.scaling.x = 1 / frameScaleX;
    //picMesh.scaling.y = 1 / frameScaleY;

    //console.log(this.getBoundingInfo());
    //console.log(this);
};

APP.PictureFrame.prototype.createStructure = function(width, height, texture){

    var frameMat = new BABYLON.StandardMaterial('frameMat', this._scene);
    frameMat.disableLighting = true;
    frameMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    frameMat.emissiveTexture = texture;
    //frameMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
    //frameMat.diffuseTexture = texture;

    /*var hSpriteNb =  6;  // 6 sprites per raw
    var vSpriteNb =  4;  // 4 sprite raws

    var faceUV = new Array(6);

    for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(i/hSpriteNb, 0, (i+1)/hSpriteNb, 1 / vSpriteNb);
    }*/
    var faceUV = new Array(6);
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.25, 0.75);     //front down  前
    faceUV[1] = new BABYLON.Vector4(0.5, 0.5, 0.75, 0.75);   //back up   后
    faceUV[2] = new BABYLON.Vector4(0.25, 0.5, 0.5, 0.75);   //left  左
    faceUV[3] = new BABYLON.Vector4(0.75, 0.5, 1.0, 0.75);   //right 右
    faceUV[4] = new BABYLON.Vector4(0.5, 0.25, 0.75, 0.5);   //top   顶
    faceUV[5] = new BABYLON.Vector4(0.5, 0.75, 0.75, 1.0);   //bottom  底

     /*var f = 4;
     var temp = faceUV[f].x;
     faceUV[f].x = faceUV[f].z;
     faceUV[f].z = temp;*/


    var structure = BABYLON.MeshBuilder.CreateBox('structure', {
        width:width + 0.6,
        height:height + 0.6,
        depth:0.2,
        updatable:false,
        faceUV:faceUV
    }, this._scene);

    structure.backFaceCulling = false;
    structure.material = frameMat;
    structure.rotation.y = Math.PI / 2;
    structure.parent = this;
};

