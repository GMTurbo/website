var System = function(options) {

  options = _.defaults(options, {
    density: 0.1,
    width: 100,
    height: 100,
    isMobile: false
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
    initialSetup = true,
    isMobile = options.isMobile,
    getRadiusByBrowser = function() {
      return isMobile ? 15 : 6;
    };

  var entities = [];

  var setup = function() {

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
        start: helper.getRandomPnt(width, height, 150),
        type: 'robber',
        radius: getRadiusByBrowser()
      }));
    }

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };

  var insertCops = function() {

    var count = isMobile ? 2 : 3;

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
        start: [i * width / count, 0],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
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
        start: [i * width / count, height],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
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
        start: [0, i * height / count],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
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
        start: [width, i * height / count],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
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

  //this is where the pursuit algo kicks in
  var updateEntities = function() {

    var self = [],
      other = [],
      vec = [],
      mag, withinDistance = 300;

    if (mouseCop && !mcInserted) {
      entities.push(mouseCop);
      mcInserted = true;
    }
    //get all the robbers
    var robbers = _.filter(entities, function(ent) {
      return ent.getType() == 'robber';
    });

    //get all the cops
    var cops = _.filter(entities, function(ent) {
      return ent.getType() == 'cop';
    });

    if (robbers.length === 0) {
      setup();
      return;
    }

    _.forEach(robbers, function(rob) {

      self = rob.getPosition();

      var closestCops = helper.getWithin(withinDistance, self, cops);
      if (closestCops.length == 0)
        closestCops = cops;
      //calculate vector first
      vec = [0, 0];

      _.forEach(closestCops, function(cop) {
        other = cop.getPosition();
        mag = helper.getDistance(self, other);
        vec[0] += (self[0] - other[0]) / (mag * mag);
        vec[1] += (self[1] - other[1]) / (mag * mag);
      });

      rob.step(helper.normalizeVector(vec));

    });

    _.forEach(cops, function(cop) {

      self = cop.getPosition();

      var closestRobbers = helper.getWithin(withinDistance, self, robbers);
      if (closestRobbers.length == 0)
        closestRobbers = robbers;
      //calculate vector first
      vec = [0, 0];

      _.forEach(closestRobbers, function(rob) {
        other = rob.getPosition();
        mag = helper.getDistance(self, other);
        vec[0] += (other[0] - self[0]) / (mag * mag); //reverse vector direction
        vec[1] += (other[1] - self[1]) / (mag * mag); //reverse vector direction
        if (mag < rob.getRadius() * 2)
          rob.setType("cop");
      });

      cop.step(helper.normalizeVector(vec));
    });
  };

  var drawSystem = function() {

    context.clearRect(0, 0, width, height);

    _.forEach(entities, function(ent) {
      ent.draw(context);
    });
  };

  var mouseCop, mcInserted;
  var onMouseDown = function(coords) {
    mouseCop = new Body({
      borderX: {
        min: 0,
        max: width
      },
      borderY: {
        min: 0,
        max: height
      },
      start: [coords.x, coords.y],
      type: 'cop',
      radius: getRadiusByBrowser()
    });
  };

  var onMouseUp = function(coords) {
    mouseCop = undefined;
    mcInserted = false;
  };

  return {
    begin: setup,
    resize: resize,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp
  };
};

var helper = {
  getRandomPnt: function(xRange, yRange, spacer) {
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
  },
  getWithin: function(distance, centerPnt, entities) {
    return _.filter(entities, function(ent) {
      return helper.getDistance(centerPnt, ent.getPosition()) <= distance;
    });
  }
};
