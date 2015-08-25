app.AppView = Backbone.View.extend({
	
	el: '#todo-app',
	
	statsTemplate: _.template($('#stats-template').html()),
	
	events: {
		'keypress #new': 'createOnEnter',
		'click #clear-completed': 'clearCompleted',
		'click #toggleAll': 'toggleAllComplete' 
	},
	
	initialize: function () {
		this.allCheckbox = $('#toggle-all');
		this.$input = $('#new');
		this.$footer = $('#footer');
		this.$main = $('#main');
		
		this.listenTo(app.Todos, 'add', this.addOne);
		this.listenTo(app.Todos, 'reset', this.addAll);
		this.listenTo(app.Todos, 'change:completed', this.filterOne);
		this.listenTo(app.Todos, 'filter', this.filterAll);
		this.listenTo(app.Todos, 'all', this.render);
		
		app.Todos.fetch();
	},
	
	render: function () {
		var remaining = app.Todos.remaining().length;
		var completed = app.Todos.completed().length;
		
		if (app.Todos.length) {
			this.$main.show();
			this.$footer.show();
			
			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));
		}
		else {
			this.$main.hide();
			this.$footer.hide();
		}
		this.allCheckbox.checked = !remaining;
	},
	
	addOne: function (todo) {
		var view = new TodoView ({model: todo});
		$('#todo-list').append(view.render().el);
	},
	
	addAll: function () {
		this.$('#todo-list').html('');
		app.Todos.each(this.addOne, this);
	},
	
	filterOne: function (todo) {
		todo.trigger('visible');
	},
	
	filterAll: function () {
		app.Todos.each(this.filterOne, this);
	},
	
	newAttributes: function () {
		return {
			title: this.$input.val().trim(),
			order: app.Todos.nextOrder(),
			completed: false
		}
	},
	
	createOnEnter: function (event) {
		if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
			return;
		}
		app.Todos.create(this.newAttributes());
		this.$input.val('');
	},
	
	clearCompleted: function () {
		_.invoke(app.Todos.completed(), 'destroy');
		return false;
	},
	
	toggleAllComplete: function () {
		var completed = this.allCheckbox.checked;
		app.Todos.each(function (todo) {
			todo.save({
				'completed': completed
			});
		});
	}
	
});