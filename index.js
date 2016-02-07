var tabs = require("sdk/tabs")
var data = require('sdk/self').data
var clipboard = require('sdk/clipboard')
var pageMod = require("sdk/page-mod")
var Request = require("sdk/request").Request;
var preferences = require('sdk/simple-prefs').prefs;


pageMod.PageMod({
  include: "*.youtube.com",
  contentScriptFile: [
    data.url('jquery-2.2.0.min.js'),
    data.url('content-script.js')
  ],
  contentScriptWhen: 'end',
  onAttach: function(worker) {
    worker.port.emit('init')
    worker.port.on('copyToClipboard', function(serviioObject) {

      // console.log(preferences['useREST'])
      // console.log(preferences['serviioURL'])

      var serviioRESTURL = preferences['serviioURL'].replace(/\/$/, '')
      console.log(serviioRESTURL)
      var resolveMessages = []

      function isServiioRunning() {
        return new Promise(
          function(resolve, reject) {
            var serviioStatus = Request({
              url: serviioRESTURL + '/rest/service-status',
              contentType: 'application/json',
              headers: {
                accept: 'application/json'
              },
              onComplete: function(response) {
                if (response.status === 200 && response.json.serviceStarted) {
                  console.log('[isServiioRunning] - Promise fulfilled. Async code terminated')
                  resolveMessages.push({
                    'isServiioRunning': 'true'
                  })
                  resolve({
                    'isServiioRunning': 'true'
                  })
                } else {
                  console.log('[isServiioRunning] - Promise rejected. Async code terminated')
                  reject({
                    'isServiioRunning': 'false'
                  })
                }
              }
            }).get()
          })
      }

      function isYoutubePluginPresent() {
        return new Promise(
          function(resolve, reject) {
            var serviioStatus = Request({
              url: serviioRESTURL + '/rest/plugins',
              contentType: 'application/json',
              headers: {
                accept: 'application/json'
              },
              onComplete: function(response) {
                if (response.json.plugins.length) {
                  response.json.plugins.map(function(plugin) {
                    if (plugin.name === 'YouTube') {
                      console.log('[isYoutubePluginPresent] - Promise fulfilled. Async code terminated')
                      resolveMessages.push({
                        'isYoutubePluginPresent': 'true'
                      })
                      resolve({
                        'isYoutubePluginPresent': 'true'
                      });
                    } else {
                      console.log('[isYoutubePluginPresent] - Promise rejected. Async code terminated')
                      reject({
                        'isYoutubePluginPresent': 'false'
                      })
                    }
                  })
                } else {
                  console.log('[isYoutubePluginPresent] - Promise rejected. Async code terminated')
                  reject({
                    'isYoutubePluginPresent': 'false'
                  })
                }
              }
            }).get()
          })
      }

      function addYoutubeSource() {
        return new Promise(
          function(resolve, reject) {
            var serviioStatus = Request({
              url: serviioRESTURL + '/rest/import-export/online',
              contentType: 'application/xml',
              headers: {
                accept: "application/xml"
              },
              content: prepareRequestBody(),
              onComplete: function(response) {
                if (response.status === 204) {
                  console.log('[addYoutubeSource] - Promise fulfilled. Async code terminated')
                  resolveMessages.push({
                    'addYoutubeSource': 'true'
                  })
                  resolve({
                    'addYoutubeSource': 'true'
                  });
                } else {
                  console.log('[addYoutubeSource] - Promise rejected. Async code terminated')
                  reject({
                    'addYoutubeSource': 'false'
                  })
                }
              }
            }).put()
          })
      }

      function prepareRequestBody() {
        var serviioURL = serviioObject.serviioURL
        var channelName = serviioObject.channelName
        var playlistName = serviioObject.playlistName
        var mediaSourceName
        if (playlistName) {
          mediaSourceName = channelName + ' - ' + playlistName
        } else {
          mediaSourceName = channelName
        }

        return `<onlineRepositoriesBackup>
            <items>
              <backupItem enabled="true">
                <serviioLink>serviio:\/\/video:web?url=${serviioURL}&amp;name=${mediaSourceName}</serviioLink>
                  <accessGroupIds>
                    <id>1</id>
                  </accessGroupIds>
              </backupItem>
            </items>
          </onlineRepositoriesBackup>`

      }

      function informUI() {
        console.log('resolveMessages', resolveMessages)
        worker.port.emit('success')
      }

      isServiioRunning().then(isYoutubePluginPresent)
        .then(addYoutubeSource)
        .then(informUI)
        .catch(function(err) {
          console.log(err.fileName + ":" + err.lineNumber + ":" + err)
        })
    }); // end port.on
  } // end onAttach
}); //end PageMod

tabs.open('https://www.youtube.com/user/catmusicoffice/videos')
  // tabs.open('https://www.youtube.com/playlist?list=PLCzQ2UHQfewRpVrmLIEy_Dh98sEU2x0o6')
  // tabs.open('https://www.youtube.com/user/erlazantivirus/videos')
  // tabs.open('https://www.youtube.com/channel/UCEY2CNlzLkUedfuPAiPpEKg/videos')
