(function () {
  function a () {
    var b = document.documentElement.clientWidth
    // b = b > 750 ? 750 : b
    var c = b / 10
    c = c > 50 ? 50 : c
    document.getElementsByTagName('html')[0].style.fontSize = c + 'px'
  }

  a()
  window.onresize = a
})()
