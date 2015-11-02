Session.set('imageIDs', []);

constructGemeindenArray = function(posts){
    var meineGemeinde = [{
        'plz': Meteor.user().profile.postleitzahl,
        'ORT': Meteor.user().profile.ORT,
        'distance': 0,
        'selected': true
    }];
    var gemeinden = meineGemeinde.concat(Meteor.user().profile.umgebung);
    gemeinden.forEach(function(gemeinde){
        gemeinde.posts = [];
        posts.forEach(function(post){
            if(gemeinde.plz == post.postleitzahl) gemeinde.posts.push(post);
        });
    });
    return gemeinden;
}

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
    'gemeinden': function() {
        var tags = Session.get('filter').tags;
        if($.inArray('alleTags', tags) >= 0){
            var posts = Posts.find({'vergebenAn': ''}, { sort: {'createdAt': -1} }).fetch();
            return constructGemeindenArray(posts);
        } else {
            var posts = Posts.find({'tags': {$in: tags}, 'vergebenAn': ''},{ sort: {'createdAt': -1} }).fetch();
            return constructGemeindenArray(posts);
        }
    },
    'filterNotAll': function(){
        if(Session.get('filter').tags[0] != 'alleTags'){
            return true;
        } else {
            return false;
        }
    },
    'filterTag': function(){
        return Session.get('filter').tags[0];
    }

});
Template.previewList.events({
    'click .greyClick': function(event) {
        e = event;
        $(event.currentTarget).css('background-color', '#E5E5E5');
    },
    'click #removeFilter': function(){
        Session.set('filter', {tags: ['alleTags']});
    }
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
        var checkboxes = document.getElementsByClassName('tag');
        var tags = [];
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
        getImgurPicture(function(id){
            var image = $('#image');
            var ids = Session.get('imageIDs');
            ids.push(id);
            Session.set('imageIDs', ids);
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

