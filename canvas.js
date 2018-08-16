var canvas = document.getElementById("myCanvas");
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight;
var ctx = canvas.getContext("2d");

function Key(colorArray, x, y, w, h) {
    this.baseColorArray = colorArray;
    this.colorArray = colorArray;
    this.baseColor = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
    this.currentColor = this.baseColor;
    this.location = {x : x, y : y, w : w, h : h};
    this.isBlack = true;

    this.play = function() {
        this.currentColor = this.baseColor;
        this.colorArray = this.baseColorArray.slice();
        this.isBlack = false;
    }

    this.draw = function(context) {
        if (!this.isBlack) {
            context.fillStyle = this.currentColor;
            context.fillRect(this.location.x, this.location.y, this.location.w, this.location.h);
            this.fade();
        }
    };

    this.fade = function() {
        this.isBlack = true;
        for (var i=0; i < this.colorArray.length; i++) {
            if (this.colorArray[i] > 0) {
                this.isBlack = false;
                this.colorArray[i] -= 3;
            }
            else if (this.colorArray[i] < 0) {
                this.colorArray[i] = 0;
            }
            
        }
        this.currentColor = `rgb(${this.colorArray[0]}, ${this.colorArray[1]}, ${this.colorArray[2]})`;
    }
}

var colors = [
    [255, 0, 0],
    [255, 15, 15],
    [255, 30, 30],
    [255, 45, 45],
    [255, 60, 60],
    [255, 75, 75],
    [255, 90, 90],
    [255, 105, 105],
    [255, 120, 120],
    [255, 135, 135],
    [255, 150, 150],
    [255, 165, 165],
    [255, 180, 180],
    [255, 195, 195],
    [255, 210, 210],
    [15, 255, 225],
    [30, 255, 240],
    [45, 255, 0],
    [60, 255, 15],
    [75, 255, 30],
    [90, 255, 45],
    [105, 255, 60],
    [120, 255, 75],
    [135, 255, 90],
    [150, 255, 105],
    [165, 255, 120],
    [180, 255, 135],
    [195, 255, 150],
    [210, 255, 165],
    [225, 15, 255],
    [240, 30, 255],
    [0, 45, 255],
    [15, 60, 255],
    [30, 75, 255],
    [45, 90, 255],
    [60, 105, 255],
    [75, 120, 255],
    [90, 135, 255],
    [105, 150, 255],
    [120, 165, 255],
    [135, 180, 255],
    [150, 195, 255],
    [165, 210, 255],
    [255, 225, 15],
    [255, 240, 30],
    [255, 0, 45],
    [255, 15, 60],
    [255, 30, 75],
    [255, 45, 90],
    [255, 60, 105],
    [255, 75, 120],
    [255, 90, 135],
    [255, 105, 150],
    [255, 120, 165],
    [255, 135, 180],
    [255, 150, 195],
    [255, 165, 210],
    [15, 255, 225],
    [30, 255, 240],
    [45, 255, 0],
    [60, 255, 15],
    [75, 255, 30],
    [90, 255, 45],
    [105, 255, 60],
    [120, 255, 75],
    [135, 255, 90],
    [150, 255, 105],
    [165, 255, 120],
    [180, 255, 135],
    [195, 255, 150],
    [210, 255, 165],
    [225, 15, 255],
    [240, 30, 255],
    [0, 45, 255],
    [15, 60, 255],
    [30, 75, 255],
    [45, 90, 255],
    [60, 105, 255],
    [75, 120, 255],
    [90, 135, 255],
    [105, 150, 255],
    [120, 165, 255],
    [135, 180, 255],
    [150, 195, 255],
    [165, 210, 255],
    [255, 225, 15],
    [255, 240, 30],
    [255, 0, 45],
    [255, 15, 60],
    [255, 30, 75],
    [255, 45, 90],
    [255, 60, 105],
    [255, 75, 120],
    [255, 90, 135],
    [255, 105, 150],
    [255, 120, 165],
    [255, 135, 180],
    [255, 150, 195],
    [255, 165, 210],
    [15, 255, 225],
    [30, 255, 240],
    [45, 255, 0],
    [60, 255, 15],
    [75, 255, 30],
    [90, 255, 45],
    [105, 255, 60],
    [120, 255, 75],
    [135, 255, 90],
    [150, 255, 105],
    [165, 255, 120],
    [180, 255, 135],
    [195, 255, 150]
]
var keys = []

function init() {
    for (var i=10; i >= 0; i--) {
        for (var j=0; j < 8; j++) {
            var color = colors[i * 8 + j];
            var key = new Key(color, j * canvas.width / 8, i * canvas.height / 10, canvas.width / 8, canvas.height / 10);
            keys.push(key);
        }
    }
    window.requestAnimationFrame(draw);
}

function draw() {
    for (var i=0; i < keys.length; i++) {
        keys[i].draw(ctx);
    }
    window.requestAnimationFrame(draw);
}

init();

var synth = new Tone.PolySynth(20).toMaster()

// make sure you set the tempo before you schedule the events
Tone.Transport.bpm.value = presto.header.bpm

// pass in the note events from one of the tracks as the second argument to Tone.Part 
var midiPart = new Tone.Part(function(time, note) {
    //use the events to play the synth
    synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)
    keys[note.midi - 21].play();
}, presto.tracks[1].notes).start()

// start the transport to hear the events
Tone.Transport.start()