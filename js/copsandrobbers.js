var System = function(options) {

  options = _.defaults(options, {
    density: 0.1,
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

    cops = [];
    robbers = [];

    $(canvas).attr('width', width).attr('height', height);

    var count = density * width;

    for (var i = 0; i < count; i++) {

      //if ((i % 2) === 0) {
      cops.push(new Cop({
        borderX: {
          min: 10,
          max: width - 10
        },
        borderY: {
          min: 10,
          max: height - 10
        },
        start: helper.getRandomPnt(width, height)
      }));
      //}

      robbers.push(new Robber({
        borderX: {
          min: 10,
          max: width - 10
        },
        borderY: {
          min: 10,
          max: height - 10
        },
        start: helper.getRandomPnt(width, height)
      }));
    }

    //setup sentries

    // for (var i = 0 ; i < width; i+=(width/200)) {
    //   cops.push(new Cop({
    //     borderX: {
    //       min: 10,
    //       max: width
    //     },
    //     borderY: {
    //       min: 10,
    //       max: height
    //     },
    //     sentry: true,
    //     start: [i, 0]
    //   }));
    //
    //   cops.push(new Cop({
    //     borderX: {
    //       min: 10,
    //       max: width
    //     },
    //     borderY: {
    //       min: 10,
    //       max: height
    //     },
    //     sentry: true,
    //     start: [i, height]
    //   }));
    // }
    //
    // for (var i = 0 ; i < height; i+=(height/200)) {
    //   cops.push(new Cop({
    //     borderX: {
    //       min: 10,
    //       max: width
    //     },
    //     borderY: {
    //       min: 10,
    //       max: height
    //     },
    //     sentry: true,
    //     start: [0, i]
    //   }));
    //
    //   cops.push(new Cop({
    //     borderX: {
    //       min: 10,
    //       max: width
    //     },
    //     borderY: {
    //       min: 10,
    //       max: height
    //     },
    //     sentry: true,
    //     start: [width, i]
    //   }));
    // }

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

    var cur = [],
      prev = [],
      vec = [],
      mag,
      copDeltas = [],
      robDeltas = [],
      scale = 1;

    _.forEach(robbers, function(rob) {

      cur = rob.getPosition();
      //calculate vector first
      vec = [0, 0];

      _.forEach(cops, function(cop) {

        prev = cop.getPosition();
        mag = helper.getDistance(cur, prev);
        vec[0] += scale * (cur[0] - prev[0]) / (mag * mag);
        vec[1] += scale * (cur[1] - prev[1]) / (mag * mag);
      });

      robDeltas.push(vec);

    });
    
    _.forEach(cops, function(cop) {

      cur = cop.getPosition();
      //calculate vector first
      vec = [0, 0];

      _.forEach(robbers, function(rob) {
        prev = rob.getPosition();
        mag = helper.getDistance(cur, prev);
        vec[0] += scale * (cur[0] - prev[0]) / (mag * mag);
        vec[1] += scale * (cur[1] - prev[1]) / (mag * mag);
      });

      copDeltas.push(vec);

    });

    copDeltas = helper.normalize(copDeltas);
    robDeltas = helper.normalize(robDeltas);

    _.forEach(copDeltas, function(delta, index) {
      cops[index].step([-delta[0], -delta[1]]);
    });

    _.forEach(robDeltas, function(delta, index) {
      robbers[index].step(delta);
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
  },
  //normalize array to be between 0-1
  normalize: function(arr) {
    var maxX = _.max(arr, function(el) {
      return el[0];
    });
    var maxY = _.max(arr, function(el) {
      return el[1];
    });
    return _.map(arr, function(ent) {
      return [ent[0] / maxX[0], ent[1] / maxY[1]];
    });
  },
  getDistance: function(pnt1, pnt2) {
    return Math.sqrt(
      Math.pow(pnt1[0] - pnt2[0], 2) +
      Math.pow(pnt1[1] - pnt2[1], 2)
    );
  }
};
