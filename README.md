## Send Youtube feeds to Serviio DLNA directly from Firefox !

Serviio is a free media server. It allows you to stream your media files (music, video or images) to renderer devices (e.g. a TV set, Bluray player, games console or mobile phone) on your connected home network.

### Requirements
* Serviio DLNA Server version 1.6 or above (http://www.serviio.org)
* Serviio Youtube Plugin version 4 or above (http://forum.serviio.org/viewtopic.php?f=20&t=3276)

### How to use
* Install the extension
* Navigate on your favourite Youtube channel
  * You will see the Serviio icon on the pages that contain videos
  * "Videos" tab of the channel
* Specific playlist page. This is NOT the "Playlist" tab. See screenshots.
* Click on the Serviio yellow icon. The icon should change its background color to green, indicating that the feed has been successfully added
* If the background color of the Serviio button becomes red, hover over it to see the error message

### Additional configuration
* By default, the extension assumes that you have Serviio installed on the same computer you are using the extension from
* If you want to send Youtube feeds to a remote Serviio server, go to the addon preferences and set Serviio URL to point to it. Make sure that the server is accessible from your current location.

### Possible problems

* Error: Invalid Serviio URL
    * Solution: Go to the extension preferences and make sure that the Serviio URL is valid (i.e http://localhost:23423)
* Error: Serviio is not running or the URL is incorrect
    * Solution: Make sure that Serviio service/process is running and accessible
* Error: Youtube plugin not found
  * Solution: Make sure you have the Youtube plugin installed. Version 4 or above is required. See more on http://forum.serviio.org/viewtopic.php?f=20&t=3276
* Error: Serviio DLNA did not accept the feed.
  * Solution: It means that Serviio did reject the feed URL. This should not happen. If it does, please open a ticket on the addon's Github page including also the Youtube video/playlist causing the issue.
* Some of the videos/playlists I have added do not show up on my TV.
  * Solution: Some videos are copyright protected and they use an encrypted signature. The Serviio Youtube plugin is unable to index those videos. For more details, check serviio.log
For bugs or problems, please report them on: https://github.com/sorinello/serviio-tubefox/issues

#### NOTE: This is a 3rd party addon and is not affiliated with the creators of Serviio DLNA.
