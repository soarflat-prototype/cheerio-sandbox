const request = require('request');
const cheerio = require('cheerio');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

class Dmm {
  constructor() {
    this.$ = null;
    this.url = 'http://www.dmm.co.jp';
    this.pickups = [];
  }

  setHtml(html) {
    this.$ = cheerio.load(html);
  }

  async initPickups() {
    const items = this.$('div', '.area-pickup .d-item td >');
    const itemUrls = this.getPickupItemUrls({ items: items });
    const makerUrls = this.getMakerUrls({ items: items });
    const titles = await this.getPickUpTitles({ items: items });
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
      const href = this.$(el).find('.tx-sublink > a').attr('href');
      const itemUrl = this.getFullUrl(href);
      makerUrls.push(itemUrl);
    });
    return makerUrls;
  }

  async getPickUpTitles({ items }) {
    let pickupTitles = [];

    for (let i = 0; i < items.length; i += 1) {
      const href = this.$(items[i]).find('> a').attr('href');
      const itemUrl = this.getFullUrl(href);
      const title = await this.getPickupTitle({ url: itemUrl });
      pickupTitles.push(title);
    }

    return pickupTitles;
  }

  getPickupTitle({ url }) {
    return new Promise(resolve => {
      request(url, (err, response, html) => {
        if (err) console.error('err:', err);
        console.log(`${url} statusCode:`, response && response.statusCode);
        const $ = cheerio.load(html);
        const title = $('#title').text();
        resolve(title);
      });
    });
  }

  getFullUrl(url) {
    return this.url + url;
  }
}

module.exports = Dmm;
