import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import {feedbackDialogClass, wxAdClass, wxCpAdClass } from "../lib/utils/resultMap";
import {addAttach, addMsg} from "jest-html-reporters/helper";
import { getLineNum, superView } from "../lib/utils/tools";

let page: Puppeteer.Page;
let browser: Puppeteer.Browser;
let pageExtend: PageExtend;
let resArr = [];
let num = 0;
let pass = 0;
let fail = 0;
let err = 0;



describe("微信竞价直投广告", () => {

  beforeAll(async () => {
    await superView(7269728019, "wxid_0l9zlk043rq212");
    pageExtend = await setup("testBidPicAlt", 20, 3191396391, true);
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

  test("> q=testBidPicAlt，验证混排结果页竞价广告是否召回", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 检查混排页是否召回品专广告`
    });
    let num = 3;
    while(num != 0){
      try {
        const image =  await page.screenshot({
          path: "./static/pic/test_cpad.png"
        })
        await addAttach({attach: image, description: "页面截图"});
        await expect(page).toHaveElement("div.h-animate");
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

  test("> 验证混排结果页竞价广告标题最多两行", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 检查混排页竞价广告标题最多显示两行`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.title);
        let ele =  await page.$(wxCpAdClass.title);
        let path = './static/pic/ad_cp_title.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        let lineNum = await getLineNum(path);
        console.log(lineNum);
        expect(lineNum).toBeLessThanOrEqual(2);
        let content = await page.evaluate(async (eleClass)  => {
          return document.querySelector(eleClass).innerHTML;
        }, wxCpAdClass.title);
        expect(content).toBe("销售线索");
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


  test("> 验证混排结果页竞价广告描述最多两行", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 检查混排页竞价广告描述最多显示两行`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.desc);
        let ele =  await page.$(wxCpAdClass.desc);
        let path = './static/pic/ad_cp_desc.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        let lineNum = await getLineNum(path);
        console.log(lineNum);
        expect(lineNum).toBeLessThanOrEqual(2);

        let content = await page.evaluate(async (eleClass)  => {
          return document.querySelector(eleClass).innerHTML;
        }, wxCpAdClass.desc);
        content = content.replace("<em class=\"highlight\">","");
        content = content.replace("</em>","");
        expect(content).toBe("图片跳原生推广页小程序版altaltaltaltaltalt");
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


  test("> 验证混排结果页竞价广告来源", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 检查混排页来源是否正确`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.source);
        let ele =  await page.$(wxCpAdClass.source);
        let path = './static/pic/ad_cp_desc.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});

        let content = await page.evaluate(async (eleClass)  => {
          return document.querySelector(eleClass).innerHTML;
        }, wxCpAdClass.source);
        content = content.replace("<em class=\"highlight\">","");
        content = content.replace("</em>","");
        expect(content).toBe("阿丽塔");
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


  test("> 点击广告体，验证是否正确跳转到小程序", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 点击广告体，验证是否正确跳转到小程序`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.desc);
        let ele =  await page.$(wxCpAdClass.desc);
        let path = './static/pic/ad_cp_desc.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxCpAdClass.desc);

        expect(pageExtend.extendInfo).toBe("gh_8a95102ee56b@app");
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


  test("> 点击广告图标，验证反馈弹窗是否正常显示", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 点击右上角广告图标，验证反馈弹窗是否正常显示 3. 再次点击广告图标，验证反馈弹窗是否正常收起`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.feedback);
        let ele =  await page.$(wxCpAdClass.feedback);
        let path = './static/pic/ad_cp_feedback.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxCpAdClass.feedback);
        await page.waitForTimeout(700);
        await expect(page).toHaveElement(feedbackDialogClass(0).dialog);
        //再次点击收起弹窗
        await page.click(wxCpAdClass.feedback);
        await page.waitForTimeout(1000);
        let display =  await page.evaluate((feedbackDialogClass) => {
          let item = document.querySelector(feedbackDialogClass);
          return getComputedStyle(item).display;
        }, feedbackDialogClass(0).dialog)
        expect(display).toBe("none");
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


  test("> 点击广告图标，点击投诉广告，验证是否正确跳转到广告投诉落地页", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 点击右上角广告图标，点击投诉广告，验证是否正确跳转到广告投诉落地页`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.feedback);
        let ele =  await page.$(wxCpAdClass.feedback);
        let path = './static/pic/ad_cp_feedback.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告反馈按钮截图"});
        await page.click(wxCpAdClass.feedback);
        await page.waitForTimeout(700);
        await expect(page).toHaveElement(feedbackDialogClass(0).dialog);
        //点击投诉广告
        await page.waitForSelector(feedbackDialogClass(0).jump);
        /*let content = await page.evaluate(async (eleClass)  => {
          return document.querySelector(eleClass).innerHTML;
        }, feedbackDialogClass(0).jump);
        //expect(content).toBe("投诉广告");*/
        await page.click(feedbackDialogClass(0).jump);
        await page.waitForTimeout(700);

        let page2 = await pageExtend.click("outer");
        const screenshotBuffer = await page2.screenshot({
          path: "./static/pic/test_feedback.png"
        })
        await addAttach({attach: screenshotBuffer, description: "广告反馈页面截图"});
        await page2.close();
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

  test("> 点击广告图标，点击还不错，验证是否正确对广告进行反馈", async () => {
     await addMsg({
       context: undefined,
       message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 点击"还不错"反馈按钮，验证是否能够正确进行反馈`
     });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.feedback);
        let ele =  await page.$(wxCpAdClass.feedback);
        let path = './static/pic/ad_cp_feedback.png';
        let image =  await ele.screenshot({path: path});
        //await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxCpAdClass.feedback);
        await page.waitForTimeout(700);
        await expect(page).toHaveElement(feedbackDialogClass(0).dialog);
        //点击还不错
        await page.waitForSelector(feedbackDialogClass(1).action);
        pageExtend.logid = 26805
        await page.click(feedbackDialogClass(1).action);

        ele =  await page.$("div.weui-toast");
        path = './static/pic/ad_cp_toast.png';
        image =  await ele.screenshot({path: path});
        // 出现已反馈弹窗
        await expect(page).toHaveElement("div.weui-toast")
        path = './static/pic/ad_cp_feedback1.png';
        image =  await page.screenshot({path: path});
        await page.waitForTimeout(700);

        //验证上报
        await page.waitForTimeout(700);
        let logStr = pageExtend.extendInfo.split(",")[6];
        logStr = decodeURIComponent(logStr);
        let parse = decodeURIComponent(JSON.parse(logStr).reportid);
        let torf = parse.startsWith("还不错:feedback")
        expect(torf).toBe(true);

        await addAttach({attach: image, description: "广告反馈页面截图"});
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



  test("> 点击广告图标，点击\"关闭此条广告\"，验证是否正确对广告进行反馈", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=testBidPicAlt,发起搜索\n  2. 点击右上角广告图标，点击"关闭此条广告"，验证是否正确跳转到广告投诉落地页`
    });
    let num = 3;
    while(num != 0){
      try {
        await page.waitForSelector(wxCpAdClass.feedback);
        let ele =  await page.$(wxCpAdClass.feedback);
        let path = './static/pic/ad_cp_feedback.png';
        let image =  await ele.screenshot({path: path});
        //await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxCpAdClass.feedback);
        await page.waitForTimeout(700);
        await expect(page).toHaveElement(feedbackDialogClass(0).dialog);
        //点击"关闭此条广告"
        await page.waitForSelector(feedbackDialogClass(2).action);
        //pageExtend.logid = 26805
        await page.click(feedbackDialogClass(2).action);
        ele =  await page.$(feedbackDialogClass(0).dialog);
        path = './static/pic/ad_cp_dialog.png';
        image =  await ele.screenshot({path: path});

        // 验证标题
        let content = await page.evaluate(async (eleClass)  => {
          return document.querySelector(eleClass).innerHTML.replace(/[\r\n]/g, "").replace(/\ +/g, "");
        }, feedbackDialogClass(0).reason_word);
        expect(content).toBe("不感兴趣的原因");

        // 验证描述
        content = await page.evaluate(async (eleClass)  => {
          return document.querySelector(eleClass).innerHTML.replace(/[\r\n]/g, "").replace(/\ +/g, "");
        }, feedbackDialogClass(0).reason_desc);
        expect(content).toBe("选择后将减少该类推荐");

        // 验证原因
        let reasons = ["内容不相关","广告质量低","不感兴趣","直接关闭"];

        for (let i = 0; i < reasons.length; i++) {
          let content = await page.evaluate(async (eleClass)  => {
            return document.querySelector(eleClass).innerHTML.replace(/[\r\n]/g, "").replace(/\ +/g, "");
          }, feedbackDialogClass(i + 1).reason);
          expect(content).toBe(reasons[i]);
        }

        // 点击原因
        let key = Math.floor(Math.random()*4);
        await page.click(feedbackDialogClass(key).reason);
        let color = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          return getComputedStyle(item).color;
          //return document.querySelector(eleClass);
        }, feedbackDialogClass(key).reason);

        await expect(page).toHaveElement(feedbackDialogClass(0).button);

        ele =  await page.$(feedbackDialogClass(0).dialog);
        path = './static/pic/ad_cp_dialog.png';
        image =  await ele.screenshot({path: path});

        await page.click(feedbackDialogClass(0).button);
        await expect(page).toHaveElement("div.weui-toast")
        path = './static/pic/ad_cp_feedback1.png';
        image =  await page.screenshot({path: path});
        await page.waitForTimeout(700);
        await addAttach({attach: image, description: "广告反馈页面截图"});
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

   test("> 测试结果汇总", async () => {
    num = num - 1;
    pass = num - fail - err;
    resArr = [num, pass, fail, err];
    await addMsg({context: undefined, message: `当前测试集合共有${num}条用例，其中测试通过${pass}条，测试失败${fail}条，测试任务失败${err}条`});
  }, 5000)

})