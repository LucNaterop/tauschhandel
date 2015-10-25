isLoggedIn = function() {
    if (!Meteor.user()) {
        // user is not logged in, so let's show login popup
        alert('You must login before performing this action.');
        return false;
    } else return true;
}

if (Meteor.isCordova) {
  document.addEventListener("deviceready", function() {
    StatusBar.overlaysWebView(true);
    StatusBar.styleLightContent();
  }, false);
}

Meteor.startup(function(){
	Session.set('filter', {'tags': ['alleTags']});
  if(Meteor.isClient) {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '453508028170763',
        status     : true,
        version    : 'v2.5',
        xfbml      : true
      });
    };
  }
});

updateBadge = function(){
  var badgeCount = Notifications.find({'readAt': null}).count();
  var conversations = Conversations.find().fetch();
  conversations.forEach(function(conversation){
    conversation.messages.forEach(function(message){
      if(message.to == Meteor.user()._id && !message.readAt){
        badgeCount++;
      }
    });
  });
  var profile = Users.findOne(Meteor.userId()).profile;
  profile.badgeCount = badgeCount;
  Users.update({'_id': Meteor.userId()}, {$set: {'profile': profile}});
  Push.setBadge(badgeCount);
};

getImgurPicture = function(callback){
  // takes a picture, loads it to imgur, and calls callback with imgur id as argument
    MeteorCamera.getPicture(function(error, localData){
        options = {
            apiKey: '9c96a9ec19cc485',
            image: localData,
        }
        if(localData){
            console.log('retain...');
            IonBackdrop.retain();
            IonLoading.show();
        }
        Imgur.upload(options, function(error, remoteData){
            if(error){
                alert(error);
                IonBackdrop.release();
                IonLoading.hide();

            } else{
                console.log('release');
                IonBackdrop.release();
                IonLoading.hide();
                callback(remoteData.id);
            }
        });
    });
}


