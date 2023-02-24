import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import { relatedGoods, wxAdClass, wxGoodAd } from "../lib/utils/resultMap";
import { addAttach, addMsg } from "jest-html-reporters/helper";
import { getHeightOfEle, superView } from "../lib/utils/helper";

let page: Puppeteer.Page ;
let browser: Puppeteer.Browser;
let pageExtend: PageExtend;
let resArr = [];
let num = 0;
let pass = 0;
let fail = 0;
let err = 0;


describe("微信品专广告", () => {

  beforeAll(async () => {
    await superView(8587407707, "wxid_0l9zlk043rq212");
    pageExtend = await setup("testshopbtweapp", 20, 3191396391, true);
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


  test("> q=testshopbtweapp，验证混排结果页品专广告是否召回", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 检查混排页是否召回商品品专广告`
    });
    let num = 3;
    while(num != 0){
      try  {
        const image =  await page.screenshot({
          path: "./static/pic/test_shopWeapp.png"
        })
        await addAttach({attach: image, description: "页面截图"});
        expect(page).toHaveElement("div.ui-zone-ad");
        break;
      }
      catch(e){
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

  test("> 点击广告头部，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 点击广告头部，检查是否正确跳转到唯品会特卖小程序`
    });
    let num = 3;
    while(num != 0){
      try  {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.header);
        let ele =  await page.$(wxGoodAd.header);
        let path = './static/pic/ad_good_head.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxGoodAd.header);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        expect(pageExtend.weappPath).toBeStartWith("pages/special/special.html?url=https%3A%2F%2Fmst.vip.com%2Fcmstopic%2Findex%2Fs%2FIpamof&tra_from=adp%3Aej1kk8ct%3A%3A%3A%3A")
        break;
      }
      catch(e){
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
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 检查广告头部展示"广告"反馈图标\n  3. 点击"广告"图标，展示"投诉广告"弹窗 \n  4. 点击"投诉广告"，跳转到广告投诉落地页\n  5. 再次点击"广告"反馈图标，收起"投诉广告"弹窗`
    });
    let num = 3;
    while(num != 0){
      try  {
        await page.bringToFront();
        //广告按钮
        await page.waitForSelector(wxGoodAd.feedback);
        let ele =  await page.$(wxGoodAd.feedback);
        let path = './static/pic/ad_feedback.png';
        let image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告反馈按钮"});
        await page.click(wxGoodAd.feedback);

        //投诉广告按钮
        await page.waitForTimeout(700);
        await page.waitForSelector(wxGoodAd.complaint);
        ele =  await page.$(wxGoodAd.complaint);
        path = './static/pic/ad_complaint.png';
        image =  await ele.screenshot({path: path});
        //await addAttach({attach: image, description: "投诉弹窗"});
        await page.click(wxGoodAd.complaint);
        await page.waitForTimeout(1000);
        let page2 = await pageExtend.click("outer");
        const screenshotBuffer = await page2.screenshot({
          path: "./static/pic/test_feedback.png",
          fullPage: true
        })
        await addAttach({attach: screenshotBuffer, description: "广告反馈页面截图"});

        await page.bringToFront();
        //再次点击收起投诉广告按钮
        await page.click(wxGoodAd.feedback);
        await page.waitForTimeout(1000);
        let display =  await page.evaluate((className) => {
          let item = document.querySelector(className.feedback_mask);
          return getComputedStyle(item).display;
        }, wxGoodAd)
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


  test("> 验证广告名称为\"商品品专自动化测试case1\"，验证\"官方\"标签是否正常显示 ", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 查看广告名称为"商品品专自动化测试case1"\n  3. 广告名称后展示"官方"标签，两者一行展示`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass.title + " >em");
          //let color = getComputedStyle(item).color;
          let inner = item.innerHTML;
          let tagTitle = document.querySelector(eleClass.tag + " > div >div > div").innerHTML;
          return  [inner, tagTitle];
        }, wxGoodAd);
        expect(content[0].split("<em>")[0]).toBe("商品品专自动化测试case1");
        expect(page).toHaveElement(wxGoodAd.tag)
        expect(content[1]).toBe("官方");

        let ele =  await page.$(wxGoodAd.title);
        let path = './static/pic/ad_title.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告名称截图"});

        //测试两个组件在一行
        let title_Height = await getHeightOfEle(page, wxGoodAd.title);
        let tag_Height = await getHeightOfEle(page, wxGoodAd.tag);
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
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 点击广告名称区域，检查跳转目标为"唯品会特卖"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.title);
        let ele =  await page.$(wxGoodAd.title);
        let path = './static/pic/ad_title.png';
        const image =  await ele.screenshot({path: path});
        //await addAttach({attach: image, description: "广告名称截图"});
        await page.click(wxAdClass.headTitle);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        expect(pageExtend.weappPath).toBeStartWith("pages/special/special.html?url=https%3A%2F%2Fmst.vip.com%2Fcmstopic%2Findex%2Fs%2FIpamof&tra_from=adp%3Aej1kk8ct%3A%3A%3A%3A")
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

  test("验证首位商品名称为\"首位商品名称自动化测试case1\"，点击首位商品，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 验证首位商品名称为"首位商品名称自动化测试case1"\n 3. 点击首位商品，检查跳转目标为"唯品会特卖"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.firstGoodTile);

        let first = await page.$(wxGoodAd.firstGood);
        let path = './static/pic/ad_first_good.png';
        const image =  await first.screenshot({path: path});
        await addAttach({attach: image, description: "首位商品截图"});

        let content = await page.evaluate(async (eleClass)  => {
          return  document.querySelector(eleClass.firstGoodTile).innerHTML;
        }, wxGoodAd);
        expect(content).toBe("首位商品名称自动化测试case1");

        await page.click(wxAdClass.headTitle);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        expect(pageExtend.weappPath).toBeStartWith("pages/special/special.html?url=https%3A%2F%2Fmst.vip.com%2Fcmstopic%2Findex%2Fs%2FIpamof&tra_from=adp%3Aej1kk8ct%3A%3A%3A%3A")
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


  test("验证首位商品标签是否正确展示", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 验证首位商品标签样式是否为["自动化case1"]`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.firstGoodTag);
        let ele = page.$$(wxGoodAd.firstGoodTag);
        let tagNum = 0;
        await ele.then((value) => {
          tagNum = value.length;
        })
        let tagList= ["自动化case1"];
        expect(tagNum).toBe(tagList.length);

        for (let j = 0; j < tagList.length; j++) {
          let content = await page.evaluate(async (eleClass, i) => {
            return document.querySelector(eleClass.firstGoodTag + `:nth-of-type(${i + 1}) div div`).innerHTML;
          }, wxGoodAd, j);
          expect(content).toBe(tagList[j]);
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


  test("验证首位商品价格是否正确展示", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 点击广告名称区域，验证首位商品价格是否正确展示`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.firstGoodPrice);
        //let price = 11111;
        let content = await page.evaluate(async (eleClass) => {
          let price = document.querySelector(eleClass.firstGoodPrice + ` div:nth-of-type(1)`).innerHTML;
          let unit = document.querySelector(eleClass.firstGoodPrice + ` div:nth-of-type(2)`).innerHTML;
          return price + unit
        }, wxGoodAd);
        expect(content).toBe("¥11.1万");
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


  test("验证首位商品行动按钮是否正确；点击首位商品行动按钮，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 验证首位商品行动按钮文案为"领取优惠"\n 3. 点击广告名称区域，检查跳转目标为"唯品会特卖"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.firstGoodAction);
        let content = await page.evaluate(async (eleClass) => {
          return  document.querySelector(eleClass.firstGoodAction).innerHTML;
        }, wxGoodAd);
        expect(content.replace("<!---->", "")).toBe("领取优惠");

        await page.click(wxGoodAd.firstGoodAction);
        await page.waitForTimeout(1000);
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

  test("点击品牌商城入口，验证是否正确跳转到\"唯品会特卖\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 点击广告名称区域，检查跳转目标为"唯品会特卖"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();
        await page.waitForSelector(wxGoodAd.goodMall);
        let content = await page.evaluate(async (eleClass) => {
          return  document.querySelector(eleClass.goodMall).innerHTML;
        }, wxGoodAd);
        expect(content.replace("<!---->", "")).toBe("品牌商城");

        await page.click(wxGoodAd.firstGoodAction);
        await page.waitForTimeout(1000);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        expect(pageExtend.weappPath).toBeStartWith("pages/special/special.html?url=https%3A%2F%2Fmst.vip.com%2Fcmstopic%2Findex%2Fs%2FIpamof&tra_from=adp%3Aej1kk8ct%3A%3A%3A%3A")
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

  test("验证相关商品个数、标题、目标链接是否正确", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testshopbtweapp,发起搜索\n  2. 验证相关商品个数为3个\n 3. 验证相关商品标题为["相关商品自动化测试01", "相关商品自动化测试02", "相关商品自动化测试03"]\n 4. 点击相关商品区域，检查跳转目标分别为"唯品会特卖"、"美家·生活"、"鹅房通"小程序`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.bringToFront();

        let goodele = await page.$(relatedGoods(0).relatedGoods)
        let path = './static/pic/ad_goods.png';
        const image =  await goodele.screenshot({path: path});
        await addAttach({attach: image, description: "相关商品截图"});

        await page.waitForSelector(wxGoodAd.relatedGood);
        let ele = page.$$(wxGoodAd.relatedGood);
        let goodNum = 0;
        await ele.then((value) => {
          goodNum = value.length;
        })
        let goodTitles = ["相关商品自动化测试01", "相关商品自动化测试02", "相关商品自动化测试03"];
        let goodWeapps = ["gh_8ed2afad9972@app", "gh_09c368d75e71@app", "gh_ee0415ce7cf3@app"];
        let goodPaths = ["pages/special/special.html?url=https%3A%2F%2Fmst.vip.com%2Fcmstopic%2Findex%2Fs%2FIpamof&tra_from=adp%3Aej1kk8ct%3A%3A%3A%3A", "pages/enroll/enroll.html?activityNo=189&group=1&project=3:CBN1A:1262:page1&promotion=1&custom=thematic:43", "pages/entrance/index.html?targetPage=/pages/info/info/index&index=0&content_id=2106031132125420"];
        expect(goodNum).toBe(goodTitles.length);

        for (let i = 0; i < goodTitles.length; i++) {
          let content = await page.evaluate(async (eleClass) => {
            return  document.querySelector(eleClass.relatedGoodsTitle).innerHTML;
          }, relatedGoods(i + 1));
          expect(content.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')).toBe(goodTitles[i]);

          await page.click(relatedGoods(i + 1).relatedGoodsTitle);
          expect(pageExtend.extendInfo).toBe(goodWeapps[i]);
          expect(pageExtend.weappPath).toBeStartWith(goodPaths[i])
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