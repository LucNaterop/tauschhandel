Template.posts.helpers({
	'posts': function(){
		return Posts.find({}).fetch();
	},
});

Template.posts.events({
	'click .post': function(){
		Router.go('/p/' + this._id);
	},
});

Template.createPost.helpers({
	'possibleTags': function(){
		return Tags.find({}).fetch();
	},
});

Template.createPost.events({
	'click #submitButton': function(){
		if(Meteor.user()){

			checkboxes = document.getElementsByClassName('tag');
			
			tags = [];
			for(var i=0; i<checkboxes.length; i++){
				if(checkboxes[i].checked){
					tags.push(checkboxes[i].id);
				}
			}

			var newPost = {
				title: 		$('#titel').val(),
				text: 		$('#text').val(),
				istAngebot: $('#istAngebot')[0].checked,
				tags: 		tags,
				userID: 	Meteor.user()._id,
				userEmail: 	Meteor.user().emails[0].address,	
				createdAt: 	new Date(),
				viewCount: 	0
			}

			Posts.insert(newPost);
		}
	}
});

