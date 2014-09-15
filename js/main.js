$(document).ready(function() {

  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var system = new System({
    width: $('#space').width(),
    height: $('#space').height(),
    density: 0.3,
    canvas: document.getElementById('space-content'),
    reqAnimationFrame: window.requestAnimationFrame
  });

  system.begin();

  $(window).on("mousedown", function(event) {
    system.onMouseDown({
      x: event.pageX,
      y: event.pageY
    });
  });

  $(window).on("mouseup", function(event) {
    system.onMouseUp();
  });

  $(window).resize(function() {

    system.resize({
      width: $('#space').width(),
      height: $('#space').height()
    });

  });
});
