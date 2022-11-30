import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import { adAccountClass, wxAdClass } from "../lib/utils/resultMap";
import {addAttach, addMsg} from "jest-html-reporters/helper";
import { bizOperation, getHeightOfEle, superView } from "../lib/utils/helper";

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;
let resArr = [];
let num = 0;
let pass = 0;
let fail = 0;
let err = 0;


describe("微信商品品专广告测试", () => {

    beforeAll(async () => {
        await superView(6404900485, "wxid_igb6en2soegm12");
        pageExtend = await setup("wxadtestPicCanvas", 20, 3190188057);
        page = pageExtend.webSearchPage.instance;
        browser = pageExtend.browser;
    });

    afterAll(async () => {
        if (!page.isClosed()) {
            browser.close();
        }
    });
    beforeEach(() => {
        num = num + 1;
    })

    test("截图", async () => {
        try {
            await addMsg({context: undefined, message: `当前结果页面截图。`});
            const image =  await page.screenshot({
                path: "./static/pic/test_wxad.png",
                fullPage: true
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

    test("测试广告头部点击", async () => {
        try {
            await addMsg({context: undefined, message: `广告头部点击，点击跳转唯品会小程序。`});
            await page.waitForSelector(wxAdClass.head);
            let ele =  await page.$(wxAdClass.head);
            let path = './static/pic/ad_head.png';
            const image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "广告头部截图"});
            await page.click(wxAdClass.head);
            await page.waitForTimeout(700);
            expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        }catch (e) {
            if (e.constructor.name == "JestAssertionError") {
                fail++;
            } else {
                err++;
            }
            throw e;
        }

    },50000);

    test("测试外链点击", async () => {
        try {
            await addMsg({context: undefined, message: `校验外链wording："进入小程序"；外链点击跳转"唯品会特卖"小程序。`});
            await page.bringToFront();
            await page.waitForSelector(wxAdClass.extent);
            let ele =  await page.$(wxAdClass.extent);
            let path = './static/pic/ad_extent.png';
            const image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "外链截图"});
            let content = await page.evaluate(async (eleClass)  => {
                 return document.querySelector(eleClass.extent_content).innerHTML;
            }, wxAdClass);
            expect(content).toBe("进入小程序");
            await page.click(wxAdClass.extent);
            await page.waitForTimeout(700);
            expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        } catch (e){
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
        }catch (e) {
            if (e.constructor.name == "JestAssertionError"){
                fail++;
            }else {
                err++;
            }
            throw e;
        }
    },50000);

    test("测试广告名称", async () => {
        try {
            await addMsg({context: undefined, message: `测试广告名称为"快乐测试123"，测试"官方"tag。`});
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

            //测试两个组件在一行
            let title_Height = await getHeightOfEle(page, wxAdClass.headSpan);
            let tag_Height = await getHeightOfEle(page, wxAdClass.headSpan + ':nth-of-type(3)');
            console.log(title_Height);
            console.log(tag_Height);
            expect(title_Height).toBeCloseTo(tag_Height, 2);
        }catch (e){
            if (e.constructor.name == "JestAssertionError"){
                fail++;
            }else {
                err++;
            }
            throw e;
        }
    },50000);

    test("测试广告名称点击", async () => {
        try {
            await addMsg({context: undefined, message: `测试广告名称点击，点击跳转"快乐测试123"公众号。`});
            await page.bringToFront();
            await page.waitForSelector(wxAdClass.headTitle);
            let ele =  await page.$$(wxAdClass.headTitle);
            let path = './static/pic/ad_title.png';
            const image =  await ele.at(1).screenshot({path: path});
            await addAttach({attach: image, description: "广告名称截图"});
            await page.click(wxAdClass.headTitle);
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

    test("测试门店地址按钮", async () => {
        try {
            await addMsg({context: undefined, message: `测试门店地址按钮，点击跳转自定义H5页面（百度首页）`});
            await page.bringToFront();
            await page.waitForSelector(wxAdClass.loc);
            let ele =  await page.$(wxAdClass.loc);
            let path = './static/pic/ad_loc.png';
            const image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "门店地址按钮"});
            await page.click(wxAdClass.loc);
            await page.waitForTimeout(700);
            let page2 = await pageExtend.click("outer");
            const screenshotBuffer = await page2.screenshot({
                path: "./static/pic/test_baidu.png",
                fullPage: true
            })
            await addAttach({attach: screenshotBuffer, description: "门店地址点击落地页截图"});
            expect(pageExtend.url).toContain("http://www.baidu.com");
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

    test("测试在线客服", async () => {
        try {
            await addMsg({context: undefined, message: `测试在线客服按钮，落地页正常（外链）。`});
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

    test("测试联系电话按钮", async () => {
        try {
            await addMsg({context: undefined, message: `测试联系电话点击弹窗正常：17000001689、0755-10016。`});
            await page.bringToFront();
            await page.waitForSelector(wxAdClass.phone);
            let ele = await page.$(wxAdClass.phone);
            await page.click(wxAdClass.phone);
            let path = './static/pic/ad_phone.png';
            let image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "联系电话"});
            await page.waitForSelector(wxAdClass.half_dialog);
            ele = await page.$(wxAdClass.half_dialog);
            image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "联系电话弹窗"});
            let phoneArr = ["17000001689", "0755-10016"];
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

    test("测试账号地址、客服、电话配置信息显示在一行", async () => {
        try {
           let loc_height =  await getHeightOfEle(page, wxAdClass.loc);
           let helper_height =  await getHeightOfEle(page, wxAdClass.helper);
           let phone_height =  await getHeightOfEle(page, wxAdClass.phone);
            expect(loc_height).toBeCloseTo(helper_height, 2);
            expect(helper_height).toBeCloseTo(phone_height, 2);
            expect(phone_height).toBeCloseTo(loc_height, 2);
        }catch (e) {
            if (e.constructor.name == "JestAssertionError"){
                fail++;
            }else {
                err++;
            }
            throw e;
        }
    },50000);


    test("测试广告账号(小程序账号)", async () => {
        try {
            await addMsg({context: undefined, message: `测试小程序账号：唯品会，点击跳转唯品会小程序。`});
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
        }catch (e) {
            if (e.constructor.name == "JestAssertionError"){
                fail++;
            }else {
                err++;
            }
            throw e;
        }

    },50000);

    test("测试广告账号进店按钮", async () => {
        try {
           await addMsg({context: undefined, message: `测试小程序账号行动按钮，点击跳转唯品会小程序。`});
            await page.bringToFront();
            await page.waitForSelector(wxAdClass.account_link);
            let ele =  await page.$(wxAdClass.account_link);
            let path = './static/pic/ad_account_link.png';
            const image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "进店按钮截图"});

            let content = await page.evaluate(async (eleClass)  => {
                return  document.querySelector(eleClass.account_link + " div").innerHTML;
            }, wxAdClass);
            expect(content.split("<!---->")[1]).toBe("进店")

            await page.click(wxAdClass.account_link);
            await page.waitForTimeout(700);
            expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
        }catch (e){
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
            await addMsg({context: undefined, message: `测试广告账号：公众号，以及账号关注后的外显tag。`});
            await page.bringToFront();
            let className = adAccountClass(2).account;
            await page.waitForSelector(wxAdClass.account);
            let ele =  await page.$$(wxAdClass.account);
            let path = './static/pic/ad_gzh.png';
            let image =  await ele.at(1).screenshot({path: path});
            await addAttach({attach: image, description: "公众号账号截图"});
            let content = await page.evaluate(async (eleClass)  => {
                let title = document.querySelector(eleClass.account_title).innerHTML;
                let desc = document.querySelector(eleClass.account_desc).innerHTML;
                let tagTitle = document.querySelector(eleClass.account_tag).innerHTML;
                return  [title, desc, tagTitle];
            }, adAccountClass(2));
            expect(content[0]).toBe("快乐测试123");
            expect(content[1]).toBe("公众号");

            await page.click(className);
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

    test("测试公众号关注", async () => {
        try {
            //公众号关注
            await addMsg({context: undefined, message: `公众号点击关注后显示"已关注"tag。`});
            await page.bringToFront();
            await bizOperation("AddBizContact", 3094043316, 3190188057);
            await page.click(wxAdClass.select_tab);
            await page.waitForTimeout(1700);

            let content = await page.evaluate(async (eleClass)  => {
                let item = document.querySelector(eleClass.account_tag);
                return item.innerHTML;
            }, wxAdClass);
            let ele =  await page.$$(wxAdClass.account);
            let image =  await ele.at(1).screenshot({path: './static/pic/ad_gzh1.png'});
            await addAttach({attach: image, description: "公众号账号已关注截图"});
            await bizOperation("DelBizContact", 3094043316, 3190188057);
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

    test("测试产品系列", async () => {
        try {
            await addMsg({context: undefined, message: `测试系列产品为4个，且对应落地页path不同。`});
            let path_arr = [];
            let products = await page.$$(wxAdClass.product);
            for (let j = 0; j < products.length ; j++) {
                await page.waitForSelector(wxAdClass.product + `:nth-of-type(${j + 1})`);
                await page.click(wxAdClass.product + `:nth-of-type(${j + 1})`);
                await page.waitForTimeout(700);
                // 当前商品落地页path之前不存在（校验去重）
                expect(path_arr.indexOf(pageExtend.weappPath)).toBe(-1);
                if (path_arr.indexOf(pageExtend.weappPath) == -1){
                    path_arr.push(pageExtend.weappPath)
                }
            }
            expect(products.length).toBe(4);
        }catch (e) {
            if (e.constructor.name == "JestAssertionError"){
                fail++;
            }else {
                err++;
            }
            throw e;
        }
    },50000);

    test("测试更多账号按钮 -- account_more", async () => {
        try {
            await addMsg({context: undefined, message: `测试更多账号落地页正常。`});
            await page.bringToFront();
            await page.waitForSelector(wxAdClass.more_account);
            let ele =  await page.$(wxAdClass.more_account);
            let path = './static/pic/ad_more.png';
            const image =  await ele.screenshot({path: path});
            await addAttach({attach: image, description: "更多账号组件截图"});
            await page.click(wxAdClass.more_account);
            await page.waitForTimeout(1000);
            let page2 = await pageExtend.click("outer");
            const screenshotBuffer = await page2.screenshot({
                path: "./static/pic/test_more.png",
                fullPage: true
            })
            await addAttach({attach: screenshotBuffer, description: "更多账号落地页截图"});
        }catch (e){
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
    }, 5000)

})