const EventEmitter = require('events').EventEmitter;
const request = require('request');
const Dmm = require('./parse/Dmm');

const emitter = new EventEmitter();
const dmm = new Dmm();

request('http://www.dmm.co.jp/digital/', (error, response, html) => {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  emitter.emit('requestDMM', html);
});

emitter.on('requestDMM', (html) => {
  dmm.set$(html);
  dmm.initPickup();
});
