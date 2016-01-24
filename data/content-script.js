self.port.on("message", function() {
	const USERNAME_VIDEOS = 'https://www.googleapis.com/youtube/v3/channels?forUsername='
	if ($(document).load()) {
		console.log('mutationNode', document.body)
		var currentLocation = document.location.href;
		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
			console.log('URL changed')
			currentLocation = document.location.href;
			if (currentLocation.includes('/user/') && currentLocation.includes('/videos')) {
				var serviioURL = USERNAME_VIDEOS + getUsername();
				if ($('.serviioButton').length === 0) {
					console.log('Videos page found with username: ' + getUsername() + '. Inserting', serviioURL)
					generateVideosTabServiioButton(serviioURL).prependTo('.branded-page-v2-subnav-container')
				}
			}

			if (currentLocation.includes('/channel/') && currentLocation.includes('/videos')) {
				if ($('.serviioButton').length === 0) {
					var serviioURL = 'https://www.googleapis.com/youtube/v3/channels?id=' + getChannelId()
					console.log('Videos page found with channel id: ' + getChannelId() + '. Inserting', serviioURL)
					generateVideosTabServiioButton(serviioURL).prependTo('.branded-page-v2-subnav-container')
				}

			}

			if (currentLocation.includes('/playlist?list=')) {
				if ($('.serviioButton').length === 0) {
					var serviioURL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId=' + getPlaylistId()
					console.log('Playlist page found with playlist id: ' + getPlaylistId() + '. Inserting', serviioURL)
					generateDefaultServiioButton(serviioURL).appendTo('.playlist-actions');
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


function generateDefaultServiioButton(serviioURL) {
	var serviioDefaultButton = $('<button/>', {
		'type': 'button',
		'class': 'serviioButton yt-uix-button yt-uix-button-default',
		'name': 'Serviio Button',
	}).css({
		'background-image': 'url(resource://ffserviio/data/icon-serviio.png)',
		'background-size': '26px',
		'width': '28px',
		'height': '28px',
	})

	serviioDefaultButton.click(function() {
		console.log('overlay.js - copyToClipboard - Sending URL', serviioURL);
		self.port.emit('copyToClipboard', serviioURL);
	})
	return serviioDefaultButton
}

function generateVideosTabServiioButton(serviioURL) {
	var serviioVideosButton = generateDefaultServiioButton(serviioURL);
	serviioVideosButton.css({
		'float': 'right',
		'margin-left': '5px'
	})
	return serviioVideosButton
}


function generateServiioURL(serviioURL) {
	var serviioURL = $('<span/>)', {
		'class': 'serviio-videos-url',
		'text': serviioURL
	});
	console.log('called')
	return serviioURL;
}


function generateServiioIcon() {
	var serviioIcon = $('<img/>', {
		'src': 'resource://ffserviio/data/icon-serviio.png',
		'class': 'serviio-icon',
		'alt': 'http://www.serviio.org',
		'title': 'Click and see what happens :)'
	});
	serviioIcon.css({
		'padding-right': '5px',
		'padding-left': '5px',
		'height': '20px',
		'width': '20px'
	});
	console.log('GENERATED ICON');
	return serviioIcon;
}

function getUsername() {
	// This works only when user has set a custom URL ! FIXME later
	// https://www.youtube.com/user/OkapiSoundOfficial/videos
	var tokens = document.location.href.split('/')
		//console.log(tokens)
	var username = tokens[4];
	return username
}

function getChannelId() {
	var tokens = document.location.href.split('/')
	var channelId = tokens[4];
	return channelId
}

function getPlaylistId() {
	return document.location.href.split('=')[1]
}
