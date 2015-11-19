Template.conversations.helpers({
    'konversationen': function() {
        var conversations = Conversations.find({}, { sort: {'createdAt': 1} }).fetch();
        conversations.sort(function(c1, c2){
            return c2.changedAt - c1.changedAt;
        });
        conversations.forEach(function(conversation){
            // figure out which name to show (other person than currently logged in person)
            var person1 = Users.findOne(conversation.creator);
            var person2 = Users.findOne(conversation.partner);
            var post = Posts.findOne(conversation.postID);

            if(Meteor.user()._id == person1._id){
                conversation.other = person2; 
            } else{
                conversation.other = person1;
            }
            conversation.post = post;

            // attach badgeCount to counversation
            var badgeCount = 0;
            conversation.messages.forEach(function(message){
                if(!message.readAt && message.to == Meteor.user()._id){
                    badgeCount++;
                }
            })
            conversation.badgeCount = badgeCount;
            conversation.moreThanZero = badgeCount > 0;
        });
        return conversations;
    },
    'moreThanZero': function(){
        return Conversations.find({}).count() > 0;
    }
});

Template.conversationListItem.events({
    'click .conversation': function(event, template){
        var conversationID = template.data._id;
        var messages = Conversations.findOne(conversationID).messages;
        messages.forEach(function(message){
            if(message.to == Meteor.userId() && !message.readAt){
                message.readAt = new Date();
            }
        });
        Conversations.update({'_id': conversationID},{$set: {'messages': messages}})
    },
    'click .greyClick': function(event) {
        e = event;
        $(event.currentTarget).css('background-color', '#E5E5E5');
    }
});

Template.conversations.rendered = function(){
    $('.tab-item').get(3).click();
}

Template.conversation.helpers({
    'conversation': function(){
        var conversation = Conversations.findOne(Router.current().params._id);
        // figure out which name to show (other person than currently logged in person)
        if(conversation){
            var person1 = Users.findOne(conversation.creator);
            var person2 = Users.findOne(conversation.partner);
            var post = Posts.findOne(conversation.postID);

            if(Meteor.user()._id == person1._id){
                conversation.other = person2; 
            } else{
                conversation.other = person1;
            }
            conversation.post = post;

            conversation.messages.forEach(function(message){
                if(message.from == Meteor.user()._id){
                    message.fromMe = true;
                } else {
                    message.fromMe = false;
                }
                var length = message.message.length;
                message.margin = Math.min(40,100*Math.exp(-1*length/50));        // exponential model
                message.margin = Math.max(6, message.margin);                   // delimited by 10, 60
                message.dateString = new Date(message.createdAt).toDateString();
            });
            return conversation;
        }
    }
});

Template.conversation.events({
    'click #writeMessageButton': function(){
        if($('#message').val().length >= 1){
            var conversation = Conversations.findOne(Router.current().params._id);
            if(Meteor.user()._id == conversation.creator){
                var other = conversation.partner;
            } else {
                var other = conversation.creator;
            }
            var message = {
                from:       Meteor.user()._id,
                to:         other, 
                message:    $('#message').val(),
                createdAt:  new Date(),
                readAt:     null,
            }
            Conversations.update({'_id': conversation._id}, {$push: {messages: message}});
            Conversations.update({'_id': conversation._id}, {$set: {'changedAt': new Date()}});
            Meteor.call('pushFromMessage', message);
            $('#message').val('');
        }
    }
});

Template.conversation.rendered = function(){
    Session.set('currentID', Router.current().params._id);
    Session.set('hideTabs', true);
    
    $('#moreButton').on('click', function(){
            var conversation = Conversations.findOne(Router.current().params._id);
            // figure out which name to show (other person than currently logged in person)
            if(conversation){
                var person1 = Users.findOne(conversation.creator);
                var person2 = Users.findOne(conversation.partner);
                var post = Posts.findOne(conversation.postID);

                if(Meteor.user()._id == person1._id){
                    conversation.other = person2; 
                } else{
                    conversation.other = person1;
                }
            }
          IonActionSheet.show({
              titleText: 'Picture',
              buttons: [
                  { text: '<i class="icon ion-person"></i> Profil von ' + conversation.other.username },
                  { text: '<i class="icon ion-forward"></i> Als übergeben markieren' },
              ],
              cancelText: 'Cancel',
              cancel: function() {
              },
              buttonClicked: function(index) {
                if (index === 0) { 
                    Router.go('/user/' + conversation.other._id);
                    return true;
                } else {

                }  
              }
          });
    });
}

Template.conversation.destroyed = function(){
    var id = Session.get('currentID');
    var messages = Conversations.findOne(id).messages;
    messages.forEach(function(message){
        if(!message.readAt) {
            message.readAt = new Date();
        }
    });
    Conversations.update({'_id': id}, {$set: {'messages': messages }});
    Session.set('hideTabs', false);
    updateBadge();
}


