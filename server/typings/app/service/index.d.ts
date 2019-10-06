// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportClientService = require('../../../app/service/clientService');
import ExportMobileService = require('../../../app/service/mobileService');

declare module 'egg' {
  interface IService {
    clientService: ExportClientService;
    mobileService: ExportMobileService;
  }
}
