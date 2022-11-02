import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import {wxAdClass } from "../lib/utils/resultMap";
import {addAttach} from "jest-html-reporters/helper";

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;


describe("微信品专广告测试 -- wxadtestVidH5", () => {

  beforeAll(async () => {
    pageExtend = await setup("wxadtestVidH5", 20);
    page = pageExtend.webSearchPage.instance;
    browser = pageExtend.browser;
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  test("截图", async () => {
    await page.waitForTimeout(1000);
    try {
      const image =  await page.screenshot({
        path: "./static/pic/test_VidH5.png",
        fullPage: true
      }).catch(()=>{})
      global.reporter.addAttachment("Screenshot", image, "image/png");
    }
    catch(err){
      console.log(err);
    }
  },50000);

  test("测试广告头部点击 ", async () => {
    await page.waitForSelector(wxAdClass.head);
    let ele =  await page.$(wxAdClass.head);
    let path = './static/pic/ad_head.png';
    const image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.head);
    await page.waitForTimeout(700);
    let page2 = await pageExtend.click("outer");
    const screenshotBuffer = await page2.screenshot({
      path: "./static/pic/test_baidu.png",
      fullPage: true
    })
    await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});
    expect(await page2.title()).toBe("百度一下");
  },50000);
  test("测试外链点击", async () => {
    await page.bringToFront();
    await page.waitForSelector(wxAdClass.extent);
    let ele =  await page.$(wxAdClass.extent);
    let path = './static/pic/ad_extent.png';
    const image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.extent);
    await page.waitForTimeout(700);
    let page2 = await pageExtend.click("outer");
    const screenshotBuffer = await page2.screenshot({
      path: "./static/pic/test_baidu.png",
      fullPage: true
    })
    await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});
    expect(await page2.title()).toBe("百度一下");
  },50000);


  test("测试广告名称 ", async () => {
    await page.bringToFront();
    let content = await page.evaluate(async (eleClass)  => {
      return  document.querySelector(eleClass.title).innerHTML;
    }, wxAdClass);
    expect(content).toBe("快乐测试123");
  },50000);

  test("测试名称点击", async () => {
    await page.bringToFront();
    await page.waitForSelector(wxAdClass.title);
    let ele =  await page.$(wxAdClass.title);
    let path = './static/pic/ad_title.png';
    const image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.extent);
    await page.waitForTimeout(700);
    expect(pageExtend.extendInfo).toBe("唯品会特卖");
  },50000);


  test("测试广告账号（视频号账号）", async () => {
    await page.bringToFront();
    await page.waitForSelector(wxAdClass.account);
    let ele =  await page.$(wxAdClass.account);
    let path = './static/pic/ad_finder.png';
    const image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.account);
    await page.waitForTimeout(700);
    expect(pageExtend.extendInfo).toBe("唯品会特卖");
  },50000);


  test("测试地址按钮 -- info_loc_to_weapp", async () => {
    await page.bringToFront();
    await page.waitForSelector(wxAdClass.loc);
    let ele =  await page.$(wxAdClass.loc);
    let path = './static/pic/ad_loc.png';
    const image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.loc);
    await page.waitForTimeout(700);
    expect(pageExtend.extendInfo).toBe("唯品会特卖");
  },50000);

  // todo 链接需要客户端支持
  test("测试在线客服 -- info_helper", async () => {
    await page.bringToFront();
    await page.waitForSelector(wxAdClass.helper);
    let ele =  await page.$(wxAdClass.helper);
    let path = './static/pic/ad_helper.png';
    const image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.helper);
    await page.waitForTimeout(700);
    let page2 = await pageExtend.click("outer");
    const screenshotBuffer = await page2.screenshot({
      path: "./static/pic/test_helper.png",
      fullPage: true
    })
    await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});
  },50000);

  test("测试广告投诉按钮 -- header_complaint", async () => {
    await page.bringToFront();
    //广告按钮
    await page.waitForSelector(wxAdClass.feedback);
    let ele =  await page.$(wxAdClass.feedback);
    let path = './static/pic/ad_feedback.png';
    let image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.feedback);

    //投诉广告按钮
    await page.waitForTimeout(700);
    await page.waitForSelector(wxAdClass.complaint);
    ele =  await page.$(wxAdClass.complaint);
    path = './static/pic/ad_complaint.png';
    image =  await ele.screenshot({path: path});
    await addAttach({attach: image, description: "here is the ad head."});
    await page.click(wxAdClass.complaint);
    await page.waitForTimeout(1000);
    let page2 = await pageExtend.click("outer");
    const screenshotBuffer = await page2.screenshot({
      path: "./static/pic/test_feedback.png",
      fullPage: true
    })
    await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});

    //锚点到制定页面
    await page.bringToFront();
    await page.waitForTimeout(1000);
    //再次点击收起投诉广告按钮
    await page.click(wxAdClass.feedback);
    await page.waitForTimeout(1000);
    let display =  await page.evaluate((className) => {
      let item = document.querySelector(className.feedback_mask);
      return getComputedStyle(item).display;
    }, wxAdClass)
    expect(display).toBe("none");

  },50000);


})