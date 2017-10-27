const request = require('request');
const cheerio = require('cheerio');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

class Dmm {
  constructor() {
    this.$ = null;
    this.url = 'http://www.dmm.co.jp/';
    this.pickups = [];
  }

  setHtml(html) {
    this.$ = cheerio.load(html);
  }

  initPickups() {
    const items = this.$('div', '.area-pickup .d-item td >');
    const itemUrls = this.getPickupItemUrls({ items: items });
    const makerUrls = this.getMakerUrls({ items: items });

    let pickup = {};

    // pickups.each((i, el) => {
    //   pickup.itemUrl = this.getFullUrl(this.$(el).find('> a').attr('href'));
    //   pickup.makerUrl = this.$(el).find('.tx-sublink > a').attr('href');
    //   this.pickups.push(pickup);
    // });
    //
    // this.getPickUpTitles()
    //   .then(() => {
    //     console.log('end');
    //   })
    //   .catch();
  }

  getPickupItemUrls({ items }) {
    let ItemUrls = [];
    items.each((i, el) => {
      const href = this.$(el).find('> a').attr('href');
      const itemUrl = this.getFullUrl(href);
      ItemUrls.push(itemUrl);
    });
    return ItemUrls;
  }

  getMakerUrls({ items }) {
    let makerUrls = [];
    items.each((i, el) => {
      const href = this.$(el).find('.tx-sublink > a').attr('href')
      const itemUrl = this.getFullUrl(href);
      makerUrls.push(itemUrl);
    });
    return makerUrls;
  }

  async getPickUpTitles() {
    for (let i = 0; i < this.pickups.length; i += 1) {
      this.pickups[i].title = await this.getPickupTitle({ url: this.pickups[i].itemUrl });
    }
  }

  getFullUrl(url) {
    return this.url + url;
  }

  getPickupTitle({ url }) {
    return new Promise(resolve => {
      request(url, (error, response, html) => {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        const $ = cheerio.load(html);
        resolve('dom');
      });
    });
  }
}

module.exports = Dmm;
