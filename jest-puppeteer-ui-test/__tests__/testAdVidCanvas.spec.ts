import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import {wxAdClass } from "../lib/utils/resultMap";
import { addAttach, addMsg } from "jest-html-reporters/helper";
import { bizOperation, superView } from "../lib/utils/helper";

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;

let resArr = [];
let num = 0;
let pass = 0;
let fail = 0;
let err = 0;


describe("微信品专广告测试 -- wxadtestVidCanvas", () => {

  beforeAll(async () => {
    await superView(6404921429, "wxid_b1axyqt9ni9a12");
    pageExtend = await setup("wxadtestVidCanvas", 20, 3191187942);
    page = pageExtend.webSearchPage.instance;
    browser = pageExtend.browser;
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });
  beforeEach(() => {
    num = num + 1;
  })

  test("截图", async () => {
    try {
      await addMsg({context: undefined, message: `当前广告结果页截图。`});
      await page.waitForTimeout(1000);
      const image =  await page.screenshot({
        path: "./static/pic/test_VidCanvas.png",
      })
      await addAttach({attach: image, description: "页面截图"});
    } catch(e){
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  // ad canvans
  test("测试广告头部点击 ", async () => {
    try {
      await addMsg({context: undefined, message: `测试广告头部点击，点击跳转到原生页面，校验canvansid。`});
      await page.waitForSelector(wxAdClass.head);
      let ele =  await page.$(wxAdClass.head);
      let path = './static/pic/ad_head.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "广告头部截图"});
      await page.click(wxAdClass.head);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("2579661584");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("测试外链点击", async () => {
    try {
      await addMsg({context: undefined, message: `测试外链点击，点击跳转到原生页面，校验canvansid。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.extent);
      let ele =  await page.$(wxAdClass.extent);
      let path = './static/pic/ad_extent.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "广告外链截图"});
      await page.click(wxAdClass.extent);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("2579661584");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("测试广告名称 ", async () => {
    try {
      await addMsg({context: undefined, message: `测试广告名称为"快乐测试123"，测试"官方"标签。`});
      await page.bringToFront();
      let content = await page.evaluate(async (eleClass)  => {
        let item = document.querySelector(eleClass.title);
        let color = getComputedStyle(item).color;
        let inner = item.innerHTML;
        let tagTitle = document.querySelector(eleClass.tagContent).innerHTML;
        return  [color, inner, tagTitle];
      }, wxAdClass);
      //expect(content[0]).toBe("rgb(6, 174, 86)");
      expect(content[1].split("<em>")[0]).toBe("快乐测试123");
      expect(page).toHaveElement(wxAdClass.tagContent)
      expect(content[2]).toBe("官方");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);


  test("测试广告账号（公众号账号）", async () => {
    try {
      await addMsg({context: undefined, message: `测试广告公众号账号，点击跳转目标正确。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.account);
      let ele =  await page.$(wxAdClass.account);
      let path = './static/pic/ad_gzh.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "公众号账号截图"});
      await page.click(wxAdClass.account);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_1e80bb81a1d2");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("公众号账号关注", async () => {
    try {
      await addMsg({context: undefined, message: `公众号点击关注后显示"已关注"tag。`});
      await page.bringToFront();
      //公众号关注
      await bizOperation("AddBizContact", 3094043316);
      await page.click(wxAdClass.select_tab);
      await page.waitForTimeout(1700);

      await addMsg({context: undefined, message: `关注公众号`});

      let image = await page.screenshot();
      await addAttach({attach: image, description: "页面截图"});

      let content = await page.evaluate(async (eleClass)  => {
        let item = document.querySelector("div.ad-account-info__list div.ad-account-info__item.active__item:nth-of-type(2) div.ui-tag-title");
        return item.innerHTML;
      }, wxAdClass);
      let ele =  await page.$(wxAdClass.account);
      image =  await ele.screenshot({path: './static/pic/ad_gzh1.png'});
      await addAttach({attach: image, description: "公众号账号已关注截图"});
      await bizOperation("DelBizContact", 3094043316);
      expect(content).toBe("已关注");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("测试地址按钮", async () => {
    try {
      await addMsg({context: undefined, message: `测试地址按钮，点击跳转到外部H5链接（百度首页）。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.loc);
      let ele =  await page.$(wxAdClass.loc);
      let path = './static/pic/ad_loc.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "地址按钮截图"});
      await page.click(wxAdClass.loc);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png",
        fullPage: true
      })
      await addAttach({attach: screenshotBuffer, description: "地址落地页截图"});
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  // todo 链接需要客户端支持
  test("测试在线客服", async () => {
    try {
      await addMsg({context: undefined, message: `测试广告在线按钮，点击目标链接正确。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.helper);
      let ele =  await page.$(wxAdClass.helper);
      let path = './static/pic/ad_helper.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "在线客服截图"});
      await page.click(wxAdClass.helper);
      await page.waitForTimeout(700);
      expect(pageExtend.url).toBe("https://work.weixin.qq.com/kfid/kfc7f0d8acb45de1b0a");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("测试广告投诉按钮 -- header_complaint", async () => {
    try {
      await addMsg({context: undefined, message: `测试广告反馈，点击广告标出现广告反馈弹窗，点击广告投诉按钮，落地页正常。`});
      await page.bringToFront();
      //广告按钮
      await page.waitForSelector(wxAdClass.feedback);
      let ele =  await page.$(wxAdClass.feedback);
      let path = './static/pic/ad_feedback.png';
      let image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "广告标"});
      await page.click(wxAdClass.feedback);

      //投诉广告按钮
      await page.waitForTimeout(700);
      await page.waitForSelector(wxAdClass.complaint);
      ele =  await page.$(wxAdClass.complaint);
      path = './static/pic/ad_complaint.png';
      image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "投诉弹窗"});
      await page.click(wxAdClass.complaint);
      await page.waitForTimeout(1000);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_feedback.png",
        fullPage: true
      })
      await addAttach({attach: screenshotBuffer, description: "投诉落地页"});

      await page.bringToFront();
      //再次点击收起投诉广告按钮
      await page.click(wxAdClass.feedback);
      await page.waitForTimeout(1000);
      let display =  await page.evaluate((className) => {
        let item = document.querySelector(className.feedback_mask);
        return getComputedStyle(item).display;
      }, wxAdClass)
      expect(display).toBe("none");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);


  test("测试活动点击", async () => {
    try {
      await addMsg({context: undefined, message: `测试活动截图`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.activity);
      await page.hover(wxAdClass.activity);
      await page.waitForTimeout(7000);
      let ele =  await page.$(wxAdClass.activity);
      let path = './static/pic/ad_activity.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动截图"});
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);


  test("测试活动菜单点击", async () => {
    try {
      await addMsg({context: undefined, message: `测试活动菜单点击，点击跳转到外部H5页面（百度首页）。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.activity_menus);
      await page.hover(wxAdClass.activity_menus);
      await page.waitForTimeout(7000);
      let ele =  await page.$(wxAdClass.activity_menus);
      let path = './static/pic/ad_activity_menu.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动菜单截图"});
      await page.click(wxAdClass.activity_menus);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png",
        fullPage: true
      })
      await addAttach({attach: screenshotBuffer, description: "活动菜单截图"});
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("测试活动按钮点击", async () => {
    try {
      await addMsg({context: undefined, message: `测试活动按钮点击，点击跳转到公众号。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.activity_button);
      await page.hover(wxAdClass.activity_button);
      await page.waitForTimeout(700);
      let ele =  await page.$(wxAdClass.activity_button);
      let path = './static/pic/ad_activity_button.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动按钮截图"});
      await page.click(wxAdClass.activity_button);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_1e80bb81a1d2");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("测试联系电话按钮", async () => {
    try {
      await addMsg({context: undefined, message: `测试联系电话点击弹窗正常：17000001688、17000001689、0755-10016。`});
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.phone);
      let ele = await page.$(wxAdClass.phone);
      await page.click(wxAdClass.phone);
      await page.waitForTimeout(1000);
      let path = './static/pic/ad_phone.png';
      let image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "联系电话"});
      await page.waitForSelector(wxAdClass.half_dialog);
      ele = await page.$(wxAdClass.half_dialog);
      image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "联系电话弹窗"});
      let phoneArr = ["17000001688", "17000001689", "0755-10016"];
      await page.waitForSelector(wxAdClass.number);
      let content = await page.evaluate(async (eleClass)  => {
        let items = document.querySelectorAll(eleClass.number);
        let number = [];
        for (let i = 0; i < items.length; i++) {
          number.push(items[i].innerHTML);
        }
        return number;
      }, wxAdClass);

      for (let i = 0; i < phoneArr.length; i++) {
        expect(content[i]).toBe(phoneArr[i]);
      }
      for (let i = 0; i < phoneArr.length; i++) {
        let selector = wxAdClass.call_button + `:nth-of-type(${i+1}) div.ui-half-screen-sheet-button-container a`;
        let path = './static/pic/ad_call.png';
        let ele = await page.$(selector);
        await ele.screenshot({path: path});
        await page.click(selector);
        await page.waitForTimeout(1000);
        expect(pageExtend.extendInfo).toBe(phoneArr[i]);
        if(i < phoneArr.length - 1){
          await page.click(wxAdClass.phone);
        }
      }
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
        err++;
      }
      throw e;
    }
  },50000);

  test("汇总", async () => {
    num = num - 1;
    pass = num - fail - err;
    resArr = [num, pass, fail, err];
    await addMsg({context: undefined, message: `当前测试集合共有${num}条用例，其中测试通过${pass}条，测试失败${fail}条，测试任务失败${err}条`});
  }, 5000);

})