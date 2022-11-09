let socket = io("/publicSpace");
// let username = window.prompt("enter your name");
// console.log("username :", username);

socket.on("connect", () => {
  console.log("Connection established to server via socket");
});

// let base64;
let username;

window.addEventListener("load", () => {

  //   setInterval(() => {     //get imgs from server every 2 seconds
  //     displayImgs();
  //   }, 2000);

  let publicBtn = document.getElementById("public-btn");
  let roomPage = document.getElementById("Rooms");
  publicBtn.addEventListener("click", () => {
    // let username = window.prompt("enter your name");
    // console.log("username :", username);
    roomPage.style.display = "none";
  });

  let uname = window.prompt("enter your name!");
  sessionStorage.setItem("username", uname);
  username = sessionStorage.getItem("username");
  console.log(username);

  //   let postButton = document.getElementById("post-btn");
  //   let getBase64StringFromDataURL = (dataURL) =>
  //     dataURL.replace('data:', '').replace(/^.+,/, '');

  //   postButton.addEventListener("click", (e) => {     // on form submission
  //     let canvas = document.getElementById("my-canvas");

  //     // Convert canvas to dataURL and log to console
  //     let dataURL = canvas.toDataURL('image/jpeg', 0.5);

  //     // Convert to Base64 string
  //     base64 = getBase64StringFromDataURL(dataURL);

  //     e.preventDefault();
  //     console.log("img sent!", base64);

  //     let imgObj = {
  //       "img": base64,
  //       "updateAt": new Date()
  //     };

  //     let imgObjJSON = JSON.stringify(imgObj);
  //     console.log(imgObj);

  //     fetch('/image', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: imgObjJSON
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         console.log(data)
  //       });
  //   });
}); //load

// function displayImgs() {
//   fetch('/images')
//     .then(res => res.json())
//     .then(data => {
//       console.log(data)
//       document.getElementById("img-list").innerHTML = "";
//       let allimgs = data.imgs;
//       allimgs.forEach((drawing) => {
//         let imgcontainer = document.createElement('li');
//         let imgElt = document.createElement('img');
//         imgElt.src = "data:image/png;base64," +  drawing.img;

//         //append elts as per their heirarchy
//         imgcontainer.appendChild(imgElt);
//         document.getElementById("img-list").appendChild(imgcontainer);
//       })
//       //clear out the HTML div that contains all the messages
//       //add all the new messages that we have
//     })
// }


//canvas:

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
