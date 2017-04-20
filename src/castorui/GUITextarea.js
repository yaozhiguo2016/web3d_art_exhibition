var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUITextarea = function (id, options, guimanager, callback, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.textareaPosition = {x:options.x, y:options.y};
		this.textareaSize = {width:options.w, height:options.h};
		this.value = options.value || "";
		this.placeholder = options.placeholder || "";
		this.background = options.background || null;
		this.color = options.color || null;
		this.zIndex = options.zIndex || 2;
		this.textareaVisible = true;
		this.onchangeTextarea = callback || "";
		this.tabindex = options.tabindex || 0;

		if(append == true) {
			this.addElement(append);
		}
	};

	Extends(CASTORGUI.GUITextarea, CASTORGUI.GUIManager);

	CASTORGUI.GUITextarea.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var textarea = document.createElement("textarea");
		textarea.cols = this.textareaSize.width;
		textarea.rows = this.textareaSize.height;
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {
			if(append == true) {
				textarea.style.top = this.convertPixelToPercentHeight(this.textareaPosition.y + this.getCanvasOrigine().top)+"%";
				textarea.style.left = this.convertPixelToPercentWidth(this.textareaPosition.x + this.getCanvasOrigine().left)+"%";
			} else {
				textarea.style.top = (this.textareaPosition.y)+"px";
				textarea.style.left = (this.textareaPosition.x)+"ox";
			}
		} else {
			if(append == true) {
				textarea.style.top = (this.textareaPosition.y + this.getCanvasOrigine().top)+signe;
				textarea.style.left = (this.textareaPosition.x + this.getCanvasOrigine().left)+signe;
			} else {
				textarea.style.top = this.textareaPosition.y+signe;
				textarea.style.left = this.textareaPosition.x+signe;
			}
		}
		textarea.style.position = "absolute";
		textarea.style.display = "block";
		textarea.placeholder = this.placeholder;
		textarea.id = this.id;
		textarea.name = this.id;
		textarea.className = "GUITextarea";
		textarea.tabindex = this.tabindex;
		textarea.innerHTML = this.value;
		textarea.style.zIndex = this.zIndex;
		textarea.style.background = this.background;
		textarea.style.color = this.color;
		textarea.onchange = this.onchangeTextarea;

		if(append == true) {
			this.html.appendChild(textarea);
		} else {
			element.appendChild(textarea);
		}
		this.addGuiElements(textarea);
    };

	CASTORGUI.GUITextarea.prototype.getValue = function() {
		return this.getElementById(this.id).value;
	};

	CASTORGUI.GUITextarea.prototype.setValue = function(val) {
		this.value = val;
		this.getElementById(this.id).value = val;
	};

	CASTORGUI.GUITextarea.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUITextarea.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.textareaVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.textareaVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUITextarea.prototype.isVisible = function() {
		return this.textareaVisible;
    };

})();
