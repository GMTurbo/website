$(document).ready(function() {

  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var system = new System({
    width: $('#space').width(),
    height: $('#space').height(),
    density: 0.04,
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
