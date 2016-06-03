// Saves options to chrome.storage.sync.
$(document).ready(function(){
  $('#connection').click(function(){
    $('#options').slideToggle();
  });
  $('#calls').click(function(){
    $('#calls_history').slideToggle();
  });
});
function save_options() {
  var telnethost = document.getElementById('telnethost').value;
  var telnetport = document.getElementById('telnetport').value;
  var pluginhost = document.getElementById('pluginhost').value;
  var pluginport = document.getElementById('pluginport').value;
  var telnetuser = document.getElementById('telnetuser').value;
  var telnetsecret = document.getElementById('telnetsecret').value;
  var agentnumber = document.getElementById('agentnumber').value;

  var dbhost = document.getElementById('dbhost').value;
  var dbuser = document.getElementById('dbuser').value;
  var dbsecret = document.getElementById('dbsecret').value;
  var dbname = document.getElementById('dbname').value;
  var dbport = document.getElementById('dbport').value;

  var abill = document.getElementById('abill').value;
  var ubill = document.getElementById('ubill').value;
  
  chrome.storage.sync.set({
    telnethost: telnethost,
    telnetport: telnetport,
    pluginhost: pluginhost,
    pluginport: pluginport,
    telnetuser: telnetuser,
    telnetsecret: telnetsecret,
    agentnumber: agentnumber,

    dbhost: dbhost,
    dbuser: dbuser,
    dbsecret: dbsecret,
    dbname: dbname,
    dbport: dbport,

    abill: abill,
    ubill: ubill,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
      connection_status();
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
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
    dbname: '',
    dbport: '',

    abill: '',
    ubill: '',
  }, function(items) {
    document.getElementById('telnethost').value = items.telnethost;
    document.getElementById('telnetport').value = items.telnetport;
    document.getElementById('pluginhost').value = items.pluginhost;
    document.getElementById('pluginport').value = items.pluginport;
    document.getElementById('telnetuser').value = items.telnetuser;
    document.getElementById('telnetsecret').value = items.telnetsecret;
    document.getElementById('agentnumber').value = items.agentnumber;

    document.getElementById('dbhost').value = items.dbhost;
    document.getElementById('dbuser').value = items.dbuser;
    document.getElementById('dbsecret').value = items.dbsecret;
    document.getElementById('dbname').value = items.dbname;
    document.getElementById('dbport').value = items.dbport;

    document.getElementById('abill').value = items.abill;
    document.getElementById('ubill').value = items.ubill;
  });
}
function connection_status(){
  chrome.storage.local.get({
    cstatus:'Disconnected'
  }, function(items) {
    document.getElementById('cstatus').textContent = items.cstatus;
    if(items.cstatus == 'Connected'){
      document.getElementById('cstatus').className = "connected";
      console.log(items.cstatus);
    } else {
      document.getElementById('cstatus').className = "";
      console.log(items.cstatus);
    }
  });
}

function calls_history(){
  chrome.storage.local.get({
    calls_array:[]
  }, function(local_items) {
    document.getElementById('count_calls').textContent = local_items.calls_array.length;
    
    chrome.storage.sync.get({
      abill: '',
    }, function(sync_items) {
      var calls_history_html = '';

      local_items.calls_array.forEach(function(item, i, arr) {
        if (item.unknown_user){
          calls_history_html += '<div class="call_row">'+
                                item.user_phone+' / '+item.call_time
                                '</div>';
        } else {
          calls_history_html += '<div class="call_row">'+
                                item.user_phone+' / '+item.call_time+' / '+item.user_id+' / '+item.user_fio+' / <a href="'+sync_items.abill+'">Abills</a>'+
                                '</div>';
        }
      });
      document.getElementById('calls_history').innerHTML = calls_history_html;
    });
    
  });
}

chrome.storage.onChanged.addListener(function (changes,areaName){
      if(areaName == 'local'){
        if (changes.cstatus){
          connection_status();
        }
      }
    });

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', connection_status);
document.addEventListener('DOMContentLoaded', calls_history);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('save').addEventListener('click',
    connection_status);
