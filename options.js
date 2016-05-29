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
  var telnetuser = document.getElementById('telnetuser').value;
  var telnetsecret = document.getElementById('telnetsecret').value;
  var agentnumber = document.getElementById('agentnumber').value;
  
  chrome.storage.sync.set({
    telnethost: telnethost,
    telnetport: telnetport,
    pluginhost: pluginhost,
    telnetuser: telnetuser,
    telnetsecret: telnetsecret,
    agentnumber: agentnumber,
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
    telnetuser:'',
    telnetsecret:'',
    agentnumber:''
  }, function(items) {
    document.getElementById('telnethost').value = items.telnethost;
    document.getElementById('telnetport').value = items.telnetport;
    document.getElementById('pluginhost').value = items.pluginhost;
    document.getElementById('telnetuser').value = items.telnetuser;
    document.getElementById('telnetsecret').value = items.telnetsecret;
    document.getElementById('agentnumber').value = items.agentnumber;
  });
}
function connection_status(){
  chrome.storage.local.get({
    cstatus:'Disconnected'
  }, function(items) {
    document.getElementById('cstatus').textContent = items.cstatus;
  });
}

function calls_history(){
  chrome.storage.local.get({
    calls_array:[]
  }, function(items) {
    console.log(items.calls_array);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', connection_status);
document.addEventListener('DOMContentLoaded', calls_history);
document.getElementById('save').addEventListener('click',
    save_options);

