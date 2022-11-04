let socket = io("/publicSpace");

socket.on("connect", () => {
    console.log("Connection established to server via socket")
});

window.addEventListener("load", ()=>{
    let publicBtn = document.getElementById("public-btn");
    let roomPage = document.getElementById("Rooms");
    publicBtn.addEventListener("click", () => {
        roomPage.style.display = "none";
    });
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
