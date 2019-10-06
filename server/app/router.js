'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // api版本的管理，开辟一个命名空间
  // 需增加路由命名空间插件egg-router-plus
  const h5API = router.namespace('/api/h5');
  const pcAPI = router.namespace('/api/pc');

  h5API.get('/getDisList', controller.mobile.getDisList);
  h5API.get('/getDisSongt', controller.mobile.getDisSongt);
  h5API.get('/search', controller.mobile.searchSing);
  h5API.get('/lyric', controller.mobile.lyric);
  h5API.post('/getPurlUrl', controller.mobile.getPurlUrl);


  pcAPI.get('/musicu', controller.client.musicu);
  pcAPI.get('/recommend', controller.client.musicu);
  pcAPI.get('/newSongType', controller.client.musicu);
  pcAPI.get('/newAlbumArea', controller.client.musicu);
  pcAPI.get('/getAlbum', controller.client.musicu);
  pcAPI.get('/getAlbumDesc', controller.client.getAlbumDesc);
  pcAPI.get('/getDiscList', controller.client.getDiscList);
  pcAPI.post('/getPurlUrl', controller.mobile.getPurlUrl);
  pcAPI.get('/getLyric', controller.mobile.lyric);
  pcAPI.get('/review', controller.client.review);
  pcAPI.get('/getNewAlbumSong', controller.client.getAlbumDesc);
  pcAPI.get('/getMvlist', controller.client.getMvlist);
  pcAPI.get('/station', controller.client.station);
  pcAPI.get('/getRadioDesc', controller.client.musicu);
  pcAPI.get('/back_lyric', controller.client.back_lyric);
  pcAPI.get('/toplistOpt', controller.client.toplistOpt);
  pcAPI.get('/toplistCp', controller.client.toplistCp);

  pcAPI.get('/gethotkey', controller.client.gethotkey);
  pcAPI.get('/clientSearch', controller.client.clientSearch);
  pcAPI.get('/clientSmartBox', controller.client.clientSmartBox);

  pcAPI.get('/getSingerList', controller.client.musicu);
  pcAPI.get('/getSingerDesc', controller.client.getSingerDesc);
  pcAPI.get('/getSingerAlbum', controller.client.getSingerAlbum);
  pcAPI.get('/getSingerMv', controller.client.getSingerMv);
  pcAPI.get('/gerSingerFan', controller.client.gerSingerFan);
  pcAPI.get('/getSingerMvUrl', controller.client.musicu);

  pcAPI.get('/getSortTags', controller.client.getSortTags);
  pcAPI.get('/getSortList', controller.client.getSortList);
  pcAPI.get('/getSortDesc', controller.client.getDiscList);


};

