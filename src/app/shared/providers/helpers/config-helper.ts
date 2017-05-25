import { Inject, Injectable } from '@angular/core';
const path = require('path');

@Injectable()
export class ConfigHelper {
  /**
   * @desc build api url
   * @param apiPath
   * @param paths
   * @return {string} url
   */
  public buildUrl(apiPath: string, paths: string[] = []): string {
    return [BASE_CONFIG.siteUrl, path.join('api', apiPath), ...paths].join('/');
  }
}
