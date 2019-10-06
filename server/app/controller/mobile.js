'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // 获取热门推荐
  async getDisList() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
    await this.mixinsServer(url);
  }

  // 获取歌单详情
  async getDisSongt() {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
    await this.mixinsServer(url);
  }

  // 歌手，歌曲搜索
  async searchSing() {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
    await this.mixinsServer(url);
  }

  // 获取歌词
  async lyric() {
    const { ctx } = this;
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    const query = ctx.request.query;
    const result = await ctx.service.mobileService.lyricServer({ url, query });
    ctx.returnBody(200, result);
  }

  // 批量获取vkey
  async getPurlUrl() {
    const { ctx } = this;
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    const query = ctx.request.body;
    const result = await ctx.service.mobileService.getPurlUrlServer({ url, query });
    ctx.returnBody(200, result);
  }

  async mixinsServer(url) {
    const { ctx } = this;
    const query = ctx.request.query;
    const result = await ctx.service.mobileService.fetchServer({ url, query });
    ctx.returnBody(200, result);
  }

}

module.exports = HomeController;

