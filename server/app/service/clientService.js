'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');

const allHeader = { referer: 'https://c.y.qq.com/' };
const HeaderHost = { host: 'c.y.qq.com' };

class clientController extends Controller {

  async fetchServer(options, isHost = false) {
    let header = null;
    if (isHost) {
      header = Object.assign({}, allHeader, HeaderHost);
    } else {
      header = Object.assign({}, allHeader);
    }
    return axios.get(options.url, {
      params: options.query,
      headers: header,
    }).then(response => {
      return response.data;
    }).catch(() => {
      return null;
    });
  }

  async getNewAlbumSongServer(options) {
    return axios.get(options.url, {
      params: options.query,
      headers: allHeader,
    }).then(response => {
      let ret = response.data;
      if (typeof ret === 'string') {
        const reg = /^\w+\(({.+})\)$/;
        const matches = ret.trim().match(reg);
        if (matches) {
          ret = JSON.parse(matches[1]);
        }
      }
      return ret;
    }).catch(() => {
      return null;
    });
  }


}

module.exports = clientController;

