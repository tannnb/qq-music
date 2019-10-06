'use strict';

const Controller = require('egg').Controller;

class clientController extends Controller {

  // musicu
  async musicu() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';
    await this.mixinsServer(url);
  }

  // 获取专辑详情
  async getAlbumDesc() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg';
    await this.mixinsServer(url);
  }


  async getDiscList() {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
    await this.mixinsServer(url);
  }

  async review() {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_global_comment_h5.fcg';
    await this.mixinsServer(url);
  }


  async getMvlist() {
    const url = 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag';
    await this.mixinsServer(url);
  }

  async station() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg';
    await this.mixinsServer(url);
  }

  async back_lyric() {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
    await this.mixinsServer(url);
  }

  async toplistOpt() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_opt.fcg';
    await this.mixinsServer(url);
  }
  async toplistCp() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    await this.mixinsServer(url);
  }

  async gethotkey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    await this.mixinsServer(url, true);
  }
  async clientSearch() {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
    await this.mixinsServer(url, true);
  }
  async clientSmartBox() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg';
    await this.mixinsServer(url, true);
  }


  async getSingerDesc() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    await this.mixinsServer(url);
  }

  async getSingerAlbum() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg';
    await this.mixinsServer(url);
  }


  async getSingerMv() {
    const url = 'https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg';
    await this.mixinsServer(url);
  }

  async gerSingerFan() {
    const url = 'https://c.y.qq.com/rsc/fcgi-bin/fcg_get_singer_fan_num.fcg';
    await this.mixinsServer(url);
  }


  async getSortTags() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';
    await this.mixinsServer(url);
  }

  async getSortList() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
    await this.mixinsServer(url);
  }


  async mixinsServer(url, isHost = false) {
    const { ctx } = this;
    const query = ctx.request.query;
    const result = await ctx.service.clientService.fetchServer({ url, query }, isHost);
    ctx.returnBody(200, result);
  }


}

module.exports = clientController;

