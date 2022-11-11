# Connections Lab Project 2: Collaborative Bulletin Board 
Fatima Aljunaibi (toomie) & Fatema Alhameli

Live Site: https://cl-project2final.glitch.me

Glitch Code Link: https://glitch.com/edit/#!/cl-project2final?path=public%2Fprivate%2Fapp.js%3A22%3A23 


## Concept 
Our concept for this project was to make a  website where multiple people can add drawings or doodles to a bulletin board. People can make private rooms to send drawing based on a certain theme. Users are also able to like each others drawings. 
### Inspiration
This idea was initially inspired by the game animal crossing. The game had a bulletin board feature where you can draw on your bulletin board or another user's board and your drawings would be posted. It looks like this in-game : 
<img src= "https://github.com/oomie/CLproject2/blob/main/media/acnh.JPG" width = "420">

We really liked the idea of having the username display at the bottom of the drawing, so we kept it in our project!


## Planning Process

### Wireframes: 
<img src= "https://github.com/oomie/CLproject2/blob/main/media/wireframe2.png" width = "420" height = "280"><img src= "https://github.com/oomie/CLproject2/blob/main/media/wireframe1.png" width = "420" height = "280">

### Description of the web application’s functions:

Draw on a canvas and be able to post/send it to be displayed on the web. Multiple users can post their drawings. Each user has their own canvas to draw on with a set of tools such as an eraser, colors,  and clear option. Users can like each others drawings and the number of likes is displayed next to their post. Private rooms do not differ from the public room, it only has a theme the room follows. 

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

For our project, we used both sockets.io and nedb database. Before beginning the coding process, we created an information flow of what we wanted our code to do. First, we set up the client side (HTML, CSS, JS) and the server side (index.js). In the server-side code, we installed express, sockets, and nedb. This also included initializing the express 'app' object, HTTP server, socket.io, and nedb. Then we used ```socket.on```  to create both server and client-side socket connection. 


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
In our code, we created two folders: a public folder with the code files (HTML, CSS, JS) and within the public folder we created a private folder with different HTML, CSS, JS files. We also created a common.js file where we added the shared client-side code between both files instead of copying the code to both JS files.

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

### Nedb Database

In order to display the drawing the users are submitting we needed to store the canvas as an image in a database. To do this we had to convert the images to DataURLs and turn it into a Base64 string to store in NEDB. We stored the client-side code in a button that will then be used to post these drawings and save them to the DB. 

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
We then created an object with the image and base64 information. Our object includes all the information for our website images, likes, type (if it's from the public or private room), and theme name. Then we ```JSON.stringify``` the object in order to create and pass through a fetch POST to the server. 

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

Then, in the server-side code, we added a ```POST``` route for our object and created a ```GET``` request. In our code we have two get requests that specify the type of images (whether they are created in the public or private room). Therefore, we have a public get request and a private get request. In both these requests, we add ```SORT``` to organize the data (images) that are being sent to be displayed properly. In the sort, we added ```updateAt: -1``` so that the newly displayed images would appear from the top, not the bottom. In the private images get request we also added a key for the private room's names/themes. This will allow the images of the private rooms to display only if the private rooms have the same room (theme) name. All of this will allow the server to return all the information of the object. After this, on the client side, we can fetch all this information to actually display the images on the webpage.  


In the case of our code, we fetched the information from the server twice, once on the public client-side and once on the private client-side so that images would be displayed accordingly. They technically have the same code syntax but with minor differences. On both client-side fetches, we created a function called ```displayImgs()``` and created a section and a new HTML list item and image element. We converted the base64 URLs into actual images through the HTML ‘img’ with ```src = "data:image/png;base64,```. The last thing we added was a like button and text to display the number of likes. For this to work, we used a separate ```POST``` to send all the like information to the server. Then we used a separate ```app.post ("/imagelike")``` on the server side that included a ```db.update``` to update the data with the number of likes. We then fetched it within the same fetch created in the displayImgs() function for all to them be displayed and updated.  Lastly, we appended everything so it would be visible.

When you first load the site, you are asked to enter your name, which is stored in page with ```sessionStorage```. We did this so that when you go to the private room, you are not asked for your name again. We used an If statement in the private JS code to check if the username is saved on ```sessionStorage``` and to ask for it if it is not found : 
```
//username saved from public, if not then ask for a username
let username;
username = sessionStorage.getItem("username");

if (username) {
  console.log("username exists " + username);
} else {
  username = window.prompt("enter your name");
  console.log("username :", username);
  sessionStorage.setItem("username : ", username);
}
```

The username which is stored in ```sessionStorage``` is stored in a variable ```username```, and we use this variable to display the names onto the p5 canvas in draw:
```
  push();
  strokeWeight(0);
  text(username, 10, 390);
  pop();
```
We used a ```push() and pop()``` to change the ``` strokeWeight ``` to zero so the text is readable. 

## Challenges and Solutions 
Having not worked with databases before, we ran into a few challenges while working with NEDB. 

One of our challenges was sorting the drawings into the public and private pages, and also only displaying private drawings in their corresponding rooms.

We did this by putting our post button code into a function called ```onButtonPress(publicOrPrivate, themeName)``` which returns two parameters, ```publicOrPrivate``` and ```themeName```. 

On the private app.js it looks like this:
``` onButtonPress("private", roomName);```

And on public app.js it looks like this:
```onButtonPress("public" , "");```

The two parameters are saved to the img object, and are then sorted with ```db.find``` in ```index.js``` in two different ```GET``` requests, one for public and one for private:
```
app.get("/publicimages", (req, res) => {
  db.find({ type: 'public' })
    .sort({ updateAt: -1 })
    .exec(function (err, docs) {
      if (err) {
        res.json({ task: "task failed" });
      } else {
        let obj = { imgs: docs };
        res.json(obj);
      }
    });
});

app.get("/privateimages", (req, res) => {
  db.find({ $and:[{type: 'private'}, {theme:req.query.room}]  }) 
    .sort({ updateAt: -1 })
    .exec(function (err, docs) {
      if (err) {
        res.json({ task: "task failed" });
      } else {
        let obj = { imgs: docs };
        res.json(obj);
      }
    });
});
```
The solution to sorting private drawings by theme name was ``` $and:[{type: 'private'}, {theme:req.query.room}] ``` which makes sure to get images from the DB only if they are from private and have the same name. 

We also had some issues getting the like button to work. At first, the likes would refresh every time the ```displayImgs()``` function as the likes were saved there. To solve this, we had to add a like component to the img object, and initialized it to 0 in the object itself. The image object is made inside of the ```onButtonPress``` function, which is only called when the post button is clicked, which solved the issue of the likes refreshing to 0. 

## Next Steps
The site is working well right now, but it would be better if the images were posted in real time with sockets rather than every two seconds. 

We could also add more features to the drawing interface, such as brush and eraser sizes, undo and redo buttons, and giving users the ability to delete drawings once they are posted. Another suggestion that we got after getting feedback from our classmates was being able to edit drawings once they are posted. 

One more thing that would be a great addition is making the site mobile-friendly. Right now the website works best on laptops, so redesigning the layout for mobile would make it more easily accessible, and it would also be easier to draw on a phone with your finger than with a mouse/mousepad. 

## Contributions

### Fatema:
This project was definitely a learning process and experience. The end result was very rewarding and I feel like I have a much more clear understanding of how databases work specifically with nedb and sockets. I am now more familiar and confident with the different ways they can be used, implemented, and the many possibilities they hold. Working in pairs was a very nice and enjoyable experience.  Toomie and I wrote the code together, we were either in person or on a very long zoom call. Writing the code together was extremely helpful! Because it was easier to catch minor errors and mistakes in the code. It was easier to find solutions to code issues when we were working together as we would discuss ways of solving it. We contributed on all parts of the project all the way from planning to technicalities and styling. At some points we split tasks in order to finish on time. Overall it was a fun and insightful project!

### Toomie:
This project has really helped me learn a lot about working with databases and how to store and get information from them. Although we had such a short time to work on this project, it was very rewarding to have it work out well in the end. Fatema and I worked together most of the time - we discussed possible ideas and settled on this one. We planned out the wireframes and information flow together, and once we started coding we found that writing the code together really helped us get things done and understand things better. We found errors, typos and came up with solutions much faster while working together, and we consulted each other when making changes to the styling or code. We worked on glitch sometimes, but mostly we screenshared on zoom and sent each other the code through google drive, or worked together in person. We also split some tasks between us due to time constraints, but overall the project was mostly collaborative and a very positive experience! 

## References

* [Convert An Image To A DataURL or Base64 String Using JavaScript](https://pqina.nl/blog/convert-an-image-to-a-base64-string-with-javascript/#fetching-the-image-source)

* [Nedb Documentaion](https://github.com/louischatriot/nedb#logical-operators-or-and-not-where)

* [P5.js Reference](https://p5js.org/reference/)

* [Class Notes and Examples](https://github.com/MathuraMG/ConnectionsLab-NYUAD)

* [sessionStorage] (https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
* [Fonts] (https://fonts.google.com)



