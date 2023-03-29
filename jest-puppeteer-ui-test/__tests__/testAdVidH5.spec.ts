import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import {wxAdClass } from "../lib/utils/resultMap";
import { addAttach, addMsg } from "jest-html-reporters/helper";
import { getHeightOfEle, superView } from "../lib/utils/tools";

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
    await superView(6404924829, "wxid_rjj5aeepedvz12");
    pageExtend = await setup("wxadtestVidH5", 20, 3190188714, true);
    page = pageExtend.webSearchPage.instance;
    browser = pageExtend.browser;
  });

  afterAll(async () => {
    if (!page.isClosed()) {
      await browser.close();
    }
  });

  beforeEach(() => {
    num = num + 1;
  })

  test("> q=wxadtestVidH5，验证混排结果页品专广告是否召回", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 检查混排页是否召回品专广告`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForTimeout(1000);
        const image =  await page.screenshot({
          path: "./static/pic/test_VidH5.png"
        })
        await addAttach({attach: image, description: "页面截图"});
        break;
      } catch(e){
        if (num == 1){
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
        num--;
      }
    }
  },50000);

  test("> 点击广告头部，验证是否正确跳转到百度首页", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 点击品专广告头部区域，检查跳转目标为H5页面（百度首页）`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxAdClass.head);
        let ele =  await page.$(wxAdClass.head);
        let path = './static/pic/ad_head.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxAdClass.head);
        await page.waitForTimeout(700);
        let page2 = await pageExtend.click("outer");
        const screenshotBuffer = await page2.screenshot({
          path: "./static/pic/test_baidu.png",
          fullPage: true
        })
        await addAttach({attach: screenshotBuffer, description: "落地页截图"});
        expect(await page2.title()).toBe("百度一下");
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);

  test("> 验证\"了解更多 \"外链文案是否正确；点击外链，验证是否正确跳转到百度首页", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 检查广告头部展示"了解更多"外链\n  3. 点击"了解更多"，检查跳转目标为H5页面（百度首页）`
    });
    let num = 3;
    while(num != 0){
      try {
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
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);

  test("> 验证广告反馈图标、弹窗展示正常，点击广告图标，验证是否正确跳转到广告投诉落地页", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 检查广告头部展示"广告"反馈图标\n  3. 点击"广告"图标，展示"投诉广告"弹窗 \n  4. 点击"投诉广告"，跳转到广告投诉落地页\n  5. 再次点击"广告"反馈图标，收起"投诉广告"弹窗`
    });
    let num = 3;
    while(num != 0){
      try {
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
        break;
      }catch (e){
        if (num == 1){
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
        num--;
      }
    }
  },50000);


  test("> 验证广告名称为\"快乐测试123\"，验证\"官方\"标签是否正常显示 ", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 查看广告名称为"快乐测试123"\n  3. 广告名称后展示"官方"标签，两者一行展示`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass.title);
          let color = getComputedStyle(item).color;
          let inner = item.innerHTML;
          let tagTitle = document.querySelector(eleClass.tagContent).innerHTML;
          return  [color, inner, tagTitle];
        }, wxAdClass);
        expect(content[1].split("<em>")[0]).toBe("快乐测试123");
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
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);

  test("点击广告名称，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 点击广告名称区域，检查跳转目标为"唯品会特卖"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.headTitle);
        let ele =  await page.$(wxAdClass.headTitle);
        let path = './static/pic/ad_title.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告名称截图"});
        await page.click(wxAdClass.headTitle);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);


  test("> 验证广告小程序账号信息展示正确；点击小程序账号，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 查看小程序账号信息，标题为"唯品会特卖"，底部显示"小程序"\n  3. 点击小程序账号主体，检查跳转目标为唯品会特卖小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.account);
        let ele =  await page.$(wxAdClass.account);
        let path = './static/pic/ad_account.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "小程序账号截图"});

        let content = await page.evaluate(async (eleClass)  => {
          let title = document.querySelector(eleClass.account_title).innerHTML;
          let desc = document.querySelector(eleClass.account_desc).innerHTML;
          let tagTitle = document.querySelector(eleClass.account_tag).innerHTML;
          return  [title, desc, tagTitle];
        }, wxAdClass);
        expect(content[0]).toBe("唯品会特卖");
        expect(content[1]).toBe("小程序");
        await page.click(wxAdClass.account);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);


  test("点击门店地址按钮，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 点击测试门店地址按钮，检查跳转目标为"唯品会特卖"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.loc);
        let ele =  await page.$(wxAdClass.loc);
        let path = './static/pic/ad_loc.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "地址按钮"});
        await page.click(wxAdClass.loc);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);


  test("> 点击在线客服按钮，验证跳转链接配置是否正确", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 点击在线客服按钮，检查跳转url正确`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.helper);
        let ele =  await page.$(wxAdClass.helper);
        let path = './static/pic/ad_helper.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "在线客服"});
        await page.click(wxAdClass.helper);
        await page.waitForTimeout(700);
        expect(pageExtend.url).toBe("https://work.weixin.qq.com/kfid/kfc7f0d8acb45de1b0a");
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);


  test("> 点击联系电话按钮，验证是否正确展示弹窗及对应联系电话", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=wxadtestVidH5,发起搜索\n  2. 点击联系电话按钮，显示联系电话弹窗\n  3. 检查联系电话为："17000001688、17000001689、0755-10016"\n  4. 点击联系电话呼叫按钮，检查当前呼叫电话正确`
    });
    let num = 3;
    while(num != 0){
      try {
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
          if (i < phoneArr.length - 1){
            await page.click(wxAdClass.phone);
          }
        }
        break;
      }catch (e) {
        if (num == 1){
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
        num--;
      }
    }
  },50000);

  test("> 测试结果汇总", async () => {
    num = num - 1;
    pass = num - fail - err;
    resArr = [num, pass, fail, err];
    await addMsg({context: undefined, message: `当前测试集合共有${num}条用例，其中测试通过${pass}条，测试失败${fail}条，测试任务失败${err}条`});
  }, 5000);

})