App = Ember.Application.create();

App.Router.map(function() {
	this.resource('compose');
});

App.ApplicationController = Ember.Controller.extend({
	user: null,

	actions: {
		login: function () {
			this.set('user', { name: this.login });
			this.set('login', '');
			this.set('password', '');
		},

		logout: function () {
			this.set('user', null);
			this.transitionToRoute('index');
		}
	}
});

App.IndexController = Ember.Controller.extend({
	posts: [
		{
			title: 'How to change the world for the better?',
			body: 'Lorem ipsum philantropy...',
			author: {
				name: 'Guilherme Vieira',
				email_uri: 'mailto:super.driver.512@gmail.com'
			},
			date: '01/01/1970'
		}
	]
});

App.ComposeController = Ember.Controller.extend({
	needs: ['index', 'application'],

	actions: {
		willTransition: function () {
			this.set('title', '');
			this.set('body', '');
		},

		publish: function () {
			var user = this.get('controllers.application.user');

			this.get('controllers.index.posts').unshift({
				title: this.title,
				body: this.body,

				author: {
					name: user.name,
					email_uri: user.email_uri
				},

				date: new Date().toDateString()
			});

			this.set('title', '');
			this.set('body', '');

			this.transitionToRoute('index');
		}
	}
});

