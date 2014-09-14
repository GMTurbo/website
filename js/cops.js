var Cop = function(options) {

  options = _.defaults(options,{
    borderX: {min: 0, max: 100},
    borderY: {min: 0, max: 100}
  });

  var position = [],
    dx = _.random(-0.5, 0.5),
    dy = _.random(-0.5, 0.5),
    r = 10,
    opacity = 10,
    color = 'rgba(0,204,0,' + opacity + ')',
    shadowColor = 'rgba(0,204,0,1)';

  var getPosition = function() {
    return position;
  };

  var setPosition = function(newPos) {
    position = newPos;
  };

  var step = function() {
    position[0] += dx;
    position[1] += dy;
    if(position[0] > options.borderX.max || position[0] < options.borderX.min)
      dx*=-1;
    if(position[1] > options.borderY.max || position[1] < options.borderY.min)
      dy*=-1;
  };

  var draw = function(context){

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
    getPosition: getPosition,
    setPosition: setPosition,
    step: step,
    draw: draw
  };
};
