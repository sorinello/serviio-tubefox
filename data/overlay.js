self.port.on("message", function(url) {

	if ($(document).load()) {
	var target = document.body;

	console.log('target', target)
	var currentTarget = document.location.href;
 
	// create an observer instance
	var observer = new MutationObserver(function(mutations) {

		var newTarget = document.location.href;
		if(currentTarget !== newTarget) {
			currentTarget = newTarget;
  			console.log('URL changed')
    		console.log('old URL', currentTarget)
    		console.log('new URL', document.location.href)
    		//if(newTarget.includes('youtube.com')) {
        		if (newTarget.includes('/user/') && newTarget.includes('/videos')) {
            		var serviioURL = USERNAME_VIDEOS+getUsername();
            		//worker.port.emit("video_page", serviioURL);
            			if ($('.branded-page-module-title.serviio-videos-url').length === 0) {
							generateServiioIcon().insertAfter('.branded-page-module-title')
							generateServiioButton().insertAfter('.serviio-icon');
							generateServiioURL().insertAfter('.serviio-icon')
 						}
        		}	

        		if (newTarget.includes('/playlist?list=')) {
            		//console.log('PLAYLISTS FOUND', currentTab.url) 
            		console.log('Playlist URL:', getPlaylistId())
        		} 
    		//}
  		}
 	});
 
	// configuration of the observer:
	var config = { 
		attributes: false,
		childList: true,
		characterData: false };
	// pass in the target node, as well as the observer options
	observer.observe(target, config);
	}
});

function generateServiioButton() {
 		var serviioButton = $('<button/>', {
 			'type'  : 'button',
 			'class' : 'serviioButton',
 			'value' : 'Click Me',
 			'name'  : 'Serviio Button',
 			'text'	: 'Text'
 		})

 		serviioButton.click(function(){
 			console.log('overlay.js - copyToClipboard - Sending URL', url);
 			self.port.emit('copyToClipboard', url);
 		})

 		return serviioButton
 	}

 	function generateServiioURL() {
 		var serviioURL = $('<span/>)', {
 			'class' : 'branded-page-module-title serviio-videos-url',
 			'text'  : url
 		});

 		return serviioURL;
 	}


 	function generateServiioIcon() {

 		var serviioIcon = $('<img/>', {
    		'src'   : 'resource://ffserviio/data/icon-serviio.png',
    		'class' : 'serviio-icon',
    		'alt'   : 'http://www.serviio.org',
    		'title' : 'Click and see what happens :)'
		});

		serviioIcon.css({
			'padding-right' : '5px',
			'padding-left'  : '5px',
			'height'		: '20px',
			'width'			: '20px'
		});
		return serviioIcon;
 	}


// self.port.on('video_page', function showVideosLink(url){
// 	console.log(url);

 	// if ($('.branded-page-module-title.serviio-videos-url').length === 0)
 	// {

		// generateServiioIcon().insertAfter('.branded-page-module-title')

		// generateServiioButton().insertAfter('.serviio-icon');

		// generateServiioURL().insertAfter('.serviio-icon')

 	// }

 	// function generateServiioButton() {
 	// 	var serviioButton = $('<button/>', {
 	// 		'type'  : 'button',
 	// 		'class' : 'serviioButton',
 	// 		'value' : 'Click Me',
 	// 		'name'  : 'Serviio Button',
 	// 		'text'	: 'Text'
 	// 	})

 	// 	serviioButton.click(function(){
 	// 		console.log('overlay.js - copyToClipboard - Sending URL', url);
 	// 		self.port.emit('copyToClipboard', url);
 	// 	})

 	// 	return serviioButton
 	// }

 	// function generateServiioURL() {
 	// 	var serviioURL = $('<span/>)', {
 	// 		'class' : 'branded-page-module-title serviio-videos-url',
 	// 		'text'  : url
 	// 	});

 	// 	return serviioURL;
 	// }


 	// function generateServiioIcon() {

 	// 	var serviioIcon = $('<img/>', {
  //   		'src'   : 'resource://ffserviio/data/icon-serviio.png',
  //   		'class' : 'serviio-icon',
  //   		'alt'   : 'http://www.serviio.org',
  //   		'title' : 'Click and see what happens :)'
		// });

		// serviioIcon.css({
		// 	'padding-right' : '5px',
		// 	'padding-left'  : '5px',
		// 	'height'		: '20px',
		// 	'width'			: '20px'
		// });
		// return serviioIcon;
 	// }
//})
  