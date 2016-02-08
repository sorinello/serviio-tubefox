var tabs = require("sdk/tabs")
var data = require('sdk/self').data
var clipboard = require('sdk/clipboard')
var pageMod = require("sdk/page-mod")
var Request = require("sdk/request").Request;
var XMLHttpRequest = require("sdk/net/xhr").XMLHttpRequest;
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

        var serviioRESTURL = preferences['serviioURL'].replace(/\/$/, '')
        console.log(serviioRESTURL)

        isServiioRunning().then(isYoutubePluginPresent)
          .then(addYoutubeSource)
          .then(successUI)
          .catch(function(error) {
            //console.log(error.fileName + ':' + error.lineNumber + ':' + error)
            errorUI()
          })

        // Wrap XHR object inside a Promise. Using XHR because Request SDK does not support timeout, and default timeout is too high for the user to wait
        function isServiioRunning() {
          return new Promise(
            function(resolve, reject) {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", serviioRESTURL + '/rest/service-status');
              xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
              xhr.timeout = 2000; // Set timeout to 2 seconds (2000 milliseconds)
              xhr.onload = function() {
                if (xhr.readyState == 4) {
                  console.log('[isServiioRunning] - Promise fulfilled. Async code terminated')
                  resolve({
                    'isServiioRunning': 'true'
                  })
                }
              }
              xhr.ontimeout = function() {
                console.log('[isServiioRunning] - Promise rejected. Async code terminated. Please check if your Serviio server is started or that the add-on Serviio URL is properly set.')
                reject({
                  'isServiioRunning': 'false'
                })
              }
              xhr.send();
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
                        resolve({
                          'isYoutubePluginPresent': 'true'
                        });
                      } else {
                        console.log('[isYoutubePluginPresent] - Promise rejected. Async code terminated. Youtube plugin was not found. Please install Youtube plugin before')
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
                    resolve({
                      'addYoutubeSource': 'true'
                    });
                  } else {
                    console.log('[addYoutubeSource] - Promise rejected. Async code terminated. Serviio DLNA did not accept the URL. This should not happen. Response status: ' + response.status)
                    reject({
                      'addYoutubeSource': 'false'
                    })
                  }
                }
              }).put()
            })
        }

        function prepareRequestBody() {

          var mediaSourceName = (serviioObject.playlistName.length > 0) ? mediaSourceName = serviioObject.channelName + ' - ' + serviioObject.playlistName : mediaSourceName = serviioObject.channelName

          return `<onlineRepositoriesBackup>
            <items>
              <backupItem enabled="true">
                <serviioLink>serviio:\/\/video:web?url=${serviioObject.serviioURL}&amp;name=${mediaSourceName}</serviioLink>
                  <accessGroupIds>
                    <id>1</id>
                  </accessGroupIds>
              </backupItem>
            </items>
          </onlineRepositoriesBackup>`

        }

        function successUI() {
          worker.port.emit('success')
        }

        function errorUI() {
          worker.port.emit('error')
        }
      }); // end port.on
    } // end onAttach
}); //end PageMod

tabs.open('https://www.youtube.com/user/catmusicoffice/videos')
  // tabs.open('https://www.youtube.com/playlist?list=PLCzQ2UHQfewRpVrmLIEy_Dh98sEU2x0o6')
  // tabs.open('https://www.youtube.com/user/erlazantivirus/videos')
  // tabs.open('https://www.youtube.com/channel/UCEY2CNlzLkUedfuPAiPpEKg/videos')
