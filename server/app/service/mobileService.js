'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');


const allHeader = {
  referer: 'https://c.y.qq.com/',
  host: 'c.y.qq.com',
};

class MobileController extends Controller {
  async fetchServer(options) {
    return axios.get(options.url, {
      params: options.query,
      headers: allHeader,
    }).then(response => {
      return response.data;
    }).catch(() => {
      return null;
    });
  }

  async lyricServer(options) {
    return axios.get(options.url, {
      params: options.query,
      headers: allHeader,
    }).then(response => {
      let ret = response.data;
      if (typeof ret === 'string') {
        const reg = /^\w+\(({[^()]+})\)$/;
        const mathes = ret.match(reg);
        if (mathes) {
          ret = JSON.parse(mathes[1]);
        }
      }
      return ret;
    }).catch(() => {
      return null;
    });
  }


  async getPurlUrlServer(options) {
    return axios.post(options.url, options.query, {
      headers: {
        referer: 'https://y.qq.com/',
        origin: 'https://y.qq.com',
        'Content-type': 'application/x-www-form-urlencoded',
      },
    }).then(response => {
      return response.data;
    }).catch(() => {
      return null;
    });

  }


}

module.exports = MobileController;
