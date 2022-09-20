import { PageExtend } from "../lib/search-page/page-extend";
import Puppeteer from "puppeteer";
import * as fs from "fs";
import {} from "@jest/reporters";
import { readTestJson } from "../lib/utils/helper";
import { WebSearchResponse } from "../lib/search-page/interfaces/web-search-page";
import { setup } from "../lib/utils/setup";
/**
 * edit by joyce on 2022/08/05
 *
 * already realize to get the data from a json file.
 */

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;

let testJson = readTestJson("./asset/test.json");


describe(testJson["title"], () => {

  beforeAll(async () => {
    let searchRes: WebSearchResponse = {
      UpdateCode: 0,
      Offset: 0,
      Json: testJson["respData"]
    };
    pageExtend = await setup(searchRes);
    page = pageExtend.webSearchPage.instance;
    browser = pageExtend.browser;
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  for (let i = 0; i < testJson["tests"].length; i++) {
    if (i == 0){
      test(testJson["tests"][0]["title"], async () => {
        global.reporter
          .description(testJson["tests"][0]["description"])
          .story("BOND-007");

        try {
          const image =  await page.screenshot({
            path: "./static/pic/test_1.png",
            fullPage: true
          })
          global.reporter.addAttachment("Screenshot", image, "image/png");
        }
        catch (e){
          if (e instanceof Puppeteer.TimeoutError){
            console.log("e");
          }
        }

      },testJson["tests"][i]["timeout"]);
    }

    if (i == 1){
      test(testJson["tests"][i]["title"], async () => {
        global.reporter
          .description(testJson["tests"][i]["description"])
          .story("BOND-007");

        global.reporter.startStep("here start click");
        await page.waitForSelector('#search_result > div:nth-child(5) > div > div:nth-child(3) > div > div > div');
        await page.click('#search_result > div:nth-child(5) > div > div:nth-child(3) > div > div > div');
        global.reporter.endStep();

        let url = pageExtend.url;
        const page2 = await browser.newPage();
        await page2.goto(url, {waitUntil: "networkidle0"})
        // 滚动到页面底部，加载出所有图片
        await page2.evaluate(async () => {
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
        });
        await page2.waitForTimeout(7000);
        const screenshotBuffer = await page2.screenshot({
          path: "./static/pic/test_2.png"
        })
        global.reporter.addAttachment("Screenshot", screenshotBuffer, "image/png");
        const tit = await page2.title()
        expect(tit).toBe('人民日报：新版0-6岁儿童疫苗接种时间表！建议收藏');
      },testJson["tests"][i]["timeout"]);
    }
  }

});
