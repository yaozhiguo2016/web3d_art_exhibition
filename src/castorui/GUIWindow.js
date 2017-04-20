var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUIWindow = function (id, options, guimanager) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		this.id = id;
		this.html = document.body || document.getElementsByTagName('body')[0];
		this.windowPosition = {x:options.x, y:options.y};
		this.windowSize = {width:options.w, height:options.h};
		this.colorWindow = options.bakgroundColor || null;
		this.imageWindow = options.bakgroundImage || null;
		this.colorContent = options.colorContent || null;
		this.imageContent = options.imageContent;
		this.buttonClose = typeof options.closeButton;
		this.overflow = options.overflow || "auto";
		this.borderWindow = options.borderWindow || null;
		this.borderTitle = options.borderTitle || null;
		this.radiusWindow = options.radiusWindow || 8;
		this.colorTitle = options.colorTitle || "rgba(0, 0, 0, 0.4)";
		this.imageTitle = options.imageTitle || null;
		this.textAlign = options.titleTextAlign || "center";
		this.colorTextTitle = options.titleColor || null;
		this.title = options.textTitle || "Title";
		this.closeStyle = options.closeStyle || null;
		if(options.draggable == true || options.draggable == undefined) {
			this.draggable = true;
		} else {
			this.draggable = typeof(options.draggable) || false;
		}
		this.zIndex = options.zIndex || 0;
		this.windowVisible = false;

		this.addElement();
	};

	Extends(CASTORGUI.GUIWindow, CASTORGUI.GUIManager);

	CASTORGUI.GUIWindow.prototype.addElement = function(append, element)  {
		var signe = "";
		if(this.pixel) { signe = "px"; }
		else { signe = "%"; }
		var window = document.createElement("div");
		window.style.position = "absolute";
		window.style.width = this.windowSize.width+"px";
		window.style.height = this.windowSize.height+"px";
		if(CASTORGUI.GUIManager.convertPixelToPercent == true) {			
			window.style.top = this.convertPixelToPercentHeight(this.windowPosition.y + this.getCanvasOrigine().top)+"%";
			window.style.left = this.convertPixelToPercentWidth(this.windowPosition.x + this.getCanvasOrigine().left)+"%";
		} else {
			window.style.top = (this.windowPosition.y + this.getCanvasOrigine().top)+signe;
			window.style.left = (this.windowPosition.x + this.getCanvasOrigine().left)+signe;			
		}
		window.style.borderRadius = this.radiusWindow+"px";
		window.id = this.id;
		window.name = this.id;
		window.className = "GUIWindow";
		window.style.zIndex = this.zIndex || 0;
		window.style.background = this.colorWindow;		
		window.style.backgroundImage = "url("+this.imageWindow+")";
		window.style.border = this.borderWindow;
		window.style.wordWrap = "break-word";
		window.style.display = "none";

		var titreWindow = document.createElement("div");
		titreWindow.className  = "titleWindoWGUI";
		titreWindow.style.width = this.windowSize.width+"px";		
		titreWindow.style.height = "30px";
		titreWindow.style.textAlign = this.textAlign;
		titreWindow.style.borderRadius = this.radiusWindow+"px "+this.radiusWindow+"px 0 0";
		titreWindow.id = this.id+"_titre";
		titreWindow.style.background = this.colorTitle;
		titreWindow.style.backgroundImage = "url("+this.imageTitle+")";
		titreWindow.style.borderBottom = this.borderTitle;
		if(this.draggable == true) {
			titreWindow.ondragstart = CASTORGUI.draggable(window, titreWindow);
			titreWindow.style.cursor = "move";
		}
		titreWindow.innerHTML = this.title;
		titreWindow.style.zIndex = this.zIndex + 1;
		titreWindow.style.color = this.colorTextTitle;
		titreWindow.style.wordWrap = "break-word";

		var that = this;
		if(this.buttonClose == true || this.buttonClose == "undefined") {
			var close = document.createElement("button");
			var closeStyle = this.closeStyle || {};
			close.innerHTML = "X";
			close.id = this.id+"_button";
			close.style.position = "absolute";
			close.style.borderRadius = closeStyle.borderRadius || '12px';
			close.style.left = closeStyle.x || this.windowSize.width - 12+"px";
			close.style.marginTop = closeStyle.y || "-12px";
			close.style.width = closeStyle.width || "24px";
			close.style.height = closeStyle.height || "24px";
			close.style.zIndex = 10000;
			//close.onclick = function () { that.getElementById(that.id).style.display = "none"; that.windowVisible = false; };
			var hammer = new Hammer(close);
			hammer.on('tap', function(e){
				that.getElementById(that.id).style.display = "none"; that.windowVisible = false;
				if (closeStyle.callback){
					closeStyle.callback.call(that, e);
				}
			});
		}

		var contentWindow = document.createElement("div");
		contentWindow.id = this.id+"_content";		
		contentWindow.style.width = this.windowSize.width+"px";
		contentWindow.style.height = this.windowSize.height - 38 +"px";
		contentWindow.style.overflow = this.overflow;
		contentWindow.style.wordBreak = "keep-all";
		contentWindow.style.marginTop = "0px";
		contentWindow.style.paddingTop = "5px";
		contentWindow.style.borderRadius = "8px";
		contentWindow.style.background = this.colorContent;
		contentWindow.style.backgroundImage = "url("+this.imageContent+")";
		contentWindow.style.zIndex = this.zIndex + 2;

		this.html.appendChild(window);
		this.getElementById(this.id).appendChild(titreWindow);
		if(this.buttonClose == true || this.buttonClose == "undefined") {
			this.getElementById(this.id+"_titre").appendChild(close);
		}
		this.getElementById(this.id).appendChild(contentWindow);

		this.addGuiElements(window);
		this.contentWindow = contentWindow;
    };

	CASTORGUI.GUIWindow.prototype.add = function(element)
	{
		var contentForm = this.getElementById(this.id+"_content");
		contentForm.style.zIndex = this.zIndex + 1;
		element.addElement(false, contentForm);
	};

	CASTORGUI.GUIWindow.prototype.dispose = function() {
		return this.html.removeChild(this.getElementById(this.id));
    };

    CASTORGUI.GUIWindow.prototype.setVisible = function(bool, fade) {
		var display;
		if(fade == undefined) fade = true;
		var element = this.getElementById(this.id);
		if(bool == true) {
			display = "block";
			this.windowVisible = true;
			if(fade == true) { this.fadeIn(element); }
		} else {
			display = "none";
			this.windowVisible = false;
			if(fade == true) { this.fadeOut(element);}
		}
		if(fade == false) { element.style.display = display; }
    };

    CASTORGUI.GUIWindow.prototype.isVisible = function() {
		return this.windowVisible;
    };

})();
