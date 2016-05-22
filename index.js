/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * Copyright (c) 2016 Sorin Burjan
 */

var tabs = require('sdk/tabs')
var data = require('sdk/self').data
var pageMod = require('sdk/page-mod')
var Request = require('sdk/request').Request;
var XMLHttpRequest = require('sdk/net/xhr').XMLHttpRequest;
var preferences = require('sdk/simple-prefs').prefs;


pageMod.PageMod({
  include: '*.youtube.com',
  contentScriptFile: [
    data.url('jquery-2.2.0.min.js'),
    data.url('jquery-ui.min.js'),
    data.url('content-script.js')
  ],
  contentStyleFile: [
    data.url('jquery-ui.min.css')
  ],
  contentScriptWhen: 'end',
  onAttach: function(worker) {
      worker.port.emit('init')
      worker.port.on('addToServiio', function(feedData) {

        var serviioBaseURL = preferences['serviioBaseURL']

        if (!isServiioBaseURLValid()) {
          console.log('serviioBaseURL not valid')
          errorUI('Error: Invalid Serviio URL')
          return
        }

        // Flat chain and run the promises.
        isServiioRunning().then(isYoutubePluginPresent)
          .then(addYoutubeSource)
          .then(successUI)
          .catch(function(reject) {
            console.log('ERROR', reject)
            errorUI(reject)
          })

        function isServiioBaseURLValid() {
          serviioBaseURL = serviioBaseURL.trim().replace(/\/$/, '')
          if (serviioBaseURL.length === 0) {
            console.log('serviioBaseURL preference is empty, defaulting to http://localhost:23423')
            serviioBaseURL = 'http://localhost:23423'
            return true
          } else {
            return serviioBaseURL.toLowerCase().includes('http://')
          }
        }

        // Wrap XHR object inside a Promise. Using XHR here, because Request SDK does not support timeout, and default timeout is too high for the user to wait
        function isServiioRunning() {
          return new Promise(
            function(resolve, reject) {
              var xhr = new XMLHttpRequest();
              var restURL = serviioBaseURL + '/rest/service-status'
              xhr.open('GET', restURL);
              xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
              xhr.timeout = 2000; // Set timeout to 2 seconds (2000 milliseconds)
              xhr.onload = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                  console.log('[isServiioRunning] - Promise fulfilled. Async code terminated')
                  resolve()
                }
              }
              xhr.onerror = function() {
                console.log('[isServiioRunning] - Promise rejected. Async code terminated. Please check if your Serviio server is started or that the add-on Serviio URL is properly set.')
                reject('Error: Serviio is not running or the URL is incorrect')
              }
              xhr.ontimeout = function() {
                console.log('[isServiioRunning] - Promise rejected. Async code terminated. Please check if your Serviio server is started or that the add-on Serviio URL is properly set.')
                reject('Error: Serviio is not running or the URL is incorrect')
              }
              xhr.send();
            })
        }

        function isYoutubePluginPresent() {
          return new Promise(
            function(resolve, reject) {
              var restURL = serviioBaseURL + '/rest/plugins'
              var serviioStatus = Request({
                url: restURL,
                contentType: 'application/json',
                headers: {
                  accept: 'application/json'
                },
                onComplete: function(response) {
                  if (response.json.plugins.length) {
                    console.log('Response array: ', response.json.plugins)
                    var pluginFound = false
                    response.json.plugins.map(function(plugin) {
                      if (plugin.name === 'YouTube') {
                        console.log('Youtube plugin found')
                        pluginFound = true
                      }
                    })
                    if (pluginFound) {
                      console.log('[isYoutubePluginPresent] - Promise fulfilled. Async code terminated')
                      resolve()
                    } else {
                      console.log('[isYoutubePluginPresent] - Promise rejected. Async code terminated. Youtube plugin not found. Please install Youtube plugin before')
                      reject('Error: Youtube plugin not found')
                    }
                  } else {
                    console.log('[isYoutubePluginPresent] - Promise rejected. Async code terminated')
                    reject('Error: Youtube plugin not found')
                  }
                }
              }).get()
            })
        }

        function addYoutubeSource() {
          return new Promise(
            function(resolve, reject) {
              var restURL = serviioBaseURL + '/rest/import-export/online'
              var serviioStatus = Request({
                url: restURL,
                contentType: 'application/xml',
                headers: {
                  accept: 'application/xml'
                },
                content: prepareRequestBody(),
                onComplete: function(response) {
                  if (response.status === 204) {
                    console.log('[addYoutubeSource] - Request body', prepareRequestBody())
                    console.log('[addYoutubeSource] - Promise fulfilled. Async code terminated')
                    resolve()
                  } else {
                    console.log('[addYoutubeSource] - Request body', prepareRequestBody())
                    console.log('[addYoutubeSource] - Promise rejected. Async code terminated. Serviio DLNA did not accept the feed. This should not happen. Response status: ' + response.status)
                    reject('Error: Serviio DLNA did not accept the feed. This should not happen. Validation error, status code: ' + response.status)
                  }
                }
              }).put()

              function prepareRequestBody() {
                var mediaSourceName = (feedData.playlistName.length > 0) ? mediaSourceName = feedData.channelName + ' - ' + feedData.playlistName : mediaSourceName = feedData.channelName
                return `<onlineRepositoriesBackup>
                    <items>
                      <backupItem enabled="true">
                         <serviioLink>serviio:\/\/video:web?url=`+encodeURIComponent(feedData.feedURL)+`&amp;name=`+encodeURIComponent(mediaSourceName)+`</serviioLink>
                        <accessGroupIds>
                          <id>1</id>
                        </accessGroupIds>
                      </backupItem>
                    </items>
                  </onlineRepositoriesBackup>`
              }
            })
        }



        function successUI() {
          worker.port.emit('success')
        }

        function errorUI(reject) {
          worker.port.emit('error', reject)
        }
      }); //end port.on
    } //end onAttach
}); //end PageMod