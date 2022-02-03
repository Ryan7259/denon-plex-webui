# Denon Plex Web UI

This is a React and express.js server app that acts as an intuitive UI to browse for local Plex music and stream it to a HEOS device like a Denon AV receiver/player. The React app uses the express server to send and receive JSON requests formatted to the HEOS CLI protocol.

This is only a Node.js localhost app that can be started by npm install + clicking the startAppAndServer.bat file.

## Features:
- Searching and connecting to a HEOS device
- Browsing for media local DLNA servers (mainly written for Plex) to add to the player queue
- Web UI to control player functions like play modes, play states, volume control, etc.
- Queueing songs, changing queue order, saving/editing/loading playlists, etc.
- Server sent events to sync up the interface with what the actual player is doing


## Extras:
- To see Plex album art, the user must set computer's local IPv4 address to the allowed without auth list in Plex Media Server settings (Otherwise, it would require a Plex token or using an external metadata service)
- The local IPv4 address is set automatically on app startup and maybe overwritten in settings.

## Images:
<img src="https://github.com/Ryan7259/denon-plex-webui/blob/main/pic1.png?raw=true">
<img src="https://github.com/Ryan7259/denon-plex-webui/blob/main/pic2.png?raw=true">
