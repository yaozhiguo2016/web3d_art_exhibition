var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUICheckbox = function (id, options, guimanager, callback, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.checkboxPosition = {x:options.x, y:options.y};
		this.checkboxSize = options.size || 1.0;
		this.zIndex = options.zIndex || 1.0;
		this.checkboxVisible = true;
		this.onClickCheckbox = callback || "";
		this.tabindex = options.tabindex || 0;

		if(append == true) {
			this.addElement(append);
		}
	};

	Extends(CASTORGUI.GUICheckbox, CASTORGUI.GUIManager);

	CASTORGUI.GUICheckbox.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.style.width = (this.checkboxSize * 16)+"px";
		checkbox.style.height = (this.checkboxSize * 16)+"px";
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {			
			if(append == true) {
				checkbox.style.top = this.convertPixelToPercentHeight(this.checkboxPosition.y + this.getCanvasOrigine().top)+"%";
				checkbox.style.left = this.convertPixelToPercentWidth(this.checkboxPosition.x + this.getCanvasOrigine().left)+"%";
			} else {
				checkbox.style.top = (this.checkboxPosition.y)+"px";
				checkbox.style.left = (this.checkboxPosition.x)+"px";
			}
		} else {
			if(append == true) {
				checkbox.style.top = (this.checkboxPosition.y + this.getCanvasOrigine().top)+signe;
				checkbox.style.left = (this.checkboxPosition.x + this.getCanvasOrigine().left)+signe;
			} else {
				checkbox.style.top = this.checkboxPosition.y+signe;
				checkbox.style.left = this.checkboxPosition.x+signe;
			}
		}
		checkbox.style.position = "absolute";
		checkbox.style.padding = "0px";
		checkbox.style.margin = "0px";
		checkbox.id = this.id;
		checkbox.name = this.id;
		checkbox.className = "GUICheckbox";
		checkbox.tabindex = this.tabindex;
		checkbox.style.zIndex = this.zIndex;
		//checkbox.onclick = this.onClickCheckbox;
		var hammer = new Hammer(close);
		hammer.on('tap', this.onClickCheckbox);

		if(append == true) {
			this.html.appendChild(checkbox);
		} else {
			element.appendChild(checkbox);
		}
		this.addGuiElements(checkbox);
    };

	CASTORGUI.GUICheckbox.prototype.isChecked = function()  {
		if(this.getElementById(this.id).checked) {
			return true;
		} else {
			return false;
		}
	};

	CASTORGUI.GUICheckbox.prototype.setChecked = function(value)  {
		this.getElementById(this.id).checked = value;		
	};

	CASTORGUI.GUICheckbox.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUICheckbox.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.checkboxVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.checkboxVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUICheckbox.prototype.isVisible = function() {
		return this.checkboxVisible;
    };

})();
