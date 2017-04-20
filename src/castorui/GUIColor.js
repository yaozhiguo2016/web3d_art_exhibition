﻿var CASTORGUI = CASTORGUI || {};

(function() {

	CASTORGUI.GUIColor = function (id, options, guimanager, callback, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.colorPosition = {x:options.x, y:options.y};
		this.colorSize = {width:options.w, height:options.h};
		this.value = options.value || "#e30000";
		this.zIndex = options.zIndex || 1;
		this.colorVisible = true;
		this.onchangeColor = callback || "";
		this.tabindex = options.tabindex || 0;

		if(append == true) {
			this.addElement(append);
		}
	};

	Extends(CASTORGUI.GUIColor, CASTORGUI.GUIManager);

	CASTORGUI.GUIColor.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var color = document.createElement("input");
		color.type= "color";
		color.value = this.value;
		color.className = "GUIColor";
		color.tabindex = this.tabindex;
		color.style.width = this.colorSize.width+"px";
		color.style.height = this.colorSize.height+"px";		
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {			
			if(append == true) {
				color.style.top = this.convertPixelToPercentHeight(this.colorPosition.y + this.getCanvasOrigine().top)+"%";
				color.style.left = this.convertPixelToPercentWidth(this.colorPosition.x + this.getCanvasOrigine().left)+"%";
			} else {
				color.style.top = (this.colorPosition.y)+"px";
				color.style.left = (this.colorPosition.x)+"px";
			}
		} else {
			if(append == true) {
				color.style.top = (this.colorPosition.y + this.getCanvasOrigine().top)+signe;
				color.style.left = (this.colorPosition.x + this.getCanvasOrigine().left)+signe;
			} else {
				color.style.top = this.colorPosition.y+signe;
				color.style.left = this.colorPosition.x+signe;
			}
		}
		color.style.position = "absolute";
		color.id = this.id;
		color.name = this.id;
		color.style.zIndex = this.zIndex;
		//color.onchange = this.onchangeColor;
		new Hammer(color).on('tap', this.onchangeColor);
		if((navigator.userAgent.indexOf("MSIE") != -1 ) || (navigator.appName == "Netscape") || (!!document.documentMode == true ) || navigator.appVersion.indexOf('Edge')> -1 || (navigator.appVersion.indexOf('Trident') == -1)) {
			window.nativeColorGUI.init(this.id);
		}
		if(append == true) {
			this.html.appendChild(color);
		} else {
			element.appendChild(color);
		}
		this.addGuiElements(color);
    };

	CASTORGUI.GUIColor.prototype.getColor = function(rgb) {
		if(rgb == undefined) {
			rgb = true; 
			hex = false;
		} else if(rgb == true) {
			rgb = true;
			hex = false;
		} else {
			rgb = false;
			hex = true;
		}
		var valueColor = null;
		if(rgb == true) {
			valueColor = hexToRgb(this.getElementById(this.id).value);
		} else if(hex == true) {
			valueColor = this.getElementById(this.id).value;
		}
		return valueColor;
    };

	CASTORGUI.GUIColor.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUIColor.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.colorVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.colorVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUIColor.prototype.isVisible = function() {
		return this.colorVisible;
    };

})();

var hexToR = function(h) {return parseInt((cutHex(h)).substring(0,2),16)};
var hexToG = function(h) {return parseInt((cutHex(h)).substring(2,4),16)};
var hexToB = function(h) {return parseInt((cutHex(h)).substring(4,6),16)};
var cutHex = function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h};
var hexToRgb = function(hex) {
	var c_r = hexToR(hex) / 255, c_g = hexToG(hex) / 255, c_b = hexToB(hex) / 255;
	return {r: c_r, g: c_g, b: c_b};
};