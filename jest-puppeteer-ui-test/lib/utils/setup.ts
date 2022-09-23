import { WebSearchPageConfig } from "../search-page/interfaces/web-search-page-config";
import { WebSearchResponse } from "../search-page/interfaces/web-search-page";
import { PageExtend } from "../search-page/page-extend";


const defaultConfig: WebSearchPageConfig = {
  lang: 'zh_CN',
  fontRatio: 1,
  scene: 20,
  version: 80009077,
  qqFaceFolderPath: '',
  platform: 'iOS',
  netType: 'wifi',
  // here this param decided result page or not
  type: 1,
  isHomePage: 1,
  query: ``,
  isSug: true,
  isLocalSug: true,
  sceneActionType: 1,
  sessionId: '',
  subSessionId: '',
  systemVersion: 0,
  wechatVersion: 0,
  deviceName: '',
  deviceModel: '',
  imei: '',
  deviceBrand: 'Apple',
  ostype: '',
  isClientLoading: 1,
  isOverseaApp: 0,
  educationTab: 1
};


export async function setup(searchRes: WebSearchResponse) {
  let pageExtend = new PageExtend();

  return await pageExtend.allocPage({
    device: 'iPhone 11 Pro Max',
    config: defaultConfig,
    context: "./asset/" + global.__TEMPLATE__,
    query: "哈哈",
    searchResult: searchRes,
    key: "1"
  })
}