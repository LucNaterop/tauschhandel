

Meteor.publish('allUsers', function() {
	return Users.find({},  {fields: {'username': 1, 'profile': 1}});
});

Meteor.publish('posts', function(postleitzahl){
	console.log(postleitzahl);
	return Posts.find({'postleitzahl': postleitzahl});
});

Meteor.publish('postdiscussions', function(){
	return PostDiscussions.find({published: true});
});

Meteor.publish('notifications', function(userID){
	return Notifications.find({ receiver: userID });
});

Meteor.publish('messages', function(){
	//TODO: do not publish all messages, but only if current user is sender or recipient
	return Messages.find({});
});

Meteor.publish('conversations', function(userID){
	//TODO: do not publish all messages, but only if current user is sender or recipient
	return Conversations.find({$or: [{creator: userID},{partner: userID}]});
});

Meteor.publish('tags', function(){
	return Tags.find({});
});

// TODO: publish adminShizzle database only to admins / mods


Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	user.profile.watchlist = [];
	user.profile.postleitzahl = null;
	user.profile.firstLogin = true;
	return user;
});
