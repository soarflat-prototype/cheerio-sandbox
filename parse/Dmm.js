const request = require('request');
const cheerio = require('cheerio');

class Dmm {

  constructor() {
    this.$ = null;
    this.url = 'http://www.dmm.co.jp';
    this.pickups = [];
  }

  loadHtml(html) {
    this.$ = cheerio.load(html);
  }

  async initPickups() {
    const items = this.$('div', '.area-pickup .d-item td >');
    const itemUrls = this.getUrlsFromHref({ elements: this.$(items).find('> a') });
    const makerUrls = this.getUrlsFromHref({ elements: this.$(items).find('.tx-sublink > a') });
    const titles = await this.fetchTextsFromRequestHtml({
      elements: this.$(items).find('> a'),
      textSelector: '#title'
    });

    console.log(titles);
  }

  /**
   * href属性からリンクを取得し、絶対パスのURLに変換して返す
   *
   * @param elements hrefからリンクを取得した要素
   * @returns Array
   */
  getUrlsFromHref({ elements }) {
    return elements.map((i, el) => {
      const path = this.$(el).attr('href');
      return this.joinUrl(path);
    }).get();
  }

  /**
   * href属性のリンクをリクエストし、返ってきたHTMLからテキストを取得する
   *
   * @param elements hrefからリンクを取得したい要素
   * @param textSelector テキストを取得したいセレクタ
   * @returns {Promise.<Array>}
   */
  async fetchTextsFromRequestHtml({ elements, textSelector }) {
    let texts = [];

    for (let i = 0; i < elements.length; i += 1) {
      const path = this.$(elements[i]).attr('href');
      const itemUrl = this.joinUrl(path);
      const text = await this.fetchText({
        url: itemUrl,
        textSelector: textSelector
      });
      texts.push(text);
    }

    return texts;
  }

  /**
   * urlをリクエストして、返ってきたHTMLからテキストを取得する
   *
   * @param url リクエストするurl
   * @param textSelector テキストを取得したいセレクタ
   * @returns {Promise}
   */
  fetchText({ url, textSelector }) {
    return new Promise(resolve => {
      request(url, (err, response, html) => {
        if (err) {
          console.error('error:', err);
        }

        const $ = cheerio.load(html);
        const text = $(textSelector).text();
        resolve(text);
      });
    });
  }

  /**
   * ルートURLにパスを結合して返す
   *
   * @param path
   * @returns {string}
   */
  joinUrl(path) {
    return this.url + path;
  }

}

module.exports = Dmm;
