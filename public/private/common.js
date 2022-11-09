let base64;
let likes = 0;
let imgObjJSON;

window.addEventListener("load", () => {

  imgLikes();

    setInterval(() => {     //get imgs from server every 2 seconds
      displayImgs();
    }, 2000);

// let publicOrprivate;

// if(public){
//   publicOrprivate = "public"
// } else {
//   publicOrprivate = "private"
// }

let postButton = document.getElementById("post-btn");
  let getBase64StringFromDataURL = (dataURL) =>
    dataURL.replace('data:', '').replace(/^.+,/, '');

  postButton.addEventListener("click", (e) => {     // on form submission
    let canvas = document.getElementById("my-canvas");

    // Convert canvas to dataURL and log to console
    let dataURL = canvas.toDataURL('image/jpeg', 0.5);

    // Convert to Base64 string
    base64 = getBase64StringFromDataURL(dataURL);

    e.preventDefault();
    console.log("img sent!", base64);

    let imgObj = {
      "img": base64,
      "like" : 0,
      "updateAt": new Date(),
      //"type" : publicOrprivate
    };

    imgObjJSON = JSON.stringify(imgObj);
    console.log(imgObj);

    fetch('/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: imgObjJSON
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      });
  });
}); //load

function displayImgs() {
  fetch('/images')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      document.getElementById("img-list").innerHTML = "";
      let allimgs = data.imgs;
      allimgs.forEach((drawing) => {
        let imgcontainer = document.createElement('li');
        let imgElt = document.createElement('img');
        imgElt.src = "data:image/png;base64," +  drawing.img;
        let buttonElt = document.createElement("button");
        buttonElt.innerHTML = "❤️";
        //likes = drawing.like;
        let likestext = document.createElement('p');
        likestext.innerHTML = drawing.like;
        buttonElt.addEventListener("click", () => {
          //likes ++;
          drawing.like ++ ;
          console.log(drawing.like);
          // fetch('/imagelike', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: imgObjJSON
          // })
          //   .then(res => res.json())
          //   .then(data => {
          //     console.log(data)
          //   });
        })

        //append elts as per their heirarchy
        imgcontainer.appendChild(imgElt);
        imgcontainer.appendChild(buttonElt);
        imgcontainer.appendChild(likestext);
        document.getElementById("img-list").appendChild(imgcontainer);
      })
    })
}

function imgLikes () {
  fetch('/imagelike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: imgObjJSON
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    });

}

// db.update({"_id" : data._id}, {"like" : data.like}, {}, () => {})

// let username = window.prompt("enter your name");
// console.log("username :", username);

// function setup() {
//   let canvas = createCanvas(400, 400);
//   canvas.id("my-canvas");
//   canvas.position(975, 80);
//   background(255, 255, 255);
//   colorPicker = createColorPicker("black");
//   colorPicker.position(1250,495);
//   colorPicker.input(brush);
//   strokeWeight(4);
 
// }

// function draw() {
//   push();
//   strokeWeight(0);
//   text(username, 10, 390);
//   pop();
//   if (mouseIsPressed) {
//       line(mouseX, mouseY, pmouseX, pmouseY);
//   }
// }

// function clearCanvas() {
//   background(255);
// }

// function eraser() {
//   stroke(255, 255, 255);
//   strokeWeight(50);
//   line(mouseX, mouseY, pmouseX, pmouseY);
//   console.log("hi");
// }

// function brush() {
//   stroke(colorPicker.color());
//   strokeWeight(4);
//   line(mouseX, mouseY, pmouseX, pmouseY);
// }
