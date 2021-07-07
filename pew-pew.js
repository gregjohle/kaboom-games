kaboom({
  global: true,
  width: 640,
  height: 640,
  canvas: document.getElementById("pew-pew"),
  scale: 1,
  clearColor: [0, 0, 0, 1],
});

loadSprite("ship", "./sprites/ship.png");

scene("main", () => {
  layers(["obj", "ui"], "obj");

  const ship = add([sprite("ship"), pos(width() / 2, 580), scale(0.09)]);

  keyDown("left", () => {
    player.move(-player.speed, 0);
  });

  add([text("Score: ", 16), layer("ui"), pos(5, 5), "score-label"]);

  const score = add([
    pos(110, 5),
    text("0", 16),
    layer("ui"),
    {
      value: 0,
    },
  ]);

  add([text("Health: ", 16), layer("ui"), pos(500, 5), "score-label"]);

  const health = add([
    pos(620, 5),
    text("5", 16),
    layer("ui"),
    {
      value: 5,
    },
  ]);
});

scene("gameOver", (score) => {
  add([
    text("Game Over", 36),
    pos(width() / 2, (height() - 20) / 2),
    origin("center"),
    color(1, 0, 0, 1),
  ]);

  add([
    text(`Score: ${score}`, 24),
    pos(width() / 2, (height() + 40) / 2),
    origin("center"),
    color(1, 1, 1, 1),
  ]);

  keyPress("space", () => {
    go("main");
  });
});

start("main");
