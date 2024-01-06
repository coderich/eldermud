// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Body = Matter.Body,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create({
  gravity: { scale: 0 },
});

// Create a canvas manually
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 800;

document.body.appendChild(canvas);
// create a renderer
var render = Render.create({
  canvas,
  // element: document.body,
  engine,
  options: {
    wireframes: false,
  }
});

// create two boxes and a ground
var player1 = Bodies.circle(200, 200, 40, { mass: 1 });
var player2 = Bodies.circle(300, 200, 40, { mass: 10 });
console.log(player1);
// var ground = Bodies.rectangle(400, 610, 300, 600, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [player1, player2]);

// Render the world
Render.run(render);

// run the engine
Runner.run(engine);

Events.on(engine, 'collisionStart', (event) => {
  console.log(event);
});

Body.applyForce(player1, player1.position, { x: 0.01, y: 0 });

// setInterval(() => {
//   // Body.setPosition(player1, { x: player1.position.x + 1, y: player1.position.y });
//   Body.applyForce(player1, player1.position, { x: 0.1, y: 0 });
//   // Render.world(render);
// }, 100);
