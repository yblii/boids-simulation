const width = 400;
const height = 400;

let myp5 = new p5(( sketch ) => {
  sketch.setup = () => {
    sketch.createCanvas(width, height);
  };

  sketch.draw = () => {
    sketch.background(0);
  };
});