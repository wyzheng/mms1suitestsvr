import fs from "fs";
import got from "got";
import {LoggerService} from "../logger/logger.service";
import {randomInt} from "crypto";
import ini from "ini";
import { SearchGuideResponse } from "@tencent/web-search-puppeteer-page/lib/proto";


const logger = new LoggerService().getLogger("puppeteer");

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

function getIpPort(moudle: string) {
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
      logger.error(`$$$$$ there is something wrong ${err}`);
    }
  }
  if (ip_port_list.length > 0){
    return ip_port_list[randomInt(1, 1000) % ip_port_list.length];
  }
  return [0, 0];
}

function getUrl(module: string, funcName: string){
  let server = getIpPort(module);
  logger.log(`http://${server[0]}:${server[1]}/${funcName}`);
  if (server[0] != 0 && server[1] != 0){
    return `http://${server[0]}:${server[1]}/${funcName}`;
  }
  return "";
}

async function mmSearch(url: string, data){
  let uin = "3192443972";
  let  header_dict = {
    "Accept": "*/*",
    "Content-Type": "application/json; charset=utf-8",
    "Cookie": `uin=${uin};uid=${uin}`
  };
  let resp = await got( {method: 'post', url: url, body: JSON.stringify(data), decompress: false, headers: header_dict, timeout: 20000});

  if (resp.statusCode == 200){
    let rawData = resp.body;
    logger.log(`$$$$ get resp success`);
    return JSON.parse(rawData);
  }else {
    logger.error(`$$$$ there is something wrong`);
  }
}

export  async function getSearchData(data) {
  let url = getUrl("mmsearchossopenapisvr", "GetSearchResultLite")
  let resp =  await mmSearch(url, data);
  return resp.rsp;
}

export async function teach(data) {
  const resp: SearchGuideResponse = { Json: "" }
  return resp
}