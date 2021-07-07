kaboom({
  global: true,
  width: 640,
  height: 640,
  canvas: document.getElementById("snek"),
  scale: 2,
});

screen("main", () => {
  add([text("Oh, Hi Mark", 32), pos(100, 100)]);
});

StaticRange("main");
