import { CommonPage } from "./common-page";
import { WebSearchResponse } from "../interfaces/web-search-page";
import fs, { readFileSync } from "fs";
import { join } from "path";
import { devices, HTTPRequest, Page } from "puppeteer";
import { WebSearchPageConfig } from "../interfaces/web-search-page-config";
import ini from "ini";
import {randomInt} from "crypto";
import got from "got";

const newwxjsPath = join(__dirname, `newwxjs.js`);
const newwxjsContent = readFileSync(newwxjsPath, {
  encoding: 'utf-8',
});


/**
 * s1s page object
 */
export class WebSearchPage extends CommonPage {
  // key
  private _key: string = '';
  // context (local path)
  private _context: string = '';
  // query
  private _query: string = '';
  // search result
  private _searchResult: WebSearchResponse = null;
  // inited
  private _inited: boolean = false;
  // network idle promise maker
  private networkIdlePromiseMaker: (idleTimeout: number, failTimeout: number) => Promise<void> = null;
  // closed
  public closed: boolean = false;
  // is data ready
  private _dataReady: boolean = false;
  // page default config
  private _pageConfig : WebSearchPageConfig = null;
  // device
  public _device: string = "iPhone 11 Pro Max"

  private _dataReadyResolve: () => void = null;


  //private logger: Logger;
  // alloc
  constructor (instance: Page) {
    super(instance);

  }
  // getter
  get key() {
    return this._key;
  }
  get inited(){
    return this._inited;
  }

  //setter
  set searchResult(res : WebSearchResponse){
    this._searchResult = res;
  }
  set inited(inited : boolean){
    this._inited = inited;
  }

  // init
  async initWithQuery({
    config,
    key,
    content,
    context,
    query,
    requestInterceptor,
    handler,
    device
  }: {
    config: WebSearchPageConfig;
    key: string;
    content: string;
    // properties
    context: string;
    query: string;
    device: string
    // bindings
    requestInterceptor: (req: HTTPRequest, ctx: string) => void;
    handler: (func: string, params: Record<string, any>, ctx: WebSearchPage) => void;
  }) {
    this.logger.log(`init page with query` )
    // make sure only called once
    if (this._inited) {
      return;
    }
    this._key = key;
    this._context = context;
    this._query = query;
   // this._searchResult = searchResult;
    this._dataReady = false;
    this._pageConfig = config;
    this._device = device;
    await super.bind({
      requestInterceptor: (req) => {
        requestInterceptor?.(req, context);
      },
    });
    await this.config({
      isHomePage: 0,
      query,
    });
    this.networkIdlePromiseMaker = this.createWaitForIdleNetworkFactory();
    await this.load(content);
    await this.register(handler);
    await this.prepare();

  }
  // close
  async close() {
    await super.close();
    this.closed = true;
  }
  // create function wait for idle network
  private createWaitForIdleNetworkFactory() {
    return super.createFunctionWaitForIdleNetwork(
      (req) => {
        if (req.resourceType() === 'image' || req.resourceType() === 'font' || req.resourceType() === 'script') {
          const urlObj = (() => {
            try {
              return new URL(req.url());
            } catch (err) {
              return null;
            }
          })();
          // for base64, requestfinished happens before request (which means returning immediately)
          if (urlObj?.protocol === `data:`) {
            return false;
          }
          return true;
        }
        return false;
      },
    );
  }

  // config, which may changes url
  private async config(config: Partial<WebSearchPageConfig>) {
    const mergedConfig = Object.assign({}, this._pageConfig, config);
    // set width and height
    // see: https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
    await this.instance.emulate(devices[this._device]);
    // url
    const urlObj = new URL(`app.html`, 'file:');
    Object.keys(mergedConfig).forEach((key) => {
      urlObj.searchParams.append(key, mergedConfig[key]);
    });
    this.logger.log(`generate the page retry: ${urlObj.href}`)
    await this.instance.goto(urlObj.href);
  }
  // load html
  private async load(content: string) {
    // load content
    await this.instance.setContent(content, {
      waitUntil: 'domcontentloaded',
    });
  }
  // register handler, override allowing
  private async register(handler: (func: string, params: Record<string, any>, ctx: WebSearchPage) => void = null) {
    // preinject, iOS addScriptMessageHandler (seems not work in normal page, e.g., webkit)
    // await this.instance.evaluate(() => {
    //   (window as any).weixinPostMessageHandlers = (window as any).webkit.messageHandlers;
    //   try {
    //     Object.defineProperty(
    //       window, 'weixinPostMessageHandlers',
    //       {
    //         value: (window as any).weixinPostMessageHandlers,
    //         writable: false,
    //       }
    //     )
    //   } catch (e) {}
    // });
    // hence, try replacing with exposeFunction
    await this.instance.exposeFunction(`weixinDispatchMessage`, async (messages: string) => {
      try {
        const messagesObj = JSON.parse(messages);
        const messageQueue = JSON.parse(messagesObj[`__msg_queue`] || `[]`);
        for (const message of messageQueue) {
          try {
            const messageObj = JSON.parse(message);
            if (messageObj[`__msg_type`] === 'call') {
              const func: string = messageObj[`func`];
              const params: Record<string, any> = messageObj[`params`];
              const callbackId: string = messageObj[`__callback_id`];
              if (!func || !params) {
                continue;
              }
              // handle
              handler?.(func, params, this);
              // ack
              await this.sendCallbackToJSBridge({
                callbackId,
                params: { ret: 0 },
              });
            }
          } catch (err) {}
        }
      } catch (err) {}
    });
  }
  // prepare environment
  private async prepare() {
    // inject newwxjs (as client does, LocalJSLogicBase)
    // note: the following operates manually
    // replace isUseMd5_check with no
    // replace __ISWKWEBVIEW with true
    // replace weixinPostMessageHandlers.weixinDispatchMessage.postMessage with weixinDispatchMessage
    await this.instance.addScriptTag({
      content: newwxjsContent,
    });
    await this.sendEventToJSBridge(`sys:init`);
    await this.sendEventToJSBridge(`sys:bridged`);
  }

  private async waitForDataReady(timeout = 10 * 1e3) {
    this._dataReadyResolve = null;
    return new Promise<void>((resolve, reject) => {
      if (this._dataReady) {
        resolve();
      } else {
        const timeoutId = setTimeout(() => {
          reject(`data is not ready after timeout`);
        }, timeout);
        this._dataReadyResolve = () => {
          clearTimeout(timeoutId);
          resolve();
        };
      }
    });
  }
  // wait for rendering done
  public async waitForRenderingDone() {
    // search result data ready
    await this.waitForDataReady();
    // wait for 500ms (because render actually happens items by items)
    await this.instance.waitForTimeout(5000);
    // wait for remote resource loading
    await this.networkIdlePromiseMaker(5000, 200000);
  }

  private async sendCallbackToJSBridge({
    params,
    callbackId,
  }: {
    params?: Record<string, any>;
    callbackId?: string;
  }) {
    const callbackObj = {};
    callbackObj[`__params`] = params;
    callbackObj[`__msg_type`] = `callback`;
    if (!!callbackId) {
      callbackObj[`__callback_id`] = callbackId;
    }
    return await this.sendMessageToJSBridge({
      __json_message: JSON.stringify(callbackObj),
      __sha_key: '',
    });
  }

  private async sendEventToJSBridge(event: string, params: Record<string, any> = {}) {
    const eventObj = {};
    eventObj[`__event_id`] = event;
    eventObj[`__params`] = params;
    eventObj[`__msg_type`] = `event`;
    if (event === `sys:init`) {
      eventObj[`__runOn3rd_apis`] = [
        // import: register js here
        `onSearchInputConfirm`,
        `onSearchDataReady`,
        `onCurrentLocationReady`,
        `onSearchWebQueryReady`,
        `onWebRecommendCommCgiResult`,
        `onGetSmiley`,
        `onGetKeyboardHeight`,
        `activity:state_change`,
        `onGetFTSWebSearchData`,
        `onGetFTSTimeLineWebSearchData`,
        `onDeviceMotionFired`,
        `onPageStateChange`,
        `onNetWorkChange`,
        `prepareReuseView`,
      ];
    }
    return await this.sendMessageToJSBridge({
      __json_message: JSON.stringify(eventObj),
      __sha_key: '',
    });
  }

  private async sendMessageToJSBridge(message: {
    __json_message: string;
    __sha_key: string;
  }) {
    return await this.instance.evaluate((message) => {
      if ((window as any).WeixinJSBridge) {
        return (window as any).WeixinJSBridge._handleMessageFromWeixin(message);
      }
      return;
    }, message);
  }

  /*public async search(query: string, searchResult: WebSearchResponse) {
    this._dataReady = false;
    this._dataReadyResolve = null;
    this._query = query;
    this._searchResult = searchResult;
    await this.sendEventToJSBridge(`onSearchInputConfirm`, {
      query,
    });
  }*/

  public async onSearchDataReady() {
    const result = await this.sendEventToJSBridge(`onSearchDataReady`, {
      requestId: ``,
      funcQuery: false,
      newQuery: true, // response.Offset <= 0,
      jsonRefer: 0,
      json: this._searchResult.Json,
    });
    this._dataReady = true;
    this._dataReadyResolve?.();
    return result;
  }

  public async jumpTest(url : string) {
    await this.instance.goto(url,{timeout:300000, waitUntil:"networkidle0"});
    await this.instance.waitForNavigation();
    await this.waitForRenderingDone();
  }

  public getIpPort(moudle: string) {
    let ip_port_list = []
    let env = ["shanghai", "shenzhen", "hk", "camel"];

    for (const i in env) {
      try {
        let str = fs.readFileSync(`/home/qspace/etc/route/${env[i]}/${moudle}_route.conf`).toString();
        let info = ini.parse(str);
        for (const server in info) {
          if( "IP" in info[server] && "Port" in info[server]){
            ip_port_list.push([info[server]["IP"], info[server]["Port"]]);
          }else if("SVR_IP" in info[server] && "SVR_Port" in info[server]) {
            ip_port_list.push([info[server]["SVR_IP"], info[server]["SVR_Port"]]);
          }
        }
      }catch(err){
        this.logger.error(`$$$$$ there is something wrong ${err}`);
      }
    }
    if (ip_port_list.length > 0){
      return ip_port_list[randomInt(1, 1000) % ip_port_list.length];
    }
    return [0, 0];
  }

  public getUrl(module: string, funcName: string){
    let server = this.getIpPort(module);
    this.logger.log(`http://${server[0]}:${server[1]}/${funcName}`);
    if (server[0] != 0 && server[1] != 0){
      return `http://${server[0]}:${server[1]}/${funcName}`;
    }
    return "";
  }

  /*public async mmSearch(url: string, data){
    let uin = "3192443972";
    let  header_dict = {
      "Accept": "*!/!*",
      "Content-Type": "application/json; charset=utf-8",
      "Cookie": `uin=${uin};uid=${uin}`
    };
    let resp = await got( {method: 'post', url: url, body: JSON.stringify(data), decompress: false, headers: header_dict, timeout: 20000});

    if (resp.statusCode == 200){
      let rawData = resp.body;
      this.logger.log(rawData);
      return JSON.parse(rawData);
    }else {
      this.logger.error(`$$$$ there is something wrong`);
    }
  }

  public async search(data) {
    let url = this.getUrl("mmsearchossopenapisvr", "GetSearchResultLite")
    let resp =  await this.mmSearch(url, data);
    this._searchResult = resp.rsp;
    return resp;
  }*/

  public async mmSearch(url: string, data){
    let uin = "3192443972";
    let  header_dict = {
      "Accept": "*/*",
      "Content-Type": "application/json; charset=utf-8",
      "Cookie": "tapdsession=e1911bf3abbc62cfbee22ec2b152779d; t_u=882c902be955cc61%7C53fb9085e7b0ba04; t_uid=joycesong; blueking_language=zh-cn; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22joycesong%22%2C%22first_id%22%3A%22184181ebc2acc3-01f1882ea285059-19525635-2007040-184181ebc2bbad%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%22184181ebc2acc3-01f1882ea285059-19525635-2007040-184181ebc2bbad%22%7D; paas_perm_csrftoken=muNapxFa0vD1MYyRwRDBhNmTZnWc9VLdEDqAwwqquYjnuiOYVLF4IUdA4HfOG2VC; paas_perm_sessionid=4xvbottaeij8fj23pnbs5wa6t8630467; x_host_key_access_https=f51f059a71a512b500346a85e0809dbb3f985034_s; x-client-ssid=1843b3d6fa1-a795c52fa12fad2ac08f962692d7cc5be1abddec; x-tofapi-host-key=1843b3d6fa9-e2a601e9be8223e640130ada4a6350ba17f1266e; x_host_key_access=f51f059a71a512b500346a85e0809dbb3f985034_s; roles=undefined; x-imp-host-key=18440a27cff-95799201f3325dfc16a78ce511af4bceb162d4b9; DiggerTraceId=d59857c0-5c0b-11ed-8f5c-d19e43ae1ccb; wxitil_request_authid=131; wxitil_request_authkey=0; wxitil_auth_version=new; _login_name=joycesong; ERP_USERNAME=joycesong; PIXIEL_RATIO=2; FRM=new; WIN_WH=0_0; pkgsvr_csrftoken=2H21LMPRI9rmqLCST8IvAcdpKJqOSKKP; pkgsvr_sessionid=gggituqld5c7wvtuxx48lkwedz4q137n; _t_uid=1001483085; bk_uid=joycesong; bk_ticket=pF-buLmFQDnV24zDzAOJmkftZMbiI9sYEM6RZJXCJfI; RIO_TCOA_TICKET=tof:TOF4TeyJ2IjoiNCIsInRpZCI6IlJMNk9aZW1QbnNFaGo3SEtwNWNYU1JDNVVuSTBCOU1VIiwiaXNzIjoiMTAuOTkuMTUuMzYiLCJpYXQiOiIyMDIyLTExLTEzVDIxOjA2OjM3LjMxNTgwMDY2NSswODowMCIsImF1ZCI6IjIxOC4xOS4xMzkuMTk4IiwiaGFzaCI6IkM1MjZFNjhBRjdCQTVEODUxNzk4NzcwMjBCQzYyM0ZDOTUzREE5MERDQUUwMDk5RUIzQjcyQ0U1Q0Y3NjA5MEUiLCJuaCI6IkE1M0Y0NDI1NUE0QjBFNDlDNDkwMzcwMDQzNEVFMjZDRUYxQ0FDMzQ4OUU2NTgxODlGNEYxNTA1NkQyQkExRkMifQ; RIO_TCOA_TICKET_HTTPS=tof:TOF4TeyJ2IjoiNCIsInRpZCI6IlJMNk9aZW1QbnNFaGo3SEtwNWNYU1JDNVVuSTBCOU1VIiwiaXNzIjoiMTAuOTkuMTUuMzYiLCJpYXQiOiIyMDIyLTExLTEzVDIxOjA2OjM3LjMxNTgwMDY2NSswODowMCIsImF1ZCI6IjIxOC4xOS4xMzkuMTk4IiwiaGFzaCI6IkM1MjZFNjhBRjdCQTVEODUxNzk4NzcwMjBCQzYyM0ZDOTUzREE5MERDQUUwMDk5RUIzQjcyQ0U1Q0Y3NjA5MEUiLCJuaCI6IkE1M0Y0NDI1NUE0QjBFNDlDNDkwMzcwMDQzNEVFMjZDRUYxQ0FDMzQ4OUU2NTgxODlGNEYxNTA1NkQyQkExRkMifQ; km_u=28041baea0dad8fed7a6e45d39ae4c8ace0bd6e5a97ff7437eedfd7fc37307dcb51ce39a2dcd2af0; km_uid=joycesong"
    };
    let resp = await got( {method: 'post', url: url, body: JSON.stringify(data), decompress: false, headers: header_dict, timeout: 15000});
    //setTimeout("", 2000 )
    console.log(resp);
    if (resp.statusCode == 200){
      let rawData = resp.body;
      this.logger.log(rawData);
      return JSON.parse(rawData)
    }
  }

  public async search(data) {
    let url = this.getUrl("mmsearchossopenapi", "GetSearchResult")
    let url2 = "https://mmsearch.woa.com/newapi/comm_svrkit/mmsearchossopenapisvr/GetSearchResultLite"
    let resp =  await this.mmSearch(url2, data);
    this._searchResult = resp.data.rsp;
    return resp.data.rsp;
  }

}
