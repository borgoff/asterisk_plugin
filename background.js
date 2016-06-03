
var notifications = {};
var calls = {};
var calls_array = [];
var options = {};
var socket_io = {};
var myAudio = new Audio();
myAudio.src = "concise.mp3";

chrome.storage.local.clear();

function new_connect(){

    socket_io = io('http://'+options.pluginhost+':'+options.pluginport, {
        query: "telnethost="+options.telnethost+"&telnetport="+options.telnetport+"&telnetuser="+options.telnetuser+"&telnetsecret="+options.telnetsecret+"&agentnumber="+options.agentnumber+"&dbhost="+options.dbhost+"&dbuser="+options.dbuser+"&dbsecret="+options.dbsecret+"&dbport="+options.dbport+"&dbname="+options.dbname,
        reconnection: false
    });

    socket_io.on('no_options',function(data){
        chrome.browserAction.setIcon({path: 'red_icon.png'});
        chrome.storage.local.set({cstatus:'All options are required'});
        chrome.browserAction.setBadgeBackgroundColor({color: "#ff0000"});
        socket_io.emit('disconnect_this');
    });

    socket_io.on('connected',function(data){
        chrome.browserAction.setIcon({path: 'green_icon.png'});
        console.log(data.current_socket_id);
        chrome.storage.local.set({cstatus:'Connected'});
        chrome.browserAction.setBadgeBackgroundColor({color: "#00ff00"});
    });

    socket_io.on('error_connect',function(data){
        chrome.browserAction.setIcon({path: 'red_icon.png'});
        chrome.storage.local.set({cstatus:data.msg});
        chrome.browserAction.setBadgeBackgroundColor({color: "#ff0000"});
        socket_io.emit('disconnect_this');
    });

    socket_io.on('remove_message',function(data){
        console.log('remove notification id - '+data.uniqueid);
        var not_id = ""+data.uniqueid;
        chrome.notifications.clear(not_id, function() {
            delete notifications[not_id];
        });
    });

    socket_io.on('message',function(data){
        console.log('new notification id - '+data.uniqueid);
        var now = new Date();
        var pretty = now.getHours()+":"+(now.getMinutes()<10?'0':'') + now.getMinutes()+":"+now.getSeconds();

        data['call_time'] = pretty;
        calls_array.push(data);
        chrome.browserAction.setBadgeText({text: ""+calls_array.length+""});
        calls['calls_array'] = calls_array;
        chrome.storage.local.set(calls);

        var first_button_url = '';
        var second_button_url = '';
        var notification_items = [];
        if (data.unknown_user){
            notification_items = [
                                    {title: "Вхідний номер", message: data.user_phone},
                                    {title: "Абонент", message: "Відсутній в базі"}
                                ];
            first_button_url = options.abill+"/admin";
            second_button_url = options.ubill;
        } else {
            notification_items = [
                                    {title: "Вхідний номер", message: ": "+data.user_phone},
                                    {title: "Абонент", message: ": "+data.user_id+" П.І.Б.: "+data.user_fio},
                                    /*{title: "П.І.Б.", message: ": "+data.user_fio},*/
                                    /*{title: "Депозит", message: ": "+data.user_deposit},
                                    {title: "Кредит", message: ": "+data.user_credit},*/
                                    {title: "Тариф", message: ": "+data.user_plan_name+" Депозит: "+data.user_deposit+" Кредит: "+data.user_credit+" Група: "+data.user_group_name},
                                    /*{title: "Група", message: ": "+data.user_group_name},*/
                                    {title: "Адреса", message: ": "+data.user_district_name+", "+data.user_street_name+" "+data.user_bild_number+"/"+data.user_flat_number}
                                    /*{title: "Район", message: ": "+data.user_district_name},
                                    {title: "Вулиця", message: ": "+data.user_street_name},
                                    {title: "Будинок", message: ": "+data.user_bild_number},
                                    {title: "Квартира", message: ": "+data.user_flat_number}*/
                                ];
            first_button_url = options.abill+'/admin/index.cgi?index=15&UID='+data.user_id;
            second_button_url = options.ubill+'/oper/abon_list.php?type=find&search='+data.user_id+'&find_typer=abon_codeti&accurat=1';
        }

        var not_id = ""+data.uniqueid;
        chrome.notifications.create(not_id,{
            type: "list",
            title: "Новий дзвінок",
            iconUrl: "icon_120.png",
            message: "",
            requireInteraction:true,
            buttons: [{ title: "Abills", iconUrl: "red_icon.png"},
                        { title: "Userside", iconUrl: "green_icon.png"}],
            items: notification_items

        }, function(notifId) {
            notifications[notifId] = [first_button_url, second_button_url];
            myAudio.play();    
        });
    });

}

chrome.storage.sync.get({
    telnethost:'',
    telnetport:'',
    pluginhost:'',
    pluginport:'',
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
    options['pluginhost'] = items.pluginhost;
    options['pluginport'] = items.pluginport;
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
    		if (changes.pluginport || changes.pluginhost || changes.telnethost || changes.telnetport || changes.telnetuser || changes.telnetsecret || changes.agentnumber || changes.dbhost || changes.dbuser || changes.dbsecret || changes.dbport || changes.dbname){
    			socket_io.emit('disconnect_this');
                for(var key in changes){
                    options[key] = changes[key].newValue;
                }
                new_connect();
    		}
    	}
    });


chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (typeof notifications[notifId] != 'undefined' ) {
        if (btnIdx === 0) {
            chrome.tabs.create({ url: notifications[notifId][0] });
        } else if (btnIdx === 1) {
            chrome.tabs.create({ url: notifications[notifId][1] });
        }
    }
});








/* Respond to the user's clicking one of the buttons */
/*chrome.notifications.onClicked.addListener(function(notifId, btnIdx) {
    var id = notifId.replace(/(-)/g, '');
    if (typeof notifications[id] != 'undefined' ) {
        chrome.tabs.create({ url: notifications[id] });
        chrome.notifications.clear(notifId, function() {
            delete notifications[id];
        });
        
    }
});*/




