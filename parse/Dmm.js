const request = require('request');
const cheerio = require('cheerio');

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
    const itemUrls = this.getUrlsFromHref({
      elements: items,
      selector: '> a'
    });
    const makerUrls = this.getUrlsFromHref({
      elements: items,
      selector: '.tx-sublink > a'
    });
    const titles = await this.getPickUpTitles({ items: items });
  }

  getUrlsFromHref({ elements, selector }) {
    return elements.map((i, el) => {
      const url = this.$(el).find(selector).attr('href');
      return this.getFullUrl(url);
    }).get();
  }

  async getPickUpTitles({ items }) {
    let pickupTitles = [];

    for (let i = 0; i < items.length; i += 1) {
      const url = this.$(items[i]).find('> a').attr('href');
      const itemUrl = this.getFullUrl(url);
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
