kaboom({
  global: true,
  width: 640,
  height: 640,
  canvas: document.getElementById("pew-pew"),
  scale: 1,
  clearColor: [0, 0, 0, 1],
});

loadSprite("ship", "./sprites/ship.png");
loadSprite("boss", "./sprites/boss.png");
loadSound("pew", "./sounds/pew-pew.mp3");
loadSound("boss-pew", "./sounds/baddy-pew.mp3");
loadSound("ship-damage", "./sounds/ship-damage.mp3");
loadSound("ship-explode", "./sounds/ship-explode.mp3");

function spawnBullet(p) {
  add([rect(2, 6), pos(p), origin("center"), color(0.5, 0.5, 1), "bullet"]);
}

function spawnBadBullet(p) {
  add([rect(4, 12), pos(p), origin("center"), color(1, 0, 0), "bad-bullet"]);
}

scene("main", () => {
  layers(["obj", "ui"], "obj");

  const BULLET_SPEED = 320;
  const BAD_BULET_SPEED = 250;
  let BOSS_SPEED = -150;
  let CURRENT_SPEED = BOSS_SPEED;
  let BOSS_HEALTH = 1000;

  const ship = add([
    sprite("ship"),
    pos(width() / 2, 580),
    scale(0.09),
    {
      speed: 250,
    },
    "ship",
  ]);

  const shipPos = add([
    rect(5, 200),
    pos(ship.pos.add(20, -500)),
    color(0, 0, 0),
    "shipPos",
  ]);

  shipPos.action(() => {
    shipPos.pos.x = ship.pos.x;
  });

  const boss = add([sprite("boss"), pos(width() / 2, 20), scale(0.25), "boss"]);

  function bossDirection() {
    if (boss.pos.x < 0) {
      CURRENT_SPEED = -BOSS_SPEED;
    } else if (boss.pos.x > width() - 150) {
      CURRENT_SPEED = BOSS_SPEED;
    }
    return boss.move(CURRENT_SPEED, 0);
  }

  collides("shipPos", "boss", () => {
    spawnBadBullet(boss.pos.add(75, 100));
    play("boss-pew", {
      volume: 0.5,
      speed: 0.8,
    });
  });

  collides("bad-bullet", "ship", () => {
    camShake(5);
    health.value--;
    health.text = health.value;
    play("ship-damage", {
      volume: 0.5,
    });
    if (health.value === 0) {
      play("ship-explode");
      go("gameOver", score.value);
    }
  });

  boss.action(() => {
    bossDirection();
  });

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

  action("bad-bullet", (bb) => {
    bb.move(0, BAD_BULET_SPEED);

    if (bb.pos.y > height()) {
      destroy(bb);
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

  collides("bullet", "boss", (b) => {
    camShake(1);
    destroy(b);
    BOSS_HEALTH = BOSS_HEALTH - 1;
    score.value++;
    score.text = score.value;
    if (BOSS_HEALTH === 0) {
      go("gameOver", score.value);
    }
  });

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
