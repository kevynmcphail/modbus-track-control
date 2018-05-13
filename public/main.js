var socket = io('/controller');

socket.on('connect', function() {
  console.log('Connected to Server');
})

socket.on('message', function(data) {
  console.log(data);
})


$('.btn').mousedown(function(e) {
  console.log('button clicked!');
  e.preventDefault();
  var _this = $(this);


  // QUERY ------------------------------------------------------------------------------------

  if (_this.hasClass('b0')){
    console.log('Button 0 - Query')
    if (document.getElementById('wr-register').value != null) {
      var r = '0x0' + document.getElementById('query-register').value;
    } else {
      var r = '0x0';
    }

    if (document.getElementById('wr-data').value != null) {
      var d = '0x' + document.getElementById('query-data').value;
    } else {
      var r = '0x0';
    }
    //console.log(parseInt(r));
    var packet = {
      register: parseInt(r),
      data: parseInt(d)
    }

    socket.emit('query', packet);
  }

  if (_this.hasClass('b1')){
    console.log('Button 1 - Query Position')
    var command = 'EP';

    socket.emit('query', command);
  }

  if (_this.hasClass('b2')){
    console.log('Button 2 - Query Velocity')
    var command = 'VE';

    socket.emit('query', command);
  }

  if (_this.hasClass('b3')){
    console.log('Button 3 - Query Acceleration')
    var command = 'AC';

    socket.emit('query', command);
  }

  if (_this.hasClass('b4')){
    console.log('Button 4 - Query Deceleration')
    var command = 'DE';

    socket.emit('query', command);
  }

  // VELOCITY  --------------------------------------------------------------------------------

  if (_this.hasClass('b5')){
    console.log('Button 5 - Velocity Move')
    var v = parseFloat(document.getElementById('vel-vel').value);
    var a = parseFloat(document.getElementById('vel-acc').value);
    var d = parseFloat(document.getElementById('vel-dec').value);

    if (d == null) {
      d = a;
    }

    var packet = {
      velocity: v,
      acceleration: a,
      deceleration: d
    }

    socket.emit('move-velocity', packet);
  }

  if (_this.hasClass('b6')){
    console.log('Button 5 - Velocity Stop')
    var command = 'SJ';

    socket.emit('query', command);
  }

  // POSITION  --------------------------------------------------------------------------------

  if (_this.hasClass('b7')){
    console.log('Button 7 - Relative Position Move')
    var p = parseInt(document.getElementById('pos-pos').value);
    var v = parseFloat(document.getElementById('pos-vel').value);
    var a = parseFloat(document.getElementById('pos-acc').value);
    var d = parseFloat(document.getElementById('pos-dec').value);

    if (d == null) {
      d = a;
    }

    var packet = {
      position: p,
      velocity: v,
      acceleration: a,
      deceleration: d
    }

    socket.emit('move-position-rel', packet);
  }

  if (_this.hasClass('b8')){
    console.log('Button 8 - Absolute Position Move')
    var p = parseInt(document.getElementById('pos-pos').value);
    var v = parseFloat(document.getElementById('pos-vel').value);
    var a = parseFloat(document.getElementById('pos-acc').value);
    var d = parseFloat(document.getElementById('pos-dec').value);

    if (d == null) {
      d = a;
    }

    var packet = {
      position: p,
      velocity: v,
      acceleration: a,
      deceleration: d
    }

    socket.emit('move-position-abs', packet);
  }

  if (_this.hasClass('b9')){
    console.log('Button 9 - Position Stop')
    var command = 'SKD';

    socket.emit('query', command);
  }

  if (_this.hasClass('b10')){
    console.log('Button 10 - Clockwise Jog')
    var v = parseFloat(document.getElementById('jog-vel').value);
    var a = parseFloat(document.getElementById('jog-acc').value);
    var d = parseFloat(document.getElementById('jog-dec').value);

    if (d == null) {
      d = a;
    }

    var packet = {
      direction: 'CW',
      velocity: v,
      acceleration: a,
      deceleration: d
    }

    socket.emit('jog-cw', packet);
  }

  if (_this.hasClass('b11')){
    console.log('Button 11 - Counter Clockwise Jog')
    var v = parseFloat(document.getElementById('jog-vel').value);
    var a = parseFloat(document.getElementById('jog-acc').value);
    var d = parseFloat(document.getElementById('jog-dec').value);

    if (d == null) {
      d = a;
    }

    var packet = {
      direction: 'CCW',
      velocity: v,
      acceleration: a,
      deceleration: d
    }

    socket.emit('jog-ccw', packet);
  }

});

//-------------------------------------------------------------------------------------------
// MOUSE UP ---------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------

$('.btn').mouseup(function(e) {
  //console.log('button released!');
  e.preventDefault();
  var _this = $(this);

  if (_this.hasClass('b10')){
    console.log('Button 10 - Clockwise Jog - STOP')
    var command = 'SJ';

    socket.emit('query', command);
  }

  if (_this.hasClass('b11')){
    console.log('Button 11 - Counter Clockwise Jog - STOP')
    var command = 'SJ';

    socket.emit('query', command);
  }

});
