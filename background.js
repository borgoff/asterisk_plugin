
var notifications = {};
var calls = {};
var calls_array = [];
var options = {};
var socket_io = {};
chrome.storage.local.clear();

var current_id = '1';

chrome.storage.sync.get({
    telnethost:'',
    telnetport:'',
    pluginhost:'',
    telnetuser:'',
    telnetsecret:'',
    agentnumber:''
  }, function(items) {
    options['telnethost'] = items.telnethost;
    options['telnetport'] = items.telnetport;
    options['pluginhost'] = items.pluginhost+':3333';
    options['telnetuser'] = items.telnetuser;
    options['telnetsecret'] = items.telnetsecret;
    options['agentnumber'] = items.agentnumber;
});
setTimeout(function(){
	console.log(options);	

	socket_io = io('http://'+options.pluginhost, {
        query: "telnethost="+options.telnethost+"&telnetport="+options.telnetport+"&telnetuser="+options.telnetuser+"&telnetsecret="+options.telnetsecret+"&agentnumber="+options.agentnumber,
    	reconnection: false
    });

    socket_io.on('connect_error',function(data){
    	chrome.storage.local.set({cstatus:'Connect Error'});
    });

    socket_io.on('connected',function(data){
    	current_id = data.current_socket_id;
    	chrome.storage.local.set({cstatus:'Connected'});
        
    });

    socket_io.on('error_asterisk_connect',function(data){
    	console.log(data);
    	if(data.ami_status){
    		chrome.storage.local.set({cstatus:'Connected'});
    	} else {
    		chrome.storage.local.set({cstatus:'Asterisk Error'});	
    	}
        
        
    });

    socket_io.on('message',function(data){
        calls_array.push(data);
        calls['calls_array'] = calls_array;
        chrome.storage.local.set(calls);
        console.log(calls);
    });

}, 3000);



/*function connect_with_options(current_socket_local_id){

	console.log(current_socket_local_id);*/

/*chrome.storage.sync.get({
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
    options['agentnumber'] = items.agentnumber;*/

    /*if(!options.pluginhost || !options.telnethost || !options.telnetport || !options.telnetuser || !options.telnetsecret || !options.agentnumber){    	
        chrome.storage.local.set({cstatus:'Set options'});
    	return false;
    }*/
    
    /*var socket_io = io('http://'+options.pluginhost, {
        query: "telnethost="+options.telnethost+"&telnetport="+options.telnetport+"&telnetuser="+options.telnetuser+"&telnetsecret="+options.telnetsecret+"&agentnumber="+options.agentnumber+"&current_socket_id="+current_socket_local_id,
    	reconnection: false
    });

    socket_io.on('connect_error',function(data){
    	chrome.storage.local.set({cstatus:'Connect Error'});
    });

    socket_io.on('connected',function(data){
    	current_id = data.current_socket_id;
    	chrome.storage.local.set({cstatus:'Connected'});
        
    });

    socket_io.on('error_asterisk_connect',function(data){
    	console.log(data);
    	if(data.ami_status){
    		chrome.storage.local.set({cstatus:'Connected'});
    	} else {
    		chrome.storage.local.set({cstatus:'Asterisk Error'});	
    	}
        
        
    });

    socket_io.on('message',function(data){
        calls_array.push(data);
        calls['calls_array'] = calls_array;
        chrome.storage.local.set(calls);
        console.log(calls);
    });*/
    
  /*});*/
/*}*/

/*connect_with_options(current_id);*/

chrome.storage.onChanged.addListener(function (changes,areaName){
    	if(areaName == 'sync'){
    		if (changes.pluginhost || changes.telnethost || changes.telnetport || changes.telnetuser || changes.telnetsecret || changes.agentnumber){
    			socket_io.close();
    			socket_io = io('http://'+changes.pluginhost, {
    		        query: "telnethost="+changes.telnethost+"&telnetport="+changes.telnetport+"&telnetuser="+changes.telnetuser+"&telnetsecret="+changes.telnetsecret+"&agentnumber="+changes.agentnumber,
    		    	reconnection: false
    		    });
    		}
    	}
    });



//chrome.browserAction.disable();

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