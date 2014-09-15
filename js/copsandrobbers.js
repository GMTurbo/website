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
    robbers = [],
    entities = [];

  var setup = function() {

    cops = [];
    robbers = [];
    entities = [];

    $(canvas).attr('width', width).attr('height', height);

    insertCops();

    var count = density * width;

    for (var i = 0; i < count; i++) {

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: helper.getRandomPnt(width, height),
        type: 'robber'
      }));
    }

    updateSystem();
  };

  var insertCops = function(){

    entities.push(new Body({
      borderX: {
        min: 0,
        max: width
      },
      borderY: {
        min: 0,
        max: height
      },
      start: [0, 0],
      sentry: true,
      type: 'cop'
    }));

    entities.push(new Body({
      borderX: {
        min: 0,
        max: width
      },
      borderY: {
        min: 0,
        max: height
      },
      start: [0, height],
      sentry: true,
      type: 'cop'
    }));

    entities.push(new Body({
      borderX: {
        min: 0,
        max: width
      },
      borderY: {
        min: 0,
        max: height
      },
      start: [width, 0],
      sentry: true,
      type: 'cop'
    }));

    entities.push(new Body({
      borderX: {
        min: 0,
        max: width
      },
      borderY: {
        min: 0,
        max: height
      },
      start: [width, height],
      sentry: true,
      type: 'cop'
    }));

    var count = 40;

    for(var i=0; i < count ; i++){

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [i * width/count, 0],
        sentry: true,
        type: 'cop'
      }));

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [i * width/count, height],
        sentry: true,
        type: 'cop'
      }));

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [0, i * height/count],
        sentry: true,
        type: 'cop'
      }));

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [width, i * height/count],
        sentry: true,
        type: 'cop'
      }));
    }
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
      robDeltas = [];

    //get all the robbers
    robbers = _.filter(entities, function(ent) {
      return ent.getType() == 'robber';
    });

    //get all the cops
    cops = _.filter(entities, function(ent) {
      return ent.getType() == 'cop';
    });

    if (robbers.length === 0) {
      setup();
      return;
    }

    _.forEach(robbers, function(rob) {

      cur = rob.getPosition();
      //calculate vector first
      vec = [0, 0];

      _.forEach(cops, function(cop) {
        prev = cop.getPosition();
        mag = helper.getDistance(cur, prev);
        vec[0] += (cur[0] - prev[0]) / (mag * mag);
        vec[1] += (cur[1] - prev[1]) / (mag * mag);
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
        vec[0] += (cur[0] - prev[0]) / (mag * mag);
        vec[1] += (cur[1] - prev[1]) / (mag * mag);
        if (helper.getDistance(cop.getPosition(), rob.getPosition()) < rob.getRadius()*2)
          rob.setType("cop");
      });

      copDeltas.push(vec);

    });

    _.forEach(copDeltas, function(delta, index) {
      cops[index].step(helper.normalizeVector([-1 * delta[0], -1 * delta[1]]));
    });

    _.forEach(robDeltas, function(delta, index) {
      robbers[index].step(helper.normalizeVector(delta));
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
    var spacer = 100;
    return [_.random(spacer, xRange - spacer), _.random(spacer, yRange - spacer)];
  },
  normalizeVector: function(vec) {
    var mag = Math.sqrt((vec[0] * vec[0]) + (vec[1] * vec[1]));
    vec[0] /= mag;
    vec[1] /= mag;
    return vec;
  },
  getDistance: function(pnt1, pnt2) {
    return Math.sqrt(
      Math.pow(pnt2[0] - pnt1[0], 2) +
      Math.pow(pnt2[1] - pnt1[1], 2)
    );
  }
};
