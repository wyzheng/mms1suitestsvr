import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import { adActivityClass, wxAdClass } from "../lib/utils/resultMap";
import { addAttach, addMsg } from "jest-html-reporters/helper";
import { finderOperation, getHeightOfEle, superView } from "../lib/utils/helper";

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;

let resArr = [];
let num = 0;
let pass = 0;
let fail = 0;
let err = 0;



describe("微信品专广告", () => {


  beforeAll(async () => {
    await superView(6404918230, "wxid_dl6z2p8aq2vt12");
    pageExtend = await setup("wxadtestPicH5", 20,3194254117);
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

  test("> q=wxadtestPicH5，验证混排结果页品专广告是否召回", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 检查混排页是否召回品专广告`
      });
      await page.waitForTimeout(1000);
      const image =  await page.screenshot({
        path: "./static/pic/test_PicH5.png"
      })
      await addAttach({attach: image, description: "页面截图"});
      expect(page).toHaveElement("div.ui-zone-ad");
    } catch(e){
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);


  test("> 点击广告头部，验证是否正确跳转到百度首页 ", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击品专广告头部区域，检查跳转目标为H5页面（百度首页）`
      });
      await page.waitForSelector(wxAdClass.head);
      let ele =  await page.$(wxAdClass.head);
      let path = './static/pic/ad_head.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "广告头部截图"});
      await page.click(wxAdClass.head);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png"
      })
      await addAttach({attach: screenshotBuffer, description: "落地页截图"});
      expect(pageExtend.url).toContain("http://www.baidu.com");
      expect(await page2.title()).toBe("百度一下");
    }catch (e){
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);


  test("> 验证\"了解更多 \"外链文案是否正确；点击外链，验证是否正确跳转到百度首页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 检查广告头部展示"了解更多"外链\n  3. 点击"了解更多"，检查跳转目标为H5页面（百度首页）`
      });
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.extent);
      let ele =  await page.$(wxAdClass.extent);
      let path = './static/pic/ad_extent.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "外链截图"});

      let content = await page.evaluate(async (eleClass)  => {
        return document.querySelector(eleClass.extent_content).innerHTML;
      }, wxAdClass);
      expect(content).toBe("了解更多");

      await page.click(wxAdClass.extent);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png"
      })
      await addAttach({attach: screenshotBuffer, description: "落地页截图"});
      expect(pageExtend.url).toContain("http://www.baidu.com");
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 验证广告反馈图标、弹窗展示正常，点击广告图标，验证是否正确跳转到广告投诉落地页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 检查广告头部展示"广告"反馈图标\n  3. 点击"广告"图标，展示"投诉广告"弹窗 \n  4. 点击"投诉广告"，跳转到广告投诉落地页\n  5. 再次点击"广告"反馈图标，收起"投诉广告"弹窗`
      });
      await page.bringToFront();
      //广告按钮
      await page.waitForSelector(wxAdClass.feedback);
      let ele =  await page.$(wxAdClass.feedback);
      let path = './static/pic/ad_feedback.png';
      let image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "广告反馈按钮"});
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
      await addAttach({attach: screenshotBuffer, description: "广告反馈页面截图"});

      await page.bringToFront();
      //再次点击收起投诉广告按钮
      await page.click(wxAdClass.feedback);
      await page.waitForTimeout(1000);
      let display =  await page.evaluate((className) => {
        let item = document.querySelector(className.feedback_mask);
        return getComputedStyle(item).display;
      }, wxAdClass)
      expect(display).toBe("none");
    }catch (e){
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);


  test("> 验证广告名称为\"唯品会小程序\"，验证\"官方\"标签是否正常显示", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 查看广告名称为"唯品会小程序"\n  3. 广告名称后展示"官方"标签，两者一行展示`
      });
      await page.bringToFront();
      let content = await page.evaluate(async (eleClass)  => {
        let item = document.querySelector(eleClass.title);
        let color = getComputedStyle(item).color;
        let inner = item.innerHTML;
        let tagTitle = document.querySelector(eleClass.tagContent).innerHTML;
        return  [color, inner, tagTitle];
      }, wxAdClass);

      expect(content[1].split("<em>")[0]).toBe("唯品会小程序");
      expect(page).toHaveElement(wxAdClass.tagContent)
      expect(content[2]).toBe("官方");

      let ele =  await page.$$(wxAdClass.headTitle);
      let path = './static/pic/ad_title.png';
      const image =  await ele.at(1).screenshot({path: path});
      await addAttach({attach: image, description: "广告名称截图"});

      //测试两个组件在一行
      let title_Height = await getHeightOfEle(page, wxAdClass.headSpan);
      let tag_Height = await getHeightOfEle(page, wxAdClass.headSpan + ':nth-of-type(3)');
      expect(title_Height).toBeCloseTo(tag_Height, 2);

    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击广告名称，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击广告名称区域，检查跳转目标为"唯品会特卖"小程序`
      });
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.headTitle);
      let ele =  await page.$(wxAdClass.headTitle);
      let path = './static/pic/ad_title.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "广告名称截图"});
      await page.click(wxAdClass.headTitle);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    }catch (e){
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击门店地址按钮，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击测试门店地址按钮，检查跳转目标为"唯品会特卖"小程序`
      });
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.loc);
      let ele =  await page.$(wxAdClass.loc);
      let path = './static/pic/ad_loc.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "地址按钮"});
      await page.click(wxAdClass.loc);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击在线客服按钮，验证跳转链接配置是否正确", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击在线客服按钮，检查跳转url正确`
      });
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.helper);
      let ele =  await page.$(wxAdClass.helper);
      let path = './static/pic/ad_helper.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "在线客服"});
      await page.click(wxAdClass.helper);
      await page.waitForTimeout(700);
      expect(pageExtend.url).toBe("https://work.weixin.qq.com/kfid/kfc7f0d8acb45de1b0a");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击联系电话按钮，验证是否正确展示弹窗及对应联系电话", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击联系电话按钮，显示联系电话弹窗\n  3. 检查联系电话为："0755-10016"\n  4. 点击联系电话呼叫按钮，检查当前呼叫电话正确`
      });
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
      let phoneArr = ["0755-10016"];
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
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 验证广告\"门店地址\"、\"联系电话\"、 \"在线客服\"按钮是否在一行展示", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.查看"门店地址"、"联系电话"、 "在线客服"按钮一行展示`
      });
      let loc_height =  await getHeightOfEle(page, wxAdClass.loc);
      let helper_height =  await getHeightOfEle(page, wxAdClass.helper);
      let phone_height =  await getHeightOfEle(page, wxAdClass.phone);
      expect(loc_height).toBeCloseTo(helper_height, 2);
      expect(helper_height).toBeCloseTo(phone_height, 2);
      expect(phone_height).toBeCloseTo(loc_height, 2);
      let ele =  await page.$$(wxAdClass.headTitle);
      let path = './static/pic/ad_title.png';
      const image =  await ele.at(1).screenshot({path: path});
      await addAttach({attach: image, description: "信息截图"});
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 验证广告视频号账号信息展示正确；点击账号，验证是否正确跳转到\"WXAD测试号\"视频号", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 查看视频号账号信息，标题为"WXAD测试号"，底部显示"视频号"\n  3. 点击视频号账号主体，检查跳转目标为"WXAD测试号"视频号`
      });
      await page.bringToFront();
      await page.waitForSelector(wxAdClass.account);
      let ele =  await page.$(wxAdClass.account);
      let path = './static/pic/ad_finder.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "账号截图"});

      let content = await page.evaluate(async (eleClass)  => {
        let title = document.querySelector(eleClass.account_title).innerHTML;
        let desc = document.querySelector(eleClass.account_desc).innerHTML;
        return  [title, desc];
      }, wxAdClass);
      expect(content[0]).toBe("WXAD测试号");
      expect(content[1]).toBe("视频号");

      await page.click(wxAdClass.account);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("v2_060000231003b20faec8c7e28d1ecad2c900ea34b077192ae8bad1b4f00e998bfc98c5f05d66@finder");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 关注视频号账号，验证账号\"已关注\"标签是否正常显示", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.关注视频号，刷新结果页，视频号账号显示"已关注"标签`
      });
      await page.bringToFront();
      await finderOperation("v2_060000231003b20faec8c7e28d1ecad2c900ea34b077192ae8bad1b4f00e998bfc98c5f05d66@finder", 1, "wxid_dl6z2p8aq2vt12");
      await page.click(wxAdClass.select_tab);
      await page.waitForTimeout(1700);

      let image = await page.screenshot();
      await addAttach({attach: image, description: "页面截图"});

      let content = await page.evaluate(async (eleClass)  => {
        let item = document.querySelector("div.ad-account-info__list div.ad-account-info__item.active__item div.ui-tag-title");
        return item.innerHTML;
      }, wxAdClass);
      let ele =  await page.$(wxAdClass.account);
      image =  await ele.screenshot({path: './static/pic/ad_gzh1.png'});
      await addAttach({attach: image, description: "视频号号账号已关注截图"});
      await finderOperation("v2_060000231003b20faec8c7e28d1ecad2c900ea34b077192ae8bad1b4f00e998bfc98c5f05d66@finder", 2, "wxid_dl6z2p8aq2vt12");
      expect(content).toBe("已关注");
      //expect(content).toBe("已关注");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError") {
        fail++;
      } else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);


 test("> 点击热门活动1，验证是否正确跳转到百度首页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击热门活动第1个活动，检查跳转目标为H5页面（百度首页）`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(1, 0).activity);
      await page.hover(adActivityClass(1, 0).activity);
      await page.waitForTimeout(7000);
      /*let ele =  await page.$(adActivityClass(1, 0).activity);
      let path = './static/pic/ad_activity.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动"});*/

      await page.click(adActivityClass(1, 0).activity);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png"
      })
      await addAttach({attach: screenshotBuffer, description: "落地页截图"});
      expect(pageExtend.url).toContain("http://www.baidu.com");
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动2，验证是否正确跳转到百度首页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击热门活动第2个活动，检查跳转目标为H5页面（百度首页）`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(2, 0).activity);
      await page.hover(adActivityClass(2, 0).activity);
      await page.waitForTimeout(700);
     /* let ele =  await page.$(adActivityClass(2, 0).activity);
      let path = './static/pic/ad_activity.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动"});*/

      await page.click(adActivityClass(2, 0).activity);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png"
      })
      await addAttach({attach: screenshotBuffer, description: "落地页截图"});
      expect(pageExtend.url).toContain("http://www.baidu.com");
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动3，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击热门活动第3个活动，检查跳转目标为"唯品会特卖"小程序`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(3, 0).activity);
      await page.hover(adActivityClass(3, 0).activity);
      await page.waitForTimeout(700);
      /*let ele =  await page.$(adActivityClass(3, 0).activity);
      let path = './static/pic/ad_activity.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动"});*/

      await page.click(adActivityClass(3, 0).activity);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动3左侧菜单，验证是否正确跳转到百度首页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.点击第3条热门活动左侧菜单，检查跳转目标为H5页面（百度首页）`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(3, 1).activity_menus);
      await page.hover(adActivityClass(3, 1).activity_menus);
      await page.waitForTimeout(7000);
      /*let ele =  await page.$(adActivityClass(3, 1).activity_menus);
      let path = './static/pic/ad_activity_menu.png';
      const image =  await page.screenshot({path: path});
      await addAttach({attach: image, description: "活动菜单"});*/
      await page.click(adActivityClass(3, 1).activity_menus);
      await page.waitForTimeout(700);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png"
      })
      await addAttach({attach: screenshotBuffer, description: "百度页面截图"});
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动3右侧菜单，验证是否正确跳转广告原生页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.点击第3条热门活动右侧菜单，检查跳转目标广告原生页，校验canvansid`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(3, 2).activity_menus);
      await page.hover(adActivityClass(3, 2).activity_menus);
      await page.waitForTimeout(700);
      /*let ele =  await page.$(adActivityClass(3, 2).activity_menus);
      let path = './static/pic/ad_activity_menu.png';
      const image =  await page.screenshot({path: path});
      await addAttach({attach: image, description: "活动菜单"});*/
      await page.click(adActivityClass(3, 2).activity_menus);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("2579639827");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动4，验证是否正确跳转到百度首页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2. 点击热门活动第4个活动，检查跳转目标为H5页面（百度首页）`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(4, 0).activity);
      await page.hover(adActivityClass(4, 0).activity);
      await page.waitForTimeout(700);
      /*let ele =  await page.$(adActivityClass(4, 0).activity);
      let path = './static/pic/ad_activity.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动"});*/

      await page.click(adActivityClass(4, 0).activity);
      let page2 = await pageExtend.click("outer");
      const screenshotBuffer = await page2.screenshot({
        path: "./static/pic/test_baidu.png",
        fullPage: true
      })
      await addAttach({attach: screenshotBuffer, description: "活动菜单"});
      expect(await page2.title()).toBe("百度一下");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动4左侧菜单，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.点击第4条热门活动左侧菜单，检查跳转目标为"唯品会特卖"小程序`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(4, 1).activity_menus);
      await page.hover(adActivityClass(4, 1).activity_menus);
      await page.waitForTimeout(7000);
      /*let path = './static/pic/ad_activity_menu.png';
      const image =  await page.screenshot({path: path});
      await addAttach({attach: image, description: "活动菜单"});*/
      await page.click(adActivityClass(4, 1).activity_menus);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动4右侧菜单，验证是否正确跳转到广告原生页", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.点击第4条热门活动右侧菜单，检查跳转目标广告原生页，校验canvansid`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(3, 2).activity_menus);
      await page.hover(adActivityClass(3, 2).activity_menus);
      await page.waitForTimeout(700);
      /*let ele =  await page.$(adActivityClass(3, 2).activity_menus);
      let path = './static/pic/ad_activity_menu.png';
      const image =  await page.screenshot({path: path});
      await addAttach({attach: image, description: "活动菜单"});*/
      await page.click(adActivityClass(3, 2).activity_menus);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("2579639827");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动5，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.点击第5条热门活动的行动按钮，检查跳转目标为"唯品会特卖"小程序`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(5, 0).activity);
      await page.hover(adActivityClass(5, 0).activity);
      await page.waitForTimeout(700);
      /*let ele =  await page.$(adActivityClass(5, 0).activity);
      let path = './static/pic/ad_activity_button.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动按钮截图"});*/
      await page.click(adActivityClass(5, 0).activity);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 点击热门活动5行动按钮，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    try {
      await addMsg({
        context: undefined,
        message: ` 测试步骤：\n  1. 输入搜索query=wxadtestPicH5,发起搜索\n  2.点击第34条热门活动的行动按钮，检查跳转目标为"唯品会特卖"小程序`
      });
      await page.bringToFront();
      await page.waitForSelector(adActivityClass(5, 0).activity_button);
      await page.hover(adActivityClass(5, 0).activity_button);
      await page.waitForTimeout(700);
      /*let ele =  await page.$(adActivityClass(5, 0).activity_button);
      let path = './static/pic/ad_activity_button.png';
      const image =  await ele.screenshot({path: path});
      await addAttach({attach: image, description: "活动按钮截图"});*/
      await page.click(adActivityClass(5, 0).activity_button);
      await page.waitForTimeout(700);
      expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    }catch (e) {
      if (e.constructor.name == "JestAssertionError"){
        fail++;
      }else {
       err++;
        await addMsg({
          context: undefined,
          message: `测试任务出错...`
        });
      }
      throw e;
    }
  },50000);

  test("> 测试结果汇总", async () => {
    num = num - 1;
    pass = num - fail - err;
    resArr = [num, pass, fail, err];
    await addMsg({context: undefined, message: `当前测试集合共有${num}条用例，其中测试通过${pass}条，测试失败${fail}条，测试任务失败${err}条`});
  }, 5000);

})