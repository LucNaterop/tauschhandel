Session.set('imageIDs', []);

Template.home.helpers({
    'nothingHereYet': function(){
        var tags = Session.get('filter').tags;
        if($.inArray('alleTags', tags) >= 0){
            return Posts.find().count() == 0;
        } else {
            return Posts.find({'tags': {$in: tags}}).count() == 0;
        }    
    }
});

Template.home.rendered = function(){
    Session.set('previewMode', true);
}

Template.previewList.helpers({
    'posts': function() {
        var tags = Session.get('filter').tags;
        if($.inArray('alleTags', tags) >= 0){
            return Posts.find().fetch();
        } else {
            return Posts.find({'tags': {$in: tags}}).fetch();
        }
    }
});
Template.previewList.events({
    'click .post': function() {
        Router.go('/p/' + this._id);
    },
});
Template.createPost.helpers({
    'possibleTags': function() {
        return Tags.find({}).fetch();
    },
    'imageIDs': function(){
        return Session.get('imageIDs');
    }
});

Template.createPost.events({
    'click #submitButton': function() {
        if($('#titel').val().length < 3){
            alert('Titel zu kurz.');
            return;
        }
        checkboxes = document.getElementsByClassName('tag');
        tags = [];
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                tags.push(checkboxes[i].id);
            }
        }
        var newPost = {
            title:          $('#titel').val(),
            text:           $('#text').val(),
            postleitzahl:   Meteor.user().profile.postleitzahl,
            istAngebot:     true,
            imageIDs:       Session.get('imageIDs'),
            tags:           tags,
            userID:         Meteor.user()._id,
            userName:       Meteor.user().username,
            createdAt:      new Date(),
            viewCount:      0,
            discussion:     [],
            interessenten:  [],
            vergebenAn:     '',
            vergebenAnName: ''
        }
        Posts.insert(newPost);

        Session.set('imageIDs', []);
        IonModal.close();
    },
    'click #imageUpload': function(event){
        event.preventDefault();
        MeteorCamera.getPicture(function(error, localData){
            var options = {
                apiKey: '9c96a9ec19cc485',
                image: localData,
            }
            Imgur.upload(options, function(error, remoteData){
                if(error){
                    alert(error);
                }
                var image = $('#image');
                var ids = Session.get('imageIDs');
                ids.push(remoteData.id);
                Session.set('imageIDs', ids);
            });

        });
    }

});


Template.filterModal.helpers({
    'possibleTags': function() {
        return Tags.find({}).fetch();
    }
});

Template.filterModal.events({
    'click .tag': function(event, template){

        var divs = $('.tag');
        tags = [];
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].firstElementChild.firstElementChild.checked) {
                tags.push(divs[i].id);
            }
        }
        var filter = Session.get('filter');
        filter.tags = tags;
        Session.set('filter',filter);
        Meteor.setTimeout(function() {
            IonModal.close();
        }, 300);
    },
    
    'click .label': function(event, template){
        alert('gotcha');
    }
});

Template.filterModal.rendered = function(){
    Meteor.setTimeout(function() {
        var tags = Session.get('filter').tags;
        var divs = $('.tag');
        for (var i = 0; i < divs.length; i++) {
            if ($.inArray(divs[i].id, tags) >= 0) {
                divs[i].firstElementChild.firstElementChild.checked = true;
            }
        }
    }, 500);
}

