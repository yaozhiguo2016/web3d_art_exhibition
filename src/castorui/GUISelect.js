var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUISelect = function (id, options, guimanager, callback, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.selectPosition = {x:options.x, y:options.y};
		this.selectSize = {width:options.w, height:options.h};
		this.zIndex = options.zIndex || 1;
		this.selectVisible = true;
		this.onchangeSelectoptions = callback || false;
		this.tabindex = options.tabindex || 0;
		this.optionsListe = [];
		this.append = append;

		if(this.append == true) {
			this.addElement(this.append);
		}
	};

	Extends(CASTORGUI.GUISelect, CASTORGUI.GUIManager);

	CASTORGUI.GUISelect.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var that = this;
		var select = document.createElement("select");
		select.style.width = this.selectSize.width+"px";
		select.style.height = this.selectSize.height+"px";
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {			
			if(append == true) {
				select.style.top = this.convertPixelToPercentHeight(this.selectPosition.y + this.getCanvasOrigine().top)+"%";
				select.style.left = this.convertPixelToPercentWidth(this.selectPosition.x + this.getCanvasOrigine().left)+"%";
			} else {
				select.style.top = (this.selectPosition.y)+"px";
				select.style.left = (this.selectPosition.x)+"px";
			}
		} else {
			if(append == true) {
				select.style.top = (this.selectPosition.y + this.getCanvasOrigine().top)+signe;
				select.style.left = (this.selectPosition.x + this.getCanvasOrigine().left)+signe;
			} else {
				select.style.top = this.selectPosition.y+signe;
				select.style.left = this.selectPosition.x+signe;
			}
		}		
		select.style.position = "absolute";
		select.id = this.id;
		select.name = this.id;
		select.className = "GUISelect";
		select.tabindex = this.tabindex;
		select.style.zIndex = this.zIndex;
		select.onchange = this.onchangeSelectoptions;

		if(append == true) {
			this.html.appendChild(select);
		} else {
			element.appendChild(select);
			this.optionsListe.forEach(function(options) {
				that.getElementById(that.id).appendChild(options);
			});
		}

		this.addGuiElements(select);
    };

	CASTORGUI.GUISelect.prototype.addOptions = function(value, text) {
		var options = document.createElement("option");
		options.value = value;
		options.innerHTML = text;
		if(this.append == false) {
			this.optionsListe.push(options);
		} else{
			this.getElementById(this.id).appendChild(options);
		}
	};
	
	CASTORGUI.GUISelect.prototype.findOptionSelected = function(withIndex) {
		if(withIndex == undefined) withIndex = false;
		var elSel = this.getElementById(this.id);
		var str = elSel.options[elSel.selectedIndex].text;		
		if(withIndex == true) {
			return elSel.selectedIndex;
		} else {
			return str;
		}
	};
	
	CASTORGUI.GUISelect.prototype.removeOption = function(value) {
		var elSel = this.getElementById(this.id);
		for(var i = 0; i <= elSel.length - 1; i++) {
			if(elSel.options[i].text == value) {
				elSel.remove(i);
				break;
			}
		}
		if(this.append == false) {
			for(var b in arr ){
				if(arr[b] == value) {
					arr.splice(b, 1);
					break;
				} 
			} 
		}	
		return;
	};
	
	CASTORGUI.GUISelect.prototype.changeItem = function(oldValue, newValue) {
		var elSel = this.getElementById(this.id);
		for(var i = 0; i <= elSel.length - 1; i++) {
			if(elSel.options[i].text == oldValue) {
				elSel.options[i].text = newValue;
				elSel.options[i].value = newValue;
				break;
			}
		}
		return;
	};
	
	CASTORGUI.GUISelect.prototype.selectedItem = function(item) {
		var elSel = this.getElementById(this.id);
		for(var i = 0; i <= elSel.length - 1; i++) {
			if(elSel.options[i].text == item) {
				elSel.options[i].setAttribute('selected', true);				
			} else {
				elSel.options[i].removeAttribute('selected');
			}
		}
		return;
	};

	CASTORGUI.GUISelect.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUISelect.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.selectVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.selectVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUISelect.prototype.isVisible = function() {
		return this.selectVisible;
    };

})();
