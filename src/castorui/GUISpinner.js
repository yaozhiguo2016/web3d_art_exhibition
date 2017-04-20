var CASTORGUI = CASTORGUI || {};

(function() {

	CASTORGUI.GUISpinner = function (id, options, guimanager, callback, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.numberPosition = {x:options.x, y:options.y};
		this.numberSize = {width:options.w, height:options.h};
		this.min = options.min || 0;
		this.max = options.max || 100;
		this.step = options.step || 1;
		this.value = options.value || (this.max/2);
		this.zIndex = options.zIndex || 1;
		this.orient = options.orient || "horizontal"; // or "vertical"
		this.numberVisible = true;
		this.onchangeNumber = callback || false;
		this.tabindex = options.tabindex || 0;

		if(append == true) {
			this.addElement(append);
		}
	};

	Extends(CASTORGUI.GUISpinner, CASTORGUI.GUIManager);

	CASTORGUI.GUISpinner.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var number = document.createElement("input");
		number.type= "number";
		number.min= this.min;
		number.max= this.max;
		number.value = this.value;
		number.step = this.step;		
		number.style.width = this.numberSize.width+signe;
		number.style.height = this.numberSize.height+signe;
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {			
			if(append == true) {
				number.style.top = this.convertPixelToPercentHeight(this.numberPosition.y + this.getCanvasOrigine().top)+"%";
				number.style.left = this.convertPixelToPercentWidth(this.numberPosition.x + this.getCanvasOrigine().left)+"%";
			} else {
				number.style.top = (this.numberPosition.y)+"px";
				number.style.left = (this.numberPosition.x)+"px";
			}
		} else {
			if(append == true) {
				number.style.top = (this.numberPosition.y + this.getCanvasOrigine().top)+signe;
				number.style.left = (this.numberPosition.x + this.getCanvasOrigine().left)+signe;
			} else {
				number.style.top = this.numberPosition.y+signe;
				number.style.left = this.numberPosition.x+signe;
			}		
		}
		number.style.position = "absolute";
		number.id = this.id;
		number.name = this.id;
		number.className = "GUISpinner";
		number.tabindex = this.tabindex;
		number.style.zIndex = this.zIndex;
		number.oninput = this.onchangeNumber;
		number.onchange = this.onchangeNumber;

		if(append == true) {
			this.html.appendChild(number);
		} else {
			element.appendChild(number);
		}
		this.addGuiElements(number);
    };

	CASTORGUI.GUISpinner.prototype.getValue = function() {
		return this.getElementById(this.id).value;
    };

	CASTORGUI.GUISpinner.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUISpinner.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.numberVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.numberVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUISpinner.prototype.isVisible = function() {
		return this.numberVisible;
    };

})();
