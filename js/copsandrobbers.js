$(document).ready(function() {

  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var system = new System({
    width: $('#space').width(),
    height: $('#space').height(),
    density: $('#space').width() * 0.01,
    canvas: document.getElementById('space-content'),
    reqAnimationFrame: window.requestAnimationFrame
  });

  system.begin();

  $(window).resize(function() {

    system.resize({
      width: $('#space').width(),
      height: $('#space').height()
    });

  });
});

var System = function(options) {

  options = _.defaults(options, {
    density: 100,
    width: 100,
    height: 100
  });

  if (!options.canvas) {
    console.error("canvas element required for cops and robbas :/");
    return;
  }

  if (!options.reqAnimationFrame) {
    console.error("window.requestAnimationFrame required for cops and robbas :/");
    return;
  }

  var canvas = options.canvas,
    width = options.width,
    height = options.height,
    density = options.density,
    reqFrame = options.reqAnimationFrame,
    context = canvas.getContext('2d');

  var cops = [],
    robbers = [];

  var setup = function() {

    $(canvas).attr('width', width).attr('height', height);

    for (var i = 0; i < density; i++) {

      cops[i] = new Cop({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        }
      });

      cops[i].setPosition(helper.getRandomPnt(width, height));

      robbers[i] = new Robber({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        }
      });

      robbers[i].setPosition(helper.getRandomPnt(width, height));
    }

    updateSystem();
  };

  var resize = function(size) {
    width = size.width;
    height = size.height;
    setup();
  };

  var updateSystem = function() {
    updateEntities();
    drawSystem();
    reqFrame(updateSystem);
  };

  var updateEntities = function() {

    _.forEach(cops, function(cop) {
      cop.step();
    });

    _.forEach(robbers, function(robber) {
      robber.step();
    });
  };

  var drawSystem = function() {

    context.clearRect(0, 0, width, height);

    _.forEach(cops, function(cop) {
      cop.draw(context);
    });

    _.forEach(robbers, function(robber) {
      robber.draw(context);
    });
  };

  return {
    begin: setup,
    resize: resize
  };
};

var helper = {
  getRandomPnt: function(xRange, yRange) {
    return [_.random(xRange), _.random(yRange)];
  }
};
