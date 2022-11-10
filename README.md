# Connections Lab Project 2: Collaborative Bulletin Board 
Fatima Aljunaibi (toomie) & Fatema Alhameli

Glitch Link:(https://glitch.com/edit/#!/cl-project2final?path=public%2Fprivate%2Fapp.js%3A22%3A23)

## Concept 
Our basic concept is to make a  website where multiple people can add drawings or doodles to the bulletin board. People can make private rooms to send drawing based on a certain. Users are also able to like eachothers drawings. This idea was initially inspired by the game animal crossing. The game had a bulletin board feature where you can draw on your bulletin board or another user's board and your drawings would be posted. 


## Planning Process

### Wireframes: 
<img src= "https://github.com/oomie/CLproject2/blob/main/media/wireframe2.png" width = "420" height = "280"><img src= "https://github.com/oomie/CLproject2/blob/main/media/wireframe1.png" width = "420" height = "280">

### Description of the web application’s functions:

Draw on a canvas and be able to post/send it to be displayed on the web.Multiple users can post their drawings. Each user has their own canvas to draw on with a set of tools such as an eraser, colors,  and reset option. Users can like each others drawings and the number of likes is displayed next to their post. Private rooms do not differ from the public room, it only has a theme the room follows. 

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


## Code Process

For our project, we used sockets.io and nedb database. Before beginning the coding process, we created an information flow of what we wanted our code to do. First, we set up the client side (HTML, CSS, JS) and the server side (index.js). In the server-side code, we installed express, sockets, and nedb. This also included initializing the express 'app' object, HTTP server, socket.io, and nedb. Then we used ```socket.on```  to create both server and client-side socket connection. 


### P5 canvas and drawing tools 
To allow the user to simply draw on a p5 canvas we used mouseX, mouseY, pmouseX, pmouseY. In the draw function, we used an if statement that indicates if the ```mouseIsPressed``` a line can be drawn at whatever x and y point the mouse is at. 

```
function draw() {
   if (mouseIsPressed) {
       stroke(colorPicker.color());
       strokeWeight(4);
       line(mouseX, mouseY, pmouseX, pmouseY);
   }
}
```
We proceed to create a function for each tool we wanted to add (clear, eraser, draw, and color picker). The first function was ```clearCanvas```, in the function we only added ```background(255)``` so that if the function is used a new background would cover the existing background. Ultimately, clearing the whole canvas. In the eraser function, we used the line syntax with mouseX, mouseY, pmouseX, pmouseY and added a large stroke and the same color stroke as the background to act as an eraser.  We also added a brush function and this is for when you use an eraser and want to go back to drawing. In the brush function, we used the syntax we had in the draw function but without the if statement. The last tool we added was the color picker. We decided to add this input through p5 as it was simpler to connect it to the stroke. 

```
function setup() {
  let canvas = createCanvas(400, 400);
  canvas.id("my-canvas");
  canvas.position(975, 115);
  background(255, 255, 255);
  colorPicker = createColorPicker("black");
  colorPicker.position(1250, 535);
  colorPicker.input(brush);
  strokeWeight(4);
}

function draw() {
  push();
  strokeWeight(0);
  text(username, 10, 390);
  pop();
  if (mouseIsPressed) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function clearCanvas() {
  background(255);
}

function eraser() {
  stroke(255, 255, 255);
  strokeWeight(50);
  line(mouseX, mouseY, pmouseX, pmouseY);
}

function brush() {
  stroke(colorPicker.color());
  strokeWeight(4);
  line(mouseX, mouseY, pmouseX, pmouseY);
}
```


For these drawing tools to be usable, we had to add them to a button. In an HTML div, we created a button for each tool. In each button tag, we added the property ```onclick = “”``` and in it, we put the corresponding function to the button. This is so that when a certain button is clicked whatever tool is chosen would work on the canvas. 

```
   <div class="Tools">
       <button id="draw-btn" onclick="brush()">Draw</button>
       <button id="erase-btn" onclick="eraser()">Eraser</button>
       <button id="clear-btn" onclick="clearCanvas()">Clear</button>
   </div>
```


### Sockets 
After setting up the sockets connection in both the server and client side we had to add namespaces since our project required private and public rooms. On our server side, we initiated a connection for both room types. On the private connection, we added room names. Upon connecting to sockets on private there will be a room name. We used socket.on and socket.join to do this.

```
let io = require("socket.io");
io = new io.Server(server);

let publicSockets = io.of("/publicSpace");

publicSockets.on("connect", (socket) => {
  console.log("New Connection : ", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected : ", socket.id);
  });
});

let privateSockets = io.of("/privateSpace");

privateSockets.on("connect", (socket) => {
  console.log("New Connection : ", socket.id);

  socket.on("roomJoin", (data) => {
    socket.roomName = data.name;
    socket.join(socket.roomName);
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected : ", socket.id);
  });
});
```
In our code, we created two folders a public folder with the code files (HTML, CSS, JS) and with the same folder we created a private folder with different HTML, CSS, JS files. We also created a common.js where we added the shared client-side between both files.
On the public client side, we initiated the socket connect but with the public namespace. We did the same on the private client side but added the room names functionality. We used socket.on that indicates if there is a socket connection a room data object exists that includes a certain room name. Within the if statement we use socket.emit to send that room name to all clients. We then display that room name on the public room using innerHTML.

```
let socket = io("/privateSpace");

let roomName = window.prompt(
  "If you're creating a room, enter a theme for your room! (This will be the key). If you're joining a room, just enter the theme name!"
);
console.log("ROOM :", roomName);

window.addEventListener('load', () => {
  onButtonPress("private", roomName);
  //roomTheme(roomName);
})

socket.on("connect", () => {
  if (roomName) {
    console.log("Connection established to server via socket");
    let roomData = {
      name: roomName,
    };
    socket.emit("roomJoin", roomData);
    document.getElementById("theme").innerHTML = roomName;
  } else {
    alert("refresh and ENTER A NAME!!!");
  }
});

```

### Nedb Data Base

In order to display the drawing the users are submitting we needed to store the canvas as an image in a database. To do this we had to convert the images to DataURLs and turn it into a Base64 string in the client-side code. And stored it in a button that will then be used to post these drawing. 

```
  let postButton = document.getElementById("post-btn");
  let getBase64StringFromDataURL = (dataURL) =>
    dataURL.replace("data:", "").replace(/^.+,/, "");

  postButton.addEventListener("click", (e) => {
    let canvas = document.getElementById("my-canvas");
    // Convert canvas to dataURL and log to console
    let dataURL = canvas.toDataURL("image/jpeg", 0.5);
    // Convert to Base64 string
    base64 = getBase64StringFromDataURL(dataURL);
    e.preventDefault();
```
We then created an object with the image and base64 information. Our object includes all the information for our website images, likes, type, and theme name. Then we ```JSON.stringify``` the object in order to create and pass through a fetch POST to the server. 

```

    let imgObj = {
      img: base64,
      like: 0,
      updateAt: new Date(),
      type: publicOrPrivate,
      theme: themeName
    };

    imgObjJSON = JSON.stringify(imgObj);
    console.log(imgObj);

    fetch("/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: imgObjJSON,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  });
```

Then, in the server-side code, we added a POST route for our object and created a GET request. In our code we have two get requests that specify the type of images (whether they are created in the public or private room). Therefore, we have a public get request and a private get request. In both these requests, we add SORT to organize the data (images) that are being sent to be displayed properly. In the sort, we added ```updateAt: -1``` so that the newly displayed images would appear from the top, not the bottom. In the private images get request we also added a key for the private room's names/themes. This will allow the images of the private rooms to display only if the private rooms have the same name. All of this will allow the server to return all the information of the object. After this, on the client side, we can fetch all this information to actually display the images.  


In the case of our code, we fetched the information from the server twice, once on the public client-side and once on the private client-side so that images would be displayed accordingly. They technically have the same code syntax but minor differences. On both client-side fetches, we created a function called displayImgs () and created a section and a new HTML elements list and image. We converted the base64 URLs into actual images through the HTML ‘img’. The last thing we, added was a like button and text for the number of likes. For this to work, we used a separate POST to send all the like information to the server. Then we used a separate app.post ("/imagelike") on the server side that included a ```db.update``` to update the data with the number of likes. We then fetched it within the same fetch created in the displayImgs() function for it all to them be displayed and updated.  Lastly, we appended everything so it would be visible.

### add about usernames (how we added them and displayed on canvas)

## Challenges and Solutions 

## Next Steps

## References

* [Convert An Image To A DataURL or Base64 String Using JavaScript](https://pqina.nl/blog/convert-an-image-to-a-base64-string-with-javascript/#fetching-the-image-source)

* [Nedb Documentaion](https://github.com/louischatriot/nedb#logical-operators-or-and-not-where)

* [P5.js Reference](https://p5js.org/reference/)

* [Class Notes and Examples](https://github.com/MathuraMG/ConnectionsLab-NYUAD)



