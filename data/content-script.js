/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * Copyright (c) 2016 Sorin Burjan
 */

const VIDEOS_USERNAME_BASE_URL = 'https://www.googleapis.com/youtube/v3/channels?forUsername='
const VIDEOS_CHANNEL_ID_BASE_URL = 'https://www.googleapis.com/youtube/v3/channels?id='
const PLAYLIST_BASE_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId='

self.port.on('init', function() {
  var observer = new MutationObserver(processPage);
  // configuration of the observer:
  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };
  // pass in the mutationNode node, as well as the observer options
  observer.observe(document.querySelector('#content'), config)
  console.log('Running the landing process', document.location.href)

  // call this because refreshing OR landing directly on a Youtube page, the mutation will not trigger in time
  processPage()

  function processPage() {
    currentLocation = document.location.href;
    if (!serviioButtonExists() && currentLocation.includes('/user/') && currentLocation.includes('/videos')) {
      var feedURL = VIDEOS_USERNAME_BASE_URL + getChannelIdentifier()
      createServiioVideosButton(feedURL).prependTo('.branded-page-v2-subnav-container')
    }
    if (!serviioButtonExists() && currentLocation.includes('/channel/') && currentLocation.includes('/videos')) {
      var feedURL = VIDEOS_CHANNEL_ID_BASE_URL + getChannelIdentifier()
      createServiioVideosButton(feedURL).prependTo('.branded-page-v2-subnav-container')
    }

    if (!serviioButtonExists() && currentLocation.includes('/playlist?list=')) {
      var feedURL = PLAYLIST_BASE_URL + getPlaylistId()
      createServiioButton(feedURL).appendTo('.playlist-actions')
    }
  }

  function serviioButtonExists() {
    return ($('.serviioButton').length) ? true : false
  }

  function createServiioButton(feedURL) {
    var serviioButton = $('<button/>', {
      'type': 'button',
      'class': 'serviioButton yt-uix-button yt-uix-button-default',
      'title': 'Send to Serviio'
    }).css({
      'background-image': 'url(resource://serviio-foxytube/data/img/icon-serviio.png)',
      'background-size': '26px',
      'width': '28px',
      'height': '28px',
    })

    serviioButton.click(function() {
      var feedData = {
        feedURL: feedURL,
        channelName: $('.branded-page-header-title-link').text().trim(),
        playlistName: $('.pl-header-title').text().trim()
      }
      self.port.emit('sendToServiio', feedData)
    })
    serviioButton.tooltip()
    return serviioButton
  }

  function createServiioVideosButton(feedURL) {
    var serviioVideosButton = createServiioButton(feedURL)
    serviioVideosButton.css({
      'float': 'right',
      'margin-left': '5px'
    })
    return serviioVideosButton
  }

  // Returns either the user name, or the channel id.
  function getChannelIdentifier() {
    var tokens = document.location.href.split('/')
    return tokens[4]
  }

  function getPlaylistId() {
    return document.location.href.split('=')[1]
  }
})

self.port.on('success', function() {
  $('.serviioButton').css({
    'background-image': 'url(resource://serviio-foxytube/data/img/success.png)',
    'background-size': '26px'
  })
  $('.serviioButton').attr('title', 'Success!')
  $('.serviioButton').tooltip()
})

self.port.on('error', function(reject) {
  $('.serviioButton').css({
    'background-image': 'url(resource://serviio-foxytube/data/img/error.png)'
  })
  $('.serviioButton').attr('title', reject)
  $('.serviioButton').tooltip()

  // Restore de innitial button state after 5 seconds
  window.setTimeout(function() {
    $('.serviioButton').css({
      'background-image': 'url(resource://serviio-foxytube/data/img/icon-serviio.png)',
      'background-size': '26px'
    })
    $('.serviioButton').attr('title', 'Send to Serviio')
    $('.serviioButton').tooltip()
  }, 5000)
})
