let socket = io("/privateSpace");

let roomName = window.prompt("enter a theme for your room!");
console.log("ROOM :", roomName)


socket.on("connect", () => {
    console.log("Connection established to server via socket")
    let roomData = {
        name: roomName
    }
    socket.emit("roomJoin", roomData);
    document.getElementById("theme").innerHTML = roomName;
});



function setup() {
    let canvas = createCanvas(400, 400);
    canvas.id("my-canvas");
    canvas.position(975, 80)
    background(255, 255, 255);
    stroke(0);
    strokeWeight(4);
}

function draw() {
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
    stroke(0);
    strokeWeight(4);
    line(mouseX, mouseY, pmouseX, pmouseY);
}