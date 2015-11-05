
App.info({
  id: 'com.naterop.dorfbazaar',
  version: '0.10',
  name: 'DorfBazaar',
  description: 'lorem ipsum',
  author: 'Luca Naterop',
  email: 'luca@naterop.net',
  website: 'http://46.101.207.204'
});


App.icons({
  
  'iphone':     'resources/icons/ios/Icon.png',
  'iphone_2x':  'resources/icons/ios/Icon-60@2x.png',
  'ipad':       'resources/icons/ios/Icon-76.png',
  'ipad_2x':    'resources/icons/ios/Icon-76@2x.png',

  'android_ldpi': 'resources/icons/android/drawable-ldpi/ic_launcher.png',
  'android_mdpi': 'resources/icons/android/drawable-mdpi/ic_launcher.png',
  'android_hdpi': 'resources/icons/android/drawable-hdpi/ic_launcher.png',
  'android_xhdpi':'resources/icons/android/drawable-xhdpi/ic_launcher.png'
});


App.launchScreens({
  // iOS
  'iphone':               'resources/splash/ios/iphone_2x.png',
  'iphone_2x':            'resources/splash/ios/iphone_2x.png',
  'iphone5':              'resources/splash/ios/iphone5.png',
  'iphone6':              'resources/splash/ios/iphone6.png',
  'iphone6p_portrait':    'resources/splash/ios/iphone6p_portrait.png',
  'iphone6p_landscape':   'resources/splash/ios/iphone6p_landscape.png',
  'ipad_portrait':        'resources/splash/ios/ipad_portrait.png',
  'ipad_portrait_2x':     'resources/splash/ios/ipad_portrait_2x.png',
  'ipad_landscape':       'resources/splash/ios/ipad_landscape.png',
  'ipad_landscape_2x':    'resources/splash/ios/ipad_landscape_2x.png',
});


/*
App.accessRule('http://imgur.com/*');
App.accessRule('http://i.imgur.com/*');
App.accessRule('https://api.imgur.com/*');
App.accessRule('http://www.femto.it/wp-content/*');
*/
App.accessRule('*');

