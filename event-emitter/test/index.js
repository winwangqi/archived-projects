var emitter = new Emitter()

var a = function () { console.log('a') }
var b = function () { console.log('b') }
var c = function () { console.log('c') }

emitter
  .on('eventA', a)
  .on('eventA', b)
  .on('eventB', b)
  .once('eventC', c)
  .off('eventB', b)
  .emit('eventA')
  .emit('eventB')
  .emit('eventC')