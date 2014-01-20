//Models

window.Wine = Backbone.Collection.extend();

window.WineCollection = Backbone.Collection.extend({
	model: Wine,   //specifies the collection
	url:"../api/wines"    // API endpoint
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

	template:_.template($('#tpl-wine-details').html()),
	
	render: function (eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}

});