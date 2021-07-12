kaboom({
  global: true,
  width: 640,
  height: 640,
  canvas: document.getElementById("pew-pew"),
  scale: 1,
  clearColor: [0, 0, 0, 1],
});

loadSprite("ship", "./sprites/ship.png");
loadSound("pew", "./sounds/pew-pew.mp3");

function spawnBullet(p) {
  add([
    rect(2, 6),
    pos(p),
    origin("center"),
    color(0.5, 0.5, 1),
    // strings here means a tag
    "bullet",
  ]);
}

scene("main", () => {
  layers(["obj", "ui"], "obj");

  const BULLET_SPEED = 320;

  const ship = add([
    sprite("ship"),
    pos(width() / 2, 580),
    scale(0.09),
    {
      speed: 250,
    },
  ]);

  keyDown("left", () => {
    ship.move(-ship.speed, 0);
    if (ship.pos.x < 0) {
      ship.pos.x = width();
    }
  });

  keyDown("right", () => {
    ship.move(ship.speed, 0);
    if (ship.pos.x > width()) {
      ship.pos.x = 0;
    }
  });

  keyPress("space", () => {
    spawnBullet(ship.pos.add(10, 0));
    spawnBullet(ship.pos.add(30, 0));
    play("pew", {
      volume: 0.5,
      speed: 1,
      detune: 600,
    });
  });

  action("bullet", (b) => {
    b.move(0, -BULLET_SPEED);

    if (b.pos.y < 0) {
      destroy(b);
    }
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
