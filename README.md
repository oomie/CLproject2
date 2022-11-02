# Connections Lab Project 2: Collaborative Bulletin Board 
Fatima Aljunaibi (toomie) & Fatema Alhameli

## Concept 
Our basic concept is to make a bulletin board website where multiple people can add drawings or doodles to the bulletin board. People can make private rooms and choose a theme for everyone to draw. Users will then draw something that fits the theme and get to choose their favorite drawing at the end. 

## Process

<img src= "https://github.com/oomie/CLproject2/blob/main/media/wireframe2.png" width = "420" height = "280"><img src= "https://github.com/oomie/CLproject2/blob/main/media/wireframe1.png" width = "420" height = "280">

### Description of the web application’s functions:

Draw on a canvas and be able to post/send it to be displayed on the bulletin board
Multiple users can post their drawings on the bulletin board
Each user has their own canvas to draw on with a set of tools such as an eraser, colors,  and reset option
Users can like each others drawings and the number of likes is displayed next to their post
Private rooms do not differ from the public room, it only serves as a personal board 

(We documented the flow without private rooms in mind yet)

### Server and Client Flow:

#### 1. Starting the connection: 

* C : initiates a connection to S
* S : recognises a connection & acknowledges when client connects (and disconnects)
* C : acknowledge when a connection has been established
* S : sends an alert for the user to enter their display name
* C : enters name,  emits name data to the server
* S : .on receiving the name data, emits to the client to show on their canvas (the name is not broadcasted to clients until the drawing is posted on the server)

#### 2. On the drawing canvas:

* C: draws on the p5 canvas using mouseX,Y and pmouseX,Y, this data is not sent to the server until the user submits it. 
* C: when C submits the canvas, it emits to the server which stores the image on a database. 
* S : broadcast emits the image(drawing) to all current clients and also emits a unique ‘like’ button and counter to each drawing that is posted
* C : .on receiving a new drawing from the server, displays it on the bulletin board (to all current clients)

#### 3. When a drawing is liked:

* C : when a user clicks the like button, the button data is emitted to the server
* S :  .on receiving button data, the counter for that button is increased by 1 and the counter ( which is stored in button data) is emitted to all clients
* C : .on receiving the button data, displays the number of likes to all users.







