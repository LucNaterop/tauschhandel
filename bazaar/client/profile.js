Template.profile.helpers({
	'profile': function(){
		return Meteor.user().profile;
	}
});

Template.profile.events({
    'click #changeUsername': function(){
        IonPopup.prompt({
            title: 'Username ändern',
            template: 'Bitte einen neuen Username eingeben',
            okText: 'Ok',
            inputType: 'text',
            inputPlaceholder: 'Username',
            onOk: function(event) {
                var newUsername = $('input').val();
                if(newUsername.length < 3) {
                    alert('Eingabe zu kurz. Konnte nicht gespeichert werden.');
                } else {
                    Meteor.call('changeUsername', Meteor.userId(), newUsername, function(error){
                        if(error){
                            //handle error
                        } else {
                            alert('gespeichert');
                        }
                    });
                }
            },
            onCancel: function() {
            }
        });
    },
    'click #changePostleitzahl': function(){
        lucPopup('Dieses Feature ist in dieser Version noch nicht verfügbar. Falls die Postleitzahl geändert werden muss, sollte ein neuer Account erstellt werden.');
        IonPopup.confirm({
            title: 'Postleitzahl ändern',
            template: 'Wenn du deine Postleitzahl änderst, dann wirst du keine Angebote mehr sehen, die sich an Orten ausserhalb deiner neuen Umgebung befinden. Bist du sicher, dass du die Postleitzahl ändern möchtest?',
            okText: 'Ja',
            cancelText: 'Abbrechen',
            onOk: function() {
                Router.go('/firstLogin2');
            },
            onCancel: function() {
            }
        });
    },
	'click #changeProfilePicture': function(event){
		event.preventDefault();
        changeProfilePicture();
	},
    'click #logout': function(event){
        IonPopup.confirm({
            title: 'Abmelden',
            template: 'Bist du sicher, dass du dich abmelden möchtest?',
            onOk: function() {
                Meteor.logout(function(){
                    Router.go('/');
                });
            },
            onCancel: function() {

            }
        });
    }
});

changeProfilePicture = function(){
    // takes photo and saves it in user profile. Handles backdrop as well. 
    getImgurPicture(function(id){
        var link = "http://i.imgur.com/" + id + "b.jpg";
        Users.update({_id: Meteor.user()._id}, { $set: { 'profile.picture': link} });
    });
};

Template.profile.rendered = function(){
    Session.set('hideTabs', true);
};
Template.profile.destroyed = function(){
    Session.set('hideTabs', false);
};

Template.changePLZ.events({
    'click #save': function(){
        IonBackdrop.retain();
        var checkboxes = document.getElementsByClassName('tag');
        var umgebung = Meteor.user().profile.umgebung;
        for (var i = 0; i < checkboxes.length; i++) {
            for(var j=0; j < umgebung.length; j++){
                if(checkboxes[i].id == umgebung[j].plz){
                    umgebung[j].selected = checkboxes[i].checked;
                }
            }
        }
        Meteor.setTimeout(function(){
            Router.go('/profile');
            IonBackdrop.release();
            Users.update({'_id': Meteor.userId()},{$set: {'profile.umgebung': umgebung}});
        }, 500);
    }
});

Template.changeRadius.rendered = function(){
    var radius = Meteor.user().profile.radius;
    $('#radius').val(radius);
    $('#radiusLabel').html(radius + ' km');
}

Template.changeRadius.events({
    'change #radius': function(){
        var radius = $('#radius').val();
        $('#radiusLabel').html(radius + ' km');
    },
    'click #save': function(){
        var radius = $('#radius').val();
        console.log('new radius: ' + radius);
        setRadius(radius);
    }
});

Template.login.rendered = function(){
    var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
    var browser = !Meteor.isCordova;
    var isAndroid = !(iOS || browser);
    if(isAndroid){
        Meteor.setInterval(function(){
            $('.at-oauth').remove();
            $('.at-sep').remove();
        }, 100);
    }
    Session.set('hideTabs', true);
}

Template.login.destroyed = function(){
    Session.set('hideTabs', false);
};

setRadius = function(radius){
    // sets new radius [in km] in profile of current user 
    IonBackdrop.retain();
    Users.update(Meteor.userId(), {$set: {'profile.radius': radius }});
    IonBackdrop.release();
    IonModal.close();
    lucPopup('Gespeichert!');
};