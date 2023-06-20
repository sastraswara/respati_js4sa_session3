let hh, clap, kick; // audio file container
let hPat, cPat, kPat; // array of 1 and 0
let hPhrase, cPhrase, kPhrase; // phrases; how pattern is interpreted
let seq;
let toggleStart;
let beatLength;
let cnv;
let sPat; // sequencer

function setup() {
  cnv = createCanvas(400, 100);
  cnv.mousePressed(canvasClicked);
  
  hh = loadSound("assets/hh.wav");
  clap = loadSound("assets/clap.wav");
  kick = loadSound("assets/kick.wav");
  
  /* Another way to write function
  () => { }
  */
  beatLength = 16;
  
  hPat = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  cPat = [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0];
  kPat = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0];
  
  sPat = [];
  for (let i = 0; i < beatLength; i++) {
    sPat.push(i);
  }
  
  hPhrase = new p5.Phrase(
    "hh",
    (time) => { hh.play(time); },
    hPat
  );
  cPhrase = new p5.Phrase(
    "clap",
    (time) => { clap.play(time); },
    hPat
  );
  kPhrase = new p5.Phrase(
    "kick",
    (time) => { kick.play(time); },
    hPat
  );
  
  seq = new p5.Part();
  seq.addPhrase(hPhrase);
  seq.addPhrase(cPhrase);
  seq.addPhrase(kPhrase);
  
  // sequence stepper
  seq.addPhrase("seq", sequence, sPat);
  // the callback function is given two arguments: time and index value of the array
  
  seq.setBPM(80);
  
  toggleStart = createButton("Start/Stop")
  .position(10, height+10)
  .mousePressed(() => {
    if (!seq.isPlaying) {
      seq.loop();    
      toggleStart.html("Playing");
    } else {
      seq.stop();
      toggleStart.html("Stopped");
    }
  });
  
  drawMatrix();
  drawPlayhead();
}


function draw() {
  
}


function canvasClicked() {
  let rowClicked = floor(mouseY/height * 3);
  let columnClicked = floor(mouseX/width * beatLength);

  if (rowClicked == 0) {
    hPat[columnClicked] = invert(hPat[columnClicked]);
  } else if (rowClicked == 1) {
    cPat[columnClicked] = invert(cPat[columnClicked]);
  } else if (rowClicked == 2) {
    kPat[columnClicked] = invert(kPat[columnClicked]);
  }
  
  drawMatrix();
}

function invert(inputBit) {
  if (inputBit == 0) { return 1; } else { return 0; }
}

function drawMatrix () {
  background(220);
  
  stroke("black");
  fill("white");
  
  // vertical grid
  for (let i = 0; i < beatLength; i++) {
    line(i*width/beatLength, 0, i*width/beatLength, height);
  }
  // horizontal grid
  for (let j = 0; j < 3; j++) {
    line(0, j*height/3, width, j*height/3);
  }
  
  for (let i = 0; i < beatLength; i++) {
    if (hPat[i] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, 1/6*height, 10);   
    }
    if (cPat[i] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, 1/2*height, 10);    
    }
    if (kPat[i] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, 5/6*height, 10);      
    }
  }
}

function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
    drawPlayhead(beatIndex);
  }, time*1000); // callback function, time(ms)
}

function drawPlayhead (beatIndex) {
  // rectangle
  stroke("red");
  fill(255, 0, 0, 30);
  rect(width/beatLength*(beatIndex-1), 0, width/beatLength, height);
}