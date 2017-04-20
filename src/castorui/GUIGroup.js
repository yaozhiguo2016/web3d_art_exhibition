var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.GUIGroup = function(name, options, guimanager) {

		CASTORGUI.GUIManager.call(this, guimanager.canvas, guimanager.canvasCss);

		this.html = document.body || document.getElementsByTagName('body')[0];
		if(options) { this.groupPosition = {x:options.x, y:options.y}; }
		this.guiManager = guimanager;
        this.name = name;
        this.elementsGoup = [];
        this.guiManager.groups.push(this);
		this.groupVisible = true;
    };

	Extends(CASTORGUI.GUIGroup, CASTORGUI.GUIManager);

    CASTORGUI.GUIGroup.prototype.add = function(guiElement) {
        this.elementsGoup.push(guiElement);
    };

    CASTORGUI.GUIGroup.prototype.dispose = function() {
        var that = this;
		this.elementsGoup.forEach(function(e) {
			if(that.getElementById(e.id)) {
				that.html.removeChild(that.getElementById(e.id));
			}
		});
		return;
    };

	CASTORGUI.GUIGroup.prototype.setVisible = function(bool) {
		var display;
		var that = this;
		if(bool == true) {
			display = "block";
			this.groupVisible = true;
		} else {
			display = "none";
			this.groupVisible = false;
		}
		this.elementsGoup.forEach(function(e) {
			that.getElementById(e.id).style.display = display;
		});
		return;
    };

    CASTORGUI.GUIGroup.prototype.isVisible = function() {
		return this.groupVisible;
    };
})();
