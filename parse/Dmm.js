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
      const path = this.$(el).find(selector).attr('href');
      return this.getUrl(path);
    }).get();
  }

  async getPickUpTitles({ items }) {
    let pickupTitles = [];

    for (let i = 0; i < items.length; i += 1) {
      const path = this.$(items[i]).find('> a').attr('href');
      const itemUrl = this.getUrl(path);
      const title = await this.fetchText({
        url: itemUrl,
        el: '#title'
      });
      pickupTitles.push(title);
    }

    return pickupTitles;
  }

  fetchText({ url, el }) {
    return new Promise(resolve => {
      request(url, (err, response, html) => {
        if (err) {
          console.error('error:', err);
        }

        const $ = cheerio.load(html);
        const text = $(el).text();
        resolve(text);
      });
    });
  }

  getUrl(path) {
    return this.url + path;
  }
}

module.exports = Dmm;
