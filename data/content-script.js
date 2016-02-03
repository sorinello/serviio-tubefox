const VIDEOS_USERNAME_BASE_URL   = 'https://www.googleapis.com/youtube/v3/channels?forUsername='
const VIDEOS_CHANNEL_ID_BASE_URL = 'https://www.googleapis.com/youtube/v3/channels?id='
const PLAYLIST_BASE_URL          = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId='

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
});

function processPage() {
	currentLocation = document.location.href;
	if (!serviioButtonExists() && currentLocation.includes('/user/') && currentLocation.includes('/videos')) {
		var serviioURL = VIDEOS_USERNAME_BASE_URL + getChannelIdentifier()
		createServiioVideosButton(serviioURL).prependTo('.branded-page-v2-subnav-container')
	}
	if (!serviioButtonExists() && currentLocation.includes('/channel/') && currentLocation.includes('/videos')) {
		var serviioURL = VIDEOS_CHANNEL_ID_BASE_URL + getChannelIdentifier()
		createServiioVideosButton(serviioURL).prependTo('.branded-page-v2-subnav-container')
	}

	if (!serviioButtonExists() && currentLocation.includes('/playlist?list=')) {
		var serviioURL = PLAYLIST_BASE_URL + getPlaylistId()
		createServiioButton(serviioURL).appendTo('.playlist-actions')
	}
}

function serviioButtonExists() {
	if ($('.serviioButton').length) {
		return true
	} else {
		return false
	}
}

function createServiioButton(serviioURL) {
	var serviioButton = $('<button/>', {
		'type' : 'button',
		'class': 'serviioButton yt-uix-button yt-uix-button-default',
		'name' : 'Serviio Button',
	}).css({
		'background-image': 'url(resource://serviio-foxytube/data/icon-serviio.png)',
		'background-size' : '26px',
		'width'           : '28px',
		'height'          : '28px',
	})

	serviioButton.click(function() {
		console.log('content-script.js - copyToClipboard - Sending URL', serviioURL)
		self.port.emit('copyToClipboard', serviioURL)
	})
	return serviioButton
}

function createServiioVideosButton(serviioURL) {
	var serviioVideosButton = createServiioButton(serviioURL)
	serviioVideosButton.css({
		'float'      : 'right',
		'margin-left': '5px'
	})
	return serviioVideosButton
}

// Returns either the user name, or the channel id.
function getChannelIdentifier(){
	var tokens = document.location.href.split('/')
	return tokens[4]
}

function getPlaylistId() {
	return document.location.href.split('=')[1]
}
