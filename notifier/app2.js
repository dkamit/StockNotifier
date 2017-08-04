const NotificationCenter = require('node-notifier').NotificationCenter;
const googleFinance = require('google-finance');
var notifier = new NotificationCenter({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative/Absolute path to binary if you want to use your own fork of terminal-notifier
});

//googleFinance.companyNews({
//  symbol: 'NSE:ALICON'
//}, function (err, news) {
//  console.log(news) 
//});

googleFinance.historical({
  symbol: 'NSE:ALICON',
  from: '2017-05-24',
  to: '2017-05-25'
}).then(function(quotes) {
  console.log(quotes)
});


notifier.notify({
  'title': "Title",
  'subtitle': "Sub Title",
  'message': "Message",
  'sound': true, // Case Sensitive string for location of sound file, or use one of macOS' native sounds (see below)
  'icon': '/Users/Amith/node/notifier/Amith.jpg', // Absolute Path to Triggering Icon
  //'contentImage': void 0, // Absolute Path to Attached Image (Content Image)
  //'open': void 0, // URL to open on Click
  'wait': false, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

  // New in latest version. See `example/macInput.js` for usage
  timeout: 500, // Takes precedence over wait if both are defined.
  closeLabel: "close", // String. Label for cancel button
  actions: "Actions here", // String | Array<String>. Action label or list of labels in case of dropdown
  dropdownLabel: "Dropdown here", // String. Label to be used if multiple actions
  reply: true // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
}, function(error, response, metadata) {
  //console.log(response, metadata);
});
