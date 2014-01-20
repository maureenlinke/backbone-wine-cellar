//Models

window.Wine = Backbone.Collection.extend();

window.WineCollection = Backbone.Collection.extend({
	model: Wine,   //specifies the collection
	url:"../api/wines",   // API endpoint
	defaults: {
        "id":null,
        "name":"",
        "grapes":"",
        "country":"USA",
        "region":"California",
        "year":"",
        "description":"",
        "picture":""
    }
});

//Views

window.WineListView = Backbone.View.extend({
	tagname:'ul',

	initialize: function () {
		this.model.blind("reset", this.render, this);
	},

	render: function (eventName){  //iterates through the collection, and creates a new view for each WineList item
		_.each(this.model.models, function (wine){
			$(this.el).append(new WineListItemView({model:wine}).render().el);
		},this) ;
		return this;
			}
});

//The render function then merges the data into the WineListItem template or html element (ref. in index.html)

window.WineListItemView = Backbone.View.extend ({
	tagname:"li",

	template:_.template($('#tpl-wine-list-item').html()), // creates html element

	render:function (eventName) {
	$(this.el).html(this.tempalte(this.model.toJSON()));
	return this;
	}
});

//View that displays wine details in wine form. Render merges the model data (from WineListView view) (specific wine) into wine details tempalte (ref. in index.html)

window.WineView = Backbone.View.extend ({

	template:_.template($('#tpl-wine-details').html()),  //creates html element
	
	render: function (eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}

});


//Router

//Provides the entry points for the application through a set of (deep-linkable) URLs.Default route (“”) displays the list of wine. The “wines/:id” route displays the details of a specific wine in the wine form. 

var AppRouter = Backbone.Router.extend ({
	routes: {
		"": "list",
		"wines/:id": "windDetails"
	},

	list: function() {
		this.WineList = new WineCollection();
		this.WineListView = new WineListView({model:this.wine});
		$('#content').html(this.wineView.render().el);


	}
});

var app = new AppRouter();
Backbone.history.start();

