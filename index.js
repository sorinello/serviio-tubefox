var tabs      = require("sdk/tabs")
var data      = require('sdk/self').data
var clipboard = require('sdk/clipboard')
var pageMod   = require("sdk/page-mod")

pageMod.PageMod({
  include: "*.youtube.com",
  contentScriptFile: [
            data.url('jquery-2.2.0.min.js'),
            data.url('content-script.js')],
  contentScriptWhen: 'end',
  onAttach: function(worker) {
    worker.port.emit('init')
    worker.port.on('copyToClipboard', function(serviioURL){
    //console.log('index.js - copyToClipboard - Received URL', serviioURL)
    clipboard.set(serviioURL)
    });

  }
});

tabs.open('https://www.youtube.com/user/catmusicoffice/videos')
tabs.open('https://www.youtube.com/playlist?list=PLCzQ2UHQfewRpVrmLIEy_Dh98sEU2x0o6')
tabs.open('https://www.youtube.com/user/erlazantivirus/videos')
tabs.open('https://www.youtube.com/channel/UCEY2CNlzLkUedfuPAiPpEKg/videos')
