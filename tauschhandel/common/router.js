Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'home'});

Router.route('/myposts', {name: 'myposts'});

Router.route('/notifications', {name: 'notifications'});

Router.route('/profile', {name: 'profile'});


Router.route('/p/:postId', {
	name: 'detailView',
	data: function(){
		return Posts.findOne({_id: this.params.postId});
	}
});
