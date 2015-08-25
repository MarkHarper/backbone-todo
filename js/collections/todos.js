app.Todos = Backbone.Collection.extend({
	
	model: app.Todo,
	
	localstorage: new Backbone.LocalStorage('todos-backbone'),
	
	completed: function () {
		this.filter(function (todo) {
			return todo.get('completed');
		});	
	},
	
	remaining: function () {
		this.without.apply(this, this.completed());
	},
	
	nextOrder: function () {
		if (!this.length) {
			return 1;	
		}	
		return this.last().get('order') + 1;
	},
	
	comparator: function (todo) {
		return todo.get('order');
	}

});

app.todos = new app.Todos;