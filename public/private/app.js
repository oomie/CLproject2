let socket = io("/privateSpace");


let roomName = window.prompt(
  "if you're creating a room, enter a theme for your room! \n if you're joining a room, just enter the theme name!"
);
console.log("ROOM :", roomName);

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

let username;
username = sessionStorage.getItem("username");

if (username) {
  console.log("username exists " + username);
} else {
  username = window.prompt("enter your name");
  console.log("username :", username);
  sessionStorage.setItem("username : ", username);
}

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.id("my-canvas");
  canvas.position(975, 80);
  background(255, 255, 255);
  colorPicker = createColorPicker("black");
  colorPicker.position(1250, 495);
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
  console.log("hi");
}

function brush() {
  stroke(colorPicker.color());
  strokeWeight(4);
  line(mouseX, mouseY, pmouseX, pmouseY);
}
