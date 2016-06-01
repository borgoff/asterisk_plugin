
var notifications = {};
var calls = {};
var calls_array = [];
var options = {};
var socket_io = {};
chrome.storage.local.clear();

function new_connect(){
    console.log(options);

    socket_io = io('http://'+options.pluginhost, {
        query: "telnethost="+options.telnethost+"&telnetport="+options.telnetport+"&telnetuser="+options.telnetuser+"&telnetsecret="+options.telnetsecret+"&agentnumber="+options.agentnumber+"&dbhost="+options.dbhost+"&dbuser="+options.dbuser+"&dbsecret="+options.dbsecret+"&dbport="+options.dbport+"&dbname="+options.dbname,
        reconnection: false
    });

    socket_io.on('no_options',function(data){
        chrome.browserAction.setIcon({path: 'red_icon.png'});
        chrome.storage.local.set({cstatus:'All options are required'});
        socket_io.emit('disconnect_this');
    });

    socket_io.on('connected',function(data){
        chrome.browserAction.setIcon({path: 'green_icon.png'});
        console.log(data.current_socket_id);
        chrome.storage.local.set({cstatus:'Connected'});

    });

    socket_io.on('error_connect',function(data){
        chrome.browserAction.setIcon({path: 'red_icon.png'});
        chrome.storage.local.set({cstatus:data.msg});
        socket_io.emit('disconnect_this');
    });

    socket_io.on('message',function(data){
        calls_array.push(data);
        calls['calls_array'] = calls_array;
        chrome.storage.local.set(calls);
        console.log(calls);
    });

}

chrome.storage.sync.get({
    telnethost:'',
    telnetport:'',
    pluginhost:'',
    telnetuser:'',
    telnetsecret:'',
    agentnumber:'',

    dbhost: '',
    dbuser: '',
    dbsecret: '',
    dbport: '',
    dbname: '',

    abill: '',
    ubill: '',
  }, function(items) {
    options['telnethost'] = items.telnethost;
    options['telnetport'] = items.telnetport;
    options['pluginhost'] = items.pluginhost+':3333';
    options['telnetuser'] = items.telnetuser;
    options['telnetsecret'] = items.telnetsecret;
    options['agentnumber'] = items.agentnumber;

    options['dbhost'] = items.dbhost;
    options['dbuser'] = items.dbuser;
    options['dbsecret'] = items.dbsecret;
    options['dbport'] = items.dbport;
    options['dbname'] = items.dbname;

    options['abill'] = items.abill;
    options['ubill'] = items.ubill;

    new_connect();
});



chrome.storage.onChanged.addListener(function (changes,areaName){
    	if(areaName == 'sync'){
    		if (changes.pluginhost || changes.telnethost || changes.telnetport || changes.telnetuser || changes.telnetsecret || changes.agentnumber || changes.dbhost || changes.dbuser || changes.dbsecret || changes.dbport || changes.dbname){
    			socket_io.emit('disconnect_this');
                for(var key in changes){
                    options[key] = changes[key].newValue;
                }
                new_connect();
    		}
    	}
    });











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