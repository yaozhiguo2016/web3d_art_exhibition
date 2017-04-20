/**
 * Created by Stanley on 2016/9/3.
 */
var APP = APP || {};

APP.Utils = function(){

};

APP.Utils.inherit = function(sub, parent){

    sub.prototype = Object.create(parent.prototype);
    sub.prototype.constructor = sub;
};