var Cop = function(options) {

  options = _.defaults(options, {
    borderX: {
      min: 0,
      max: 100
    },
    borderY: {
      min: 0,
      max: 100
    },
    start : [0,0],
    sentry : false
  });

  var position = options.start,
    speedRange = 0.1,
    sentry = options.sentry,
    dx = _.random(-speedRange, speedRange),
    dy = _.random(-speedRange, speedRange),
    r = 10,
    opacity = 10,
    color = sentry ? 'rgba(100,204,0,' + opacity + ')' : 'rgba(0,204,0,' + opacity + ')',
    shadowColor = 'rgba(0,204,0,1)',
    prevPosition = [position[0] - dx, position[1] - dy],
    futurePos = [];

  var getPrevPosition = function() {
    return prevPosition;
  };

  var getPosition = function() {
    return position;
  };

  var setPosition = function(newPos) {

    prevPosition = position;

    position = newPos;

  };

  var step = function(delta) {

    if(sentry) return; //sentries don't move

    futurePos = [position[0] + delta[0], position[1] + delta[1]];

    // if (futurePos[0] > options.borderX.max || futurePos[0] < options.borderX.min)
    //   delta[0] *= -1;
    // if (futurePos[1] > options.borderY.max || futurePos[1] < options.borderY.min)
    //   delta[1] *= -1;

    setPosition([position[0] + delta[0], position[1] + delta[1]]);
  };

  var draw = function(context) {

    //if(sentry) return; //sentries don't show

    var pnt = getPosition();

    context.beginPath();

    context.fillStyle = color;
    context.shadowColor = shadowColor;
    context.arc(pnt[0] - r, pnt[1] - r, r, 0, 2 * Math.PI, false);

    context.closePath();
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 10;
    context.fill();

  };

  return {
    getPrevPosition: getPrevPosition,
    getPosition: getPosition,
    setPosition: setPosition,
    step: step,
    draw: draw,
    isSentry: function() { return sentry; }
  };
};
