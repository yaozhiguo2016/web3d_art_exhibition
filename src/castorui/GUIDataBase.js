var CASTORGUI = CASTORGUI || {};

(function() {

    CASTORGUI.DataBase = function (useSessionStorage) {
		if(useSessionStorage == undefined || useSessionStorage == false) {
			this.database = window.localStorage;
		} else {
			this.database = window.sessionStorage;
		}
	};	

	CASTORGUI.DataBase.prototype.deleteDataBase = function()
	{
		this.database.clear();
	};
	
	CASTORGUI.DataBase.prototype.deleteTable = function(table)
	{
		this.database.removeItem(table);
	};
		
	CASTORGUI.DataBase.prototype.deleteField = function(table, field)
	{
		var champ = table[field];
		this.database.removeItem(champ);
	};
	
	CASTORGUI.DataBase.prototype.deleteItemFromField = function(table, field, item)
	{
		var valeur = table[field][item];
		this.database.removeItem(item);
	};		
	
	CASTORGUI.DataBase.prototype.addTable = function(table)
	{
		var empty = JSON.stringify({});
		this.database.setItem(table, empty);
	};
	
	CASTORGUI.DataBase.prototype.createField = function(table, field, value)
	{	
		var data = JSON.stringify(value);
		var json = eval("({" + field + " : "+data+"})");
		this.database.setItem(table, JSON.stringify(json));		
	};
	
	CASTORGUI.DataBase.prototype.insertItemFromField = function(table, field, item, value)
	{		
		var data = JSON.stringify(value);
		this.database.setItem(table[field][item], data); 
	};
	
	CASTORGUI.DataBase.prototype.selectItem = function(table, field, item) 
	{		
		var theTable = $.parseJSON(this.database[table]);
		return theTable[field][item];
	};		
		
	CASTORGUI.DataBase.prototype.selectAllItems = function(table, field)
	{
		var theTable = $.parseJSON(this.database[table][field]);
		return theTable;
	};
	
	CASTORGUI.DataBase.prototype.selectAllTable = function(table)
	{
		var theTable = $.parseJSON(this.database[table]);
		return theTable;
	};
	
	CASTORGUI.DataBase.prototype.selectAllDataBase = function()
	{
		return $.parseJSON(this.database);
	};
	
	CASTORGUI.DataBase.prototype.updateItem = function(table, field, item, value)
	{		
		this.database[table][field][item] = value;
	};
	
	CASTORGUI.DataBase.prototype.getLimit = function()
	{
		return this.database.length - 1;
	};
	
	CASTORGUI.DataBase.prototype.isSupported = function()
	{
		if(typeof localStorage != 'undefined') {
			return true;
		} else {			
			return false;
		}
	};

})();
