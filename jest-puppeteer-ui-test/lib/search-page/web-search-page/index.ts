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
    device,
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

  async changeWithQuery({query, content, requestInterceptor, handler}: {
    query: string;
    content: string;
    requestInterceptor: (req: HTTPRequest, ctx: string) => void;
    handler: (func: string, params: Record<string, any>, ctx: WebSearchPage) => void;}) {
    this.logger.log(`change page with query` )
    // make sure only called once
    this._query = query;
    // this._searchResult = searchResult;
    this._dataReady = false;
    await super.bind({
      requestInterceptor: (req) => {
        requestInterceptor?.(req, this._context);
      },
    });
    await this.config({
      isHomePage: 0,
      query,
    });
    this.networkIdlePromiseMaker = this.createWaitForIdleNetworkFactory();
    await this.load(content);
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

  public async onSearchDataReady(params: Record<string, any>) {
    const result = await this.sendEventToJSBridge(`onSearchDataReady`, {
      requestId: params.requestId,
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

  public async mmSearch(url: string, data){
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
  }

}
