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
    context = canvas.getContext('2d'),
    initialSetup = true;

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

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };

  var insertCops = function() {

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
      //sentry: true,
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
      //sentry: true,
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
      //sentry: true,
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
      //sentry: true,
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
      start: [0, height/2],
      //sentry: true,
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
      start: [width, height/2],
      //sentry: true,
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
      start: [width/2, 0],
      //sentry: true,
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
      start: [width/2, height],
      //sentry: true,
      type: 'cop'
    }));

    // var count = 40;
    //
    // for(var i=0; i < count ; i++){
    //
    //   entities.push(new Body({
    //     borderX: {
    //       min: 0,
    //       max: width
    //     },
    //     borderY: {
    //       min: 0,
    //       max: height
    //     },
    //     start: [i * width/count, 0],
    //     sentry: true,
    //     type: 'cop'
    //   }));
    //
    //   entities.push(new Body({
    //     borderX: {
    //       min: 0,
    //       max: width
    //     },
    //     borderY: {
    //       min: 0,
    //       max: height
    //     },
    //     start: [i * width/count, height],
    //     sentry: true,
    //     type: 'cop'
    //   }));
    //
    //   entities.push(new Body({
    //     borderX: {
    //       min: 0,
    //       max: width
    //     },
    //     borderY: {
    //       min: 0,
    //       max: height
    //     },
    //     start: [0, i * height/count],
    //     sentry: true,
    //     type: 'cop'
    //   }));
    //
    //   entities.push(new Body({
    //     borderX: {
    //       min: 0,
    //       max: width
    //     },
    //     borderY: {
    //       min: 0,
    //       max: height
    //     },
    //     start: [width, i * height/count],
    //     sentry: true,
    //     type: 'cop'
    //   }));
    // }
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

    var self = [],
      other = [],
      vec = [],
      mag;

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

      self = rob.getPosition();
      //calculate vector first
      vec = [0, 0];

      _.forEach(cops, function(cop) {
        other = cop.getPosition();
        mag = helper.getDistance(self, other);
        vec[0] += (self[0] - other[0]) / (mag * mag);
        vec[1] += (self[1] - other[1]) / (mag * mag);
      });

      rob.step(helper.normalizeVector(vec));

    });

    _.forEach(cops, function(cop) {

      self = cop.getPosition();
      //calculate vector first
      vec = [0, 0];

      _.forEach(robbers, function(rob) {
        other = rob.getPosition();
        mag = helper.getDistance(self, other);
        vec[0] += (self[0] - other[0]) / (mag * mag);
        vec[1] += (self[1] - other[1]) / (mag * mag);
        if (helper.getDistance(self, other) < rob.getRadius() * 2)
          rob.setType("cop");
      });
      cop.step(helper.normalizeVector([-1 * vec[0], -1 * vec[1]]));
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
    var spacer = 150;
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
