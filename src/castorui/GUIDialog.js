var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUIDialog = function (id, options, guimanager, callback, append) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		if(append == null || append == undefined) { append = true; }

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.dialogSize = {width:options.w, height:options.h};
		this.dialogPosition = {x:options.x, y:options.y};
		this.overflow = options.overflow || "auto";
		this.borderDialog = options.border || null;
		this.colorDialog = options.backgroundColor || null;
		this.imageDialog = options.backgroundImage || null;
		this.buttonDialog = options.closeDialog || "true";
		this.imageButtonDialog = options.imageButtonDialog || "false";
		this.urlImage = options.urlImage || null;
		this.callback = callback || null;
		this.radius = options.radius || 8;
		this.zIndex = options.zIndex || 0;
		this.dialogVisible = false;

		if(append == true) {
			this.addElement(append);
		}
	};

	Extends(CASTORGUI.GUIDialog, CASTORGUI.GUIManager);

	CASTORGUI.GUIDialog.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var dialog = document.createElement("div");
		dialog.style.width = this.dialogSize.width+"px";
		dialog.style.height = this.dialogSize.height+"px";
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {
			dialog.style.top = this.convertPixelToPercentHeight(this.dialogPosition.y + this.getCanvasOrigine().top)+"%";
			dialog.style.left = this.convertPixelToPercentWidth(this.dialogPosition.x + this.getCanvasOrigine().left)+"%";
		} else {			
			dialog.style.top = (this.dialogPosition.y + this.getCanvasOrigine().top)+signe;
			dialog.style.left = (this.dialogPosition.x + this.getCanvasOrigine().left)+signe;
		}
		dialog.style.position = "absolute";
		dialog.id = this.id;
		dialog.name = this.id;
		dialog.className = "GUIDialog";
		dialog.style.zIndex = this.zIndex;
		dialog.style.background = this.colorDialog;
		dialog.style.borderRadius = this.radius+"px";
		dialog.style.backgroundImage = "url("+this.imageDialog+")";
		dialog.style.border = this.borderDialog;
		dialog.style.display = "none";
		dialog.style.overflow = this.overflow;
		var eventButton = null;

		if(append == true) {
			this.html.appendChild(dialog);
		} else {
			element.appendChild(dialog);
		}

		if(this.buttonDialog == "true") {
			eventButton = document.createElement("button");
			eventButton.innerHTML = "X";
			eventButton.id = this.id+"_button";
			eventButton.style.position = "absolute";
			eventButton.style.borderRadius = "12px";
			eventButton.style.border = "2px solid black";
			eventButton.style.left = this.dialogSize.width - 12+signe;
			eventButton.style.marginTop = "-12px";
			eventButton.style.width = "25px";
			eventButton.style.height = "25px";
			eventButton.style.zIndex = 10000;
			//eventButton.onclick = function () { document.body.removeChild(dialog);};
			new Hammer(eventButton).on('tap', function(e){document.body.removeChild(dialog);});
			this.getElementById(this.id).appendChild(eventButton);
		} else if(this.imageButtonDialog == "true") {
			var that = this;
			this._getSizeImage(this.urlImage, function(result){
				var sizeImageW = result.w;
				var sizeImageH = result.h;
				eventButton = document.createElement("img");
				eventButton.src = that.urlImage;
				eventButton.id = that.id+"_button";
				eventButton.style.position = "absolute";
				eventButton.style.left = that.dialogSize.width - (sizeImageW / 2)+signe;
				eventButton.style.marginTop = "-"+(sizeImageH / 2)+signe;
				eventButton.style.width = sizeImageW+signe;
				eventButton.style.height = sizeImageH+signe;
				eventButton.style.cursor = "pointer";
				eventButton.style.zIndex = 10000;
				//eventButton.onclick = that.callback;
				new Hammer(eventButton).on('tap', that.callback);
				that.getElementById(that.id).appendChild(eventButton);
			});
		} else if(this.buttonDialog == "false" && this.imageButtonDialog == "false" && this.callback) {
			//dialog.onclick = this.callback;
			new Hammer(dialog).on('tap', this.callback);
			dialog.style.cursor = "pointer";
		}

		this.addGuiElements(dialog);
    };

	CASTORGUI.GUIDialog.prototype._getSizeImage = function(URL, callback) {
		var image = new Image();
		image.src = URL;
		image.onload = function() {
		var result = {w:image.width, h:image.height};
			callback(result);
		};
	};

	CASTORGUI.GUIDialog.prototype.add = function(element)
	{
		var contentDialog = this.getElementById(this.id);
		contentDialog.style.zIndex = this.zIndex + 1;
		element.style.zIndex + 2;
		element.addElement(false, contentDialog);
	};

	CASTORGUI.GUIDialog.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUIDialog.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.dialogVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.dialogVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUIDialog.prototype.isVisible = function() {
		return this.dialogVisible;
    };

})();
