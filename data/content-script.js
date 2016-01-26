self.port.on("message", function() {

	const VIDEOS_USERNAME_BASE_URL = 'https://www.googleapis.com/youtube/v3/channels?forUsername='
	const VIDEOS_CHANNEL_ID_BASE_URL = 'https://www.googleapis.com/youtube/v3/channels?id='
	const PLAYLIST_BASE_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId='

	if ($(document).load()) {
		console.log('mutationNode', document.body)
		var currentLocation = document.location.href;
		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			console.log('URL changed')
			currentLocation = document.location.href;
			if (currentLocation.includes('/user/') && currentLocation.includes('/videos')) {
				var serviioURL = VIDEOS_USERNAME_BASE_URL + getUsername();
				if ($('.serviioButton').length === 0) {
					console.log('Videos page found with username: ' + getUsername() + '. Inserting', serviioURL)
					createServiioButtonVideos(serviioURL).prependTo('.branded-page-v2-subnav-container')
				}
			}

			if (currentLocation.includes('/channel/') && currentLocation.includes('/videos')) {
				if ($('.serviioButton').length === 0) {
					var serviioURL = VIDEOS_CHANNEL_ID_BASE_URL + getChannelId()
					console.log('Videos page found with channel id: ' + getChannelId() + '. Inserting', serviioURL)
					createServiioButtonVideos(serviioURL).prependTo('.branded-page-v2-subnav-container')
				}

			}

			if (currentLocation.includes('/playlist?list=')) {
				if ($('.serviioButton').length === 0) {
					var serviioURL = PLAYLIST_BASE_URL + getPlaylistId()
					console.log('Playlist page found with playlist id: ' + getPlaylistId() + '. Inserting', serviioURL)
					createServiioButton(serviioURL).appendTo('.playlist-actions');
				}
			}
		});
	}

	// configuration of the observer:
	var config = {
		attributes: false,
		childList: true,
		characterData: false
	};
	// pass in the mutationNode node, as well as the observer options
	observer.observe(document.body, config);
});


function createServiioButton(serviioURL) {
	var serviioButton = $('<button/>', {
		'type' : 'button',
		'class': 'serviioButton yt-uix-button yt-uix-button-default',
		'name' : 'Serviio Button',
	}).css({
		'background-image': 'url(resource://ffserviio/data/icon-serviio.png)',
		'background-size' : '26px',
		'width'           : '28px',
		'height'          : '28px',
	})

	serviioButton.click(function() {
		console.log('overlay.js - copyToClipboard - Sending URL', serviioURL)
		self.port.emit('copyToClipboard', serviioURL)
	})
	return serviioButton
}

function createServiioButtonVideos(serviioURL) {
	var serviioVideosButton = createServiioButton(serviioURL)
	serviioVideosButton.css({
		'float'      : 'right',
		'margin-left': '5px'
	})
	return serviioVideosButton
}


function getUsername() {
	var tokens = document.location.href.split('/')
	var username = tokens[4]
	return username
}

function getChannelId() {
	var tokens = document.location.href.split('/')
	var channelId = tokens[4]
	return channelId
}

function getPlaylistId() {
	return document.location.href.split('=')[1]
}
