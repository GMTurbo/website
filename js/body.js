var Body = function(options) {

  options = _.defaults(options, {
    borderX: {
      min: 0,
      max: 100
    },
    borderY: {
      min: 0,
      max: 100
    },
    start: [0, 0],
    sentry: false,
    type: 'cop'
  });

  var position = options.start,
    speedRange = 0.1,
    sentry = options.sentry,
    TYPE = options.type,
    dx = _.random(-speedRange, speedRange),
    dy = _.random(-speedRange, speedRange),
    r = 7,
    tailLength = 100,
    opacity = 10,
    copColor = 'rgba(204,0,0,' + opacity + ')',
    copShadowColor = 'rgba(204,0,0,1)',
    robColor = 'rgba(0,204,0,' + opacity + ')',
    robShadowColor = 'rgba(0,204,0,1)',
    prevPosition = [position[0] - dx, position[1] - dy],
    futurePos = [],
    path = [];

  var getPrevPosition = function() {
    return prevPosition;
  };

  var getPosition = function() {
    return position;
  };

  var setPosition = function(newPos) {

    prevPosition = position;

    position = newPos;

    path.push(position);

    if (path.length > tailLength)
      path = path.splice(1); //[1,2,3,4,5] => [2,3,4,5]
  };

  var step = function(delta) {

    if (sentry) return; //sentries don't move

    futurePos = [position[0] + delta[0], position[1] + delta[1]];

    //if (TYPE == "robber") {
      if (futurePos[0] > options.borderX.max || futurePos[0] < options.borderX.min)
        delta[0] *= -1;
      if (futurePos[1] > options.borderY.max || futurePos[1] < options.borderY.min)
        delta[1] *= -1;
  //  }
    var speed = (TYPE == "cop") ? 0.5 : 0.3;
    setPosition([position[0] + speed*delta[0], position[1] + speed*delta[1]]);
  };

  var draw = function(context) {

    if (sentry) return; //sentries don't show

    var pnt = getPosition();

    context.beginPath();

    context.fillStyle = (TYPE == 'cop') ? copColor : robColor;
    context.shadowColor = (TYPE == 'cop') ? copShadowColor : robShadowColor;
    context.arc(pnt[0] - r, pnt[1] - r, r, 0, 2 * Math.PI, false);

    context.closePath();
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 10;
    context.fill();

    context.lineWidth = 1;
    context.strokeStyle = (TYPE == 'cop') ? copColor : robColor;
    for (var i = 0, length = path.length; i < length - 1; i++) {
      context.moveTo(path[i][0] - r, path[i][1] - r);
      context.lineTo(path[i + 1][0] - r, path[i + 1][1] - r);
    }

    context.stroke();

    context.closePath();

  };

  return {
    getPrevPosition: getPrevPosition,
    getPosition: getPosition,
    setPosition: setPosition,
    step: step,
    draw: draw,
    getType: function() {
      return TYPE;
    },
    setType: function(val) {
      TYPE = val;
    }
  };
};
