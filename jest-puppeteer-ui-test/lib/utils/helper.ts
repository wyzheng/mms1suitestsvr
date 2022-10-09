import fs from "fs";
import got from "got";
import tunnel from "tunnel";
import {LoggerService} from "../logger/logger.service";


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
  logger.log(resp.body)

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
