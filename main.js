const EventEmitter = require('events').EventEmitter;
const request = require('request');
const DmmParser = require('./parse/Dmm');

const emitter = new EventEmitter();
const dmmParser = new DmmParser();

request('http://www.dmm.co.jp/digital/', (error, response, html) => {
  console.log('error:', error);
  console.log('statusCode:', response && response.statusCode);
  emitter.emit('requestDmmDigital', html);
});

emitter.on('requestDmmDigital', (html) => {
  dmmParser.loadHtml(html);
  dmmParser.initPickups();
});
