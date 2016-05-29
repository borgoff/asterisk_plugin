
var notifications = {};
var calls = {};
var calls_array = [];


chrome.storage.local.clear();

chrome.storage.sync.get({
    telnethost:'',
    telnetport:'',
    pluginhost:'',
    telnetuser:'',
    telnetsecret:'',
    agentnumber:''
  }, function(items) {
    var options = {};
    options['telnethost'] = items.telnethost;
    options['telnetport'] = items.telnetport;
    options['pluginhost'] = items.pluginhost+':3333';
    options['telnetuser'] = items.telnetuser;
    options['telnetsecret'] = items.telnetsecret;
    options['agentnumber'] = items.agentnumber;

    var socket_io = io(options.pluginhost, {
        query: "telnethost="+options.telnethost+"&telnetport="+options.telnetport+"&telnetuser="+options.telnetuser+"&telnetsecret="+options.telnetsecret+"&agentnumber="+options.agentnumber
    });

    socket_io.on('connected',function(data){
        console.log('CONNECTED');
        
    });
    socket_io.on('disconnected',function(data){
        console.log('DISCONNECTED');
    });

    socket_io.on('message',function(data){
        calls_array.push(data);
        calls['array'] = calls_array;
        chrome.storage.local.set(calls);
        console.log(calls);
    });
    
  });




chrome.browserAction.disable();

/* Respond to the user's clicking one of the buttons */
chrome.notifications.onClicked.addListener(function(notifId, btnIdx) {
    var id = notifId.replace(/(-)/g, '');
    if (typeof notifications[id] != 'undefined' ) {
        chrome.tabs.create({ url: notifications[id] });
        chrome.notifications.clear(notifId, function() {
            delete notifications[id];
        });
        
    }
});


/*chrome.notifications.create({
    type: "basic",

    title: message_title, 
    message: v.cashback,
    isClickable:true,

    iconUrl: "icon_120.png",

}, function(notifId) {
    var id = notifId.replace(/(-)/g, '');
    notifications[id] = link;
});*/