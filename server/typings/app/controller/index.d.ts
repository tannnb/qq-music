// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportClient = require('../../../app/controller/client');
import ExportMobile = require('../../../app/controller/mobile');

declare module 'egg' {
  interface IController {
    client: ExportClient;
    mobile: ExportMobile;
  }
}
