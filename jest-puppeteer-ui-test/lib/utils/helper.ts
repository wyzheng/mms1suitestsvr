import fs from "fs";
import got from "got";
import tunnel from "tunnel";
import {LoggerService} from "../logger/logger.service";
import sha1 from 'sha1'


const logger = new LoggerService().getLogger();

export async function scrollDown() {
  await new Promise<void>((resolve, reject) => {
    let totalHeight = 0;
    const distance = 100;
    const timer = setInterval(() => {
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;
      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });

}

export function readTestJson(jsonFile: string){
  if (fs.existsSync(jsonFile)) {
    return JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  }else {
    return null;
  }
}

export async function getHighlightContent(page, selector) {
  let content = await page.evaluate((selector) => {
    let items =  document.querySelectorAll(selector + '  ' + 'em[class="highlight"]');
    let content = [];
    for (let i = 0; i < items.length; i++) {
      content.push(items[i].innerHTML);
    }
    return content;
  },selector)
  return content;
}

export async function getContentStyle(page, selector) {
  let style : string;
  style = await page.evaluate((selector) => {
    let desc =  document.querySelector(selector);
    return getComputedStyle(desc).textOverflow;
  },selector)
  return style;
}

export function includes(str, query) {
  return str.every(val => query.includes(val));
}

// 获得元素在页面上的高度
export async function getHeightOfEle(page, selector) {
  return await page.evaluate((selector) => {

    let icon = document.querySelector(selector);
    let Box = icon.getBoundingClientRect(),
      doc = icon.ownerDocument,
      body = doc.body,
      html = doc.documentElement,
      clientTop = html.clientTop || body.clientTop || 0

    return Box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop + (Box.height / 2.0);

  }, selector);
}

export async function getOCRRes(imagePath){
  let r = await got("https://stream.weixin.qq.com/weapp/getOcrAccessToken", {
    agent:{
      https: tunnel.httpsOverHttp({
        proxy: {
          host: 'shanghai-mmhttpproxy.woa.com',
          port: '11113'
        }
      })
    }
  });
  logger.log("here joyce log something*********");
  logger.log(r.body);

  let buffer = fs.readFileSync(imagePath);
  let string = Buffer.from(buffer).toString('base64');
  let url = "http://9.22.0.225:12361/wxa/servicemarket?access_token=" + r.body;
  let data = {
    "service": "wx79ac3de8be320b71",
    "api": "OcrAllInOne",
    "client_msg_id": "xxx",
    "data": {
      "img_data": string,
      "data_type": 2,
      "ocr_type": 8
    }
  };
  let resp = await got( {method: 'post', url: url, body: JSON.stringify(data), decompress: false});
  logger.log("here joyce log something*********");
  logger.log(resp.body);

  let respData = resp.body.replace('\"', '"');
  let jsonRes = JSON.parse(respData);
  let ocrRes = JSON.parse(jsonRes.data);

  return ocrRes;
}

export async function getLineNum(path){
  let num = 0;
  num = (await getOCRRes(path)).ocr_comm_res.items.length;
  return num;
}

export async function getLastItem(path){
  let  ocrRes = await getOCRRes(path);
  let num =  ocrRes.ocr_comm_res.items.length;
  if(num >= 2){
    return ocrRes.ocr_comm_res.items[num - 1].text;
  }
  return '...'
}
/**
 *
 * @param functionName AddBizContact 关注公众号  DelBizContact 取消关注
 * @param bizUin  公众号uin
 * @param uin 用户uin
 */
export async function bizOperation(functionName, bizUin, uin){
  console.log("*************************")
  let url = `http://wxunitest.oa.com/mmbizcasehelper/mmbasedatabroker`
  let data = {
    "biz_uin": bizUin,
    "usr_uin": uin,
  }
  let req_data = {
    "func_name": functionName,
    "func_args": data
  };
  let resp = await got( {method: 'post', url: url, body: JSON.stringify(req_data), decompress: false});
   logger.log("here addBizContact log something*********");
   logger.log(resp.body);

}

/**
 *
 * @param finderName 被关注的人微信名
 * @param optype  1 关注 / 2 取消关注
 * @param userName 用户账号名
 */
export async function finderOperation(finderName, optype, userName){
  let url = "http://mmtest.oa.com/mmcasehelperidc/mmfinder"
  let req_data = {
    'func_name': 'SetFinderFollow',
    'func_args': {
      "username": userName,
      "finder_username": finderName,
      "optype": optype
    }
  }
  let resp = await got( {method: 'post', url: url, body: JSON.stringify(req_data), decompress: false});
  logger.log("here addBizContact log something*********");
  logger.log(resp.body);
}


export function errorCounting(e, err, fail){
  if (e.constructor.name == "JestAssertionError"){
    fail++;
    throw e;
  }else {
    err++;
  }
  return [err, fail];
}

export function genToken(){
  let secret = "dfZ2bnrTHfperANtWZGdnx0HRwE1W92n";
  let client = "wx_ad_efficiency";
  let timestamp = Math.floor(Date.now() / 1000);
  let sign = sha1(client + secret + timestamp);
  let buffer = new Buffer(client + "," + timestamp + "," + sign);
  let token = buffer.toString('base64');
  console.log(token);
  return token;
}

export async function superView(aid, wxid){
  let url = "http://jiqimao.woa.com/eib/power_preview/bind_audience";
  let req_data = {
    "aid": aid,
    "uid": 17194315,
    "period_seconds": 1800,
    "bind_source_type": "BIND_SOURCE_TYPE_JIQIMAO",
    "operator_id": "joycesong",
    "wxid": wxid,
    "wx_bind_type": "2",
  }
  let header_dict = {
    "Content-Type": "application/json",
    "token": genToken()
  }

  let resp = await got( {method: 'post', url: url, body: JSON.stringify(req_data), decompress: false, headers: header_dict, timeout: 20000});
  if (resp.statusCode == 200){
    if (JSON.parse(resp.body).code === 0){
      let rawData = resp.body;
      //this.logger.log(rawData);
      return true;
    }
  }else {
    //this.logger.error(`$$$$ there is something wrong`);
  }
  return false;
}