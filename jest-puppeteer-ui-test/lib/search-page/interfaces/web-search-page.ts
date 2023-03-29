// @ts-ignore
import type {JSAPI} from "@tencent/web-search-puppeteer-page"

interface DebugInfoRsp {
  DebugInfo: string; // [default = ""]; // debug info内容，字符串展示即可
}

interface SKBuiltinString_t {
  String: string;
}

interface BaseResponse {
  Ret: number;
  ErrMsg: SKBuiltinString_t;
}

export interface WebSearchResponse {
  BaseResponse?: BaseResponse;
  UpdateCode: number;  // 返回码：0正常、1更新
  Offset: number;
  Json: string; // json
  DebugInfo?: DebugInfoRsp;
  OssDiagnoseLogInfo?: string;
}

export interface CaseCTx {
  page: string;
  scene: number;
  businessType: number;
  query?: string;
}

const teach:JSAPI  = `onTeachSearchDataReady`;
const result:JSAPI  = `onSearchDataReady`;

export const PageJsapi = {
  index: teach,
  result: result,
  teach: teach
}