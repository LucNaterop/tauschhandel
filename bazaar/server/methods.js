Meteor.methods({
	'changeUsername': function (id, username) {
		Users.update({'_id': id},{$set: {'username': username}});
	},
	'pushTest': function(){
		console.log('performing push test...');
		Push.send({from: 'push',title: 'Congratulations',text: 'Push Test!!!!!', badge: 1, query: {}});	
		console.log('send function called');
	},
	'pushFromNotification': function(notification){
		var profile = Users.findOne(notification.receiver).profile;
		var badge = profile.badgeCount + 1;
		Push.send({
			from: 'push',
			title: notification.postTitle, 
			text: notification.message + ' ' + notification.postTitle, 
			badge: badge, 
			query: {'userId': notification.receiver}
		});	
		profile.badgeCount = badge;
		Users.update({'_id': notification.receiver}, {$set: {'profile': profile}});
	}, 
	'pushFromItemGewonnen': function(userId, message){
		var profile = Users.findOne(userId).profile;
		var badge = profile.badgeCount + 1;
		Push.send({
			from: 'push',
			title: 'Item gewonnen', 
			text: message, 
			badge: badge, 
			query: {'userId': userId}
		});	
		profile.badgeCount = badge;
		Users.update({'_id': userId}, {$set: {'profile': profile}});
	},
	'pushFromMessage': function(message){
		var profile = Users.findOne(message.to).profile;
		var badge = profile.badgeCount + 1;
		var sender = Users.findOne(message.from).username;
		Push.send({
			from: 'push',
			title: 'Neue Nachricht von ' + sender,
			text:  'Nachricht von ' + sender + " : " + message.message,
			badge: badge, 
			query: {'userId': message.to}
		});	

		profile.badgeCount = badge;
		Users.update({'_id': message.to}, {$set: {'profile': profile}});
	},
	'getUmgebung': function(plz){
		plz = plz/1.0;
		// returns Umgebung of given plz
		return Gemeinden.findOne({'plz': plz}).umgebung;
	},
	'getOrt': function(plz){
		plz = plz/1.0;
		return Gemeinden.findOne({'plz': plz}).ORT;
	},
	'reportSpam': function(id, userId){
		Reported.insert({
			'id': id,
			'reportedAt': new Date(),
			'fromUser': userId,
		});
	    Email.send({
	      to: 'basaarschweiz@gmail.com',
	      subject: 'Spam wurde gemeldet',
	      text: 'Post: \n http://46.101.207.204/post/'+id + " \n\n Gemeldet von user\n http://basaar.ch/user/"+userId,
	    });
	},
	'getStats': function(){
		var stats = {
			'users': Users.find().count(),
			'posts': Posts.find().count()
		}
		return stats;
	}
});