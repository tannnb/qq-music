/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {

  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};



  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561882266716_3916';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 关闭csrf安全验证
  config.security = {
    csrf: { enable: false },
  };
  /* config.security = {
     domainWhiteList: [ 'http://pc.tannnb.com' ],
   };*/
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return {
    ...config,
    ...userConfig,
  };
};
