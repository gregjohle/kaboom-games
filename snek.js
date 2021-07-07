kaboom({
  global: true,
  width: 640,
  height: 640,
  canvas: document.getElementById("snek"),
  scale: 1,
  clearColor: [0, 0, 0, 1],
});

var speed = 20;
var direction = vec2(0, 0);
let accumTime = 0;
let difficulty = 0.5;

function controls() {
  return {
    add() {
      keyPress("left", () => {
        this.movement.left();
      });
      keyPress("right", () => {
        this.movement.right();
      });

      keyPress("up", () => {
        this.movement.up();
      });

      keyPress("down", () => {
        this.movement.down();
      });
    },
  };
}

function movement() {
  return {
    update() {
      accumTime += dt();

      if (accumTime < difficulty) {
        return;
      }

      accumTime = 0;

      if (!this.pos) {
        return;
      }
      this.pos.x += direction.x * speed;
      this.pos.y += direction.y * speed;

      const child = this.getChild();
      if (!child) {
        return;
      }
      child.moveUpdate(this.pos.x, this.pos.y);
    },
    movement: {
      left() {
        direction.x = -1;
        direction.y = 0;
      },
      right() {
        direction.x = 1;
        direction.y = 0;
      },
      up() {
        direction.x = 0;
        direction.y = -1;
      },
      down() {
        direction.x = 0;
        direction.y = 1;
      },
    },
  };
}

function getRandomPosition() {
  const totalTilesX = Math.floor(width() / 20);
  const totalTilesY = Math.floor(height() / 20);

  const x = Math.floor(rand(0, totalTilesX)) * 20;
  const y = Math.floor(rand(0, totalTilesY)) * 20;

  return vec2(x, y);
}

function spawnFood() {
  return {
    spawn() {
      wait(0.5, () => {
        add([
          pos(getRandomPosition()),
          rect(20, 20),
          color(1, 0, 0, 1),
          "food",
        ]);
      });
    },
  };
}

function link() {
  let child;
  let isNew = true;
  const nextPos = vec2(0, 0);

  return {
    add() {
      nextPos.x = this.pos.x;
      nextPos.y = this.pos.y;
    },
    getChild() {
      return child;
    },
    setChild(c) {
      child = c;
    },
    moveUpdate(x, y) {
      const pos = nextPos.clone();

      nextPos.x = x;
      nextPos.y = y;

      this.pos.x = pos.x;
      this.pos.y = pos.y;

      if (!child) {
        return;
      }

      isNew = false;

      child.moveUpdate(pos.x, pos.y);
    },
    isNew() {
      return isNew;
    },
  };
}

scene("main", () => {
  layers(["obj", "ui"]);
  const spawner = add([spawnFood()]);
  let head = add([
    pos(getRandomPosition()),
    rect(20, 20),
    color(0, 1, 0, 1),
    movement(),
    controls(),
    link(),
    "head",
  ]);

  let end = head;

  head.action(() => {
    if (head.pos.x >= width()) {
      go("gameOver", score.value);
    } else if (head.pos.x < 0) {
      go("gameOver", score.value);
    } else if (head.pos.y >= height()) {
      go("gameOver", score.value);
    } else if (head.pos.y < 0) {
      go("gameOver", score.value);
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

  spawner.spawn();

  overlaps("head", "food", (head, food) => {
    destroy(food);
    camShake(2);
    score.value++;
    score.text = score.value;
    if (difficulty > 0) {
      difficulty = difficulty - 0.01;
    }

    const newChild = add([
      pos(end.pos.x, end.pos.y),
      rect(20, 20),
      color(0, 1, 0, 1),
      link(),
      "body",
    ]);
    end.setChild(newChild);
    end = newChild;
    spawner.spawn();
  });

  overlaps("head", "body", (head, body) => {
    if (body.isNew()) {
      return;
    }
    go("gameOver", score.value);
  });
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
