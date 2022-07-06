# jord
text based MUD using React, Node.js, WebSockets.

Currently implemented: 
* WebSocket Connection
* Terminal main page
* Node.js Backend
* echo command (just says whatever you typed in chat)
* say command (says whatever you typed in chat but to all clients connected)

Next Steps:
* client identification associated with their player character
  * log in using google maybe? see how difficult that is to pull off
* room storage 
* object storage inside each rooms (basically I'm hoping json let's me pull this off relatively easily)
* look command which shows the room that the player pawn is in, (reading the name and the description and the exits)
* nesw movement controls, moving the player pawn and auto executing the look command in new locations
* fighting system: ? tick events?
  * idea is to create a special event (just like how websock.on('message') works) that is run 20 times a second or so
  * it would resolve attacks and change the turns
  * if a character has typed flee (?at any time?) then resolve that
* create a subprotocal that allows the creation of rooms
