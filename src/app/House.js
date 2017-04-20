/**
 * Created by Stanley on 2016/8/31.
 * 房间的抽象类
 */
var APP = APP || {};

APP.House = function(){
    APP.EventDispatcher.apply(this, arguments);
};

APP.House.prototype = Object.create(APP.EventDispatcher.prototype);
APP.House.prototype.constructor = APP.House;