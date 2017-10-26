const request = require('request');
const cheerio = require('cheerio');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

class Dmm {
  constructor() {
    this.$ = null;
    this.pickups = [];
  }

  set$(html) {
    this.$ = cheerio.load(html);
  }

  async initPickup() {
    const pickups = this.$('div', '.area-pickup .d-item td >');
    let pickup = {};

    pickups.each((i, el) => {
      pickup.itemUrl = this.$(el).find('> a').attr('href');
      pickup.makerUrl = this.$(el).find('.tx-sublink > a').attr('href');
      this.pickups.push(pickup);
    });

    const setPickupsTitle = async () => {
      for (let i = 0; i < this.pickups.length; i += 1) {
        this.pickups[i].title = await this.getPickupTitle({ url: this.pickups[i].itemUrl });
      }
    };

    setPickupsTitle()
      .then()
      .catch();
  }

  getPickupTitle({ url }) {
    return new Promise(resolve => {
      request(url, (error, response, html) => {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        resolve();
      });
    });
  }
}

module.exports = Dmm;
