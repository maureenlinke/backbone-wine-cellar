// Models
window.Wine = Backbone.Model.extend({
    urlRoot:"../api/wines",
    defaults:{
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

window.WineCollection = Backbone.Collection.extend({
    model:Wine,
    url:"api/wines"
});


// Views
window.WineListView = Backbone.View.extend({

    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (wine) {
            $(self.el).append(new WineListItemView({model:wine}).render().el);
        });
    },

    render:function (eventName) {
        _.each(this.model.models, function (wine) {
            $(this.el).append(new WineListItemView({model:wine}).render().el);
        }, this);
        return this;
    }
});

//The render function then merges the data into the WineListItem template or html element (ref. in index.html)
window.WineListItemView = Backbone.View.extend({

	tagName:"li",

    template:_.template($('#tpl-wine-list-item').html()),

	initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

	render:function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	},

	close:function() {
	$(this.el).unbind();
        $(this.el).remove();
    }
});

//View that displays wine details in wine form. Render merges the model data (from WineListView view) (specific wine) into wine details tempalte (ref. in index.html)

window.WineView = Backbone.View.extend({

	template:_.template($('#tpl-wine-details').html()),  //creates html element

initialize:function () {
	this.model.bind("change", this.render, this);
	},
	
  render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

	events:{
        "change input":"change",
        "click .save":"saveWine",
        "click .delete":"deleteWine"
    },

change:function (event) {
	var target = event.target;
	console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);

},
    saveWine:function () {
        this.model.set({
            name:$('#name').val(),
            grapes:$('#grapes').val(),
            country:$('#country').val(),
            region:$('#region').val(),
            year:$('#year').val(),
            description:$('#description').val()
        });
  if (this.model.isNew()) {
            app.wineList.create(this.model);
        } else {
            this.model.save();
        }
        return false;
    },


//when a wine is deleted, you want the list item to be removed automatically. Bind view destroy to event and run close function.
deleteWine:function () {
        this.model.destroy({
            success:function () {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

close:function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});

window.HeaderView = Backbone.View.extend({

    template:_.template($('#tpl-header').html()),

    initialize:function () {
        this.render();
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events:{
        "click .new":"newWine"
    },

    newWine:function (event) {
        if (app.wineView) app.wineView.close();
        app.wineView = new WineView({model:new Wine()});
        $('#content').html(app.wineView.render().el);
        return false;
    }
});
//Router

//Provides the entry points for the application through a set of (deep-linkable) URLs.Default route (“”) displays the list of wine. The “wines/:id” route displays the details of a specific wine in the wine form. 

var AppRouter = Backbone.Router.extend({
    routes:{
        "":"list",
        "wines/:id":"wineDetails"
    },

    initialize:function () {
        $('#header').html(new HeaderView().render().el);
    },
    list:function () {
        this.wineList = new WineCollection();
        this.wineListView = new WineListView({model:this.wineList});
        this.wineList.fetch();
        $('#sidebar').html(this.wineListView.render().el);
    },
	wineDetails:function (id) {
        this.wine = this.wineList.get(id);
        if (app.wineView) app.wineView.close();
        this.wineView = new WineView({model:this.wine});
        $('#content').html(this.wineView.render().el);
    }

});

var app = new AppRouter();
Backbone.history.start();

