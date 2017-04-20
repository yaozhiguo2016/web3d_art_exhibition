﻿var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUIFieldset = function (id, options, guimanager, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.fieldsetPosition = {x:options.x, y:options.y};
		this.fieldsetSize = {width:options.w, height:options.h};
		this.legend = options.legend;
		this.zIndex = options.zIndex || 1;
		this.fieldsetVisible = true;

		if(append == true) {
			this.addElement(append);
		}
	};

	Extends(CASTORGUI.GUIFieldset, CASTORGUI.GUIManager);

	CASTORGUI.GUIFieldset.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var fieldset = document.createElement("fieldset");
		fieldset.style.width = this.fieldsetSize.width+"px";
		fieldset.style.height = this.fieldsetSize.height+"px";		
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {
			if(append == true) {
				fieldset.style.top = this.convertPixelToPercentHeight(this.fieldsetPosition.y + this.getCanvasOrigine().top)+"%";
				fieldset.style.left = this.convertPixelToPercentWidth(this.fieldsetPosition.x + this.getCanvasOrigine().left)+"%";
			} else {
				fieldset.style.top = (this.fieldsetPosition.y)+"px";
				fieldset.style.left = (this.fieldsetPosition.x)+"px";
			}
		} else {
			if(append == true) {
				fieldset.style.top = (this.fieldsetPosition.y + this.getCanvasOrigine().top)+signe;
				fieldset.style.left = (this.fieldsetPosition.x + this.getCanvasOrigine().left)+signe;
			} else {
				fieldset.style.top = (this.fieldsetPosition.y)+signe;
				fieldset.style.left = (this.fieldsetPosition.x)+signe;
			}
		}		
		fieldset.style.position = "absolute";
		fieldset.id = this.id;
		fieldset.name = this.id;
		fieldset.className = "GUIFieldset";
		fieldset.style.zIndex = this.zIndex;
		this.html.appendChild(fieldset);
		var legend = document.createElement("legend");
		legend.innerHTML = this.legend;

		if(append == true) {
			this.getElementById(this.id).appendChild(legend);
		} else {
			element.appendChild(legend);
		}
		this.addGuiElements(fieldset);
    };

	CASTORGUI.GUIFieldset.prototype.add = function(element)
	{
		var contentFieldSet = this.getElementById(this.id);
		element.addElement(false, contentFieldSet);
	};

	CASTORGUI.GUIFieldset.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUIFieldset.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.fieldsetVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.fieldsetVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUIFieldset.prototype.isVisible = function() {
		return this.fieldsetVisible;
    };

})();
