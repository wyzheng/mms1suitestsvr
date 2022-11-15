import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import {wxAdClass } from "../lib/utils/resultMap";
import {addAttach} from "jest-html-reporters/helper";

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;


describe("微信商品品专广告测试 -- wxadtestPicWeapp", () => {

    beforeAll(async () => {
        pageExtend = await setup("wxadtestPicWeapp", 20);
        page = pageExtend.webSearchPage.instance;
        browser = pageExtend.browser;
    });

    afterAll(() => {
        if (!page.isClosed()) {
            browser.close();
        }
    });

    test("截图", async () => {
        try {
            const image =  await page.screenshot({
                path: "./static/pic/test_wxadPicWeapp.png",
                fullPage: true
            })
            await addAttach({attach: image, description: "页面截图"});
        }
        catch(err){
            console.log(err);
        }
    },50000);

    test("测试广告头部点击 -- zoneheader_click", async () => {
        await page.waitForSelector(wxAdClass.head);
        let ele =  await page.$(wxAdClass.head);
        let path = './static/pic/ad_head.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "广告头部截图"});
        await page.click(wxAdClass.head);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("2579583342");
    },50000);
    test("测试外链点击", async () => {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.extent);
        let ele =  await page.$(wxAdClass.extent);
        let path = './static/pic/ad_extent.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "外链截图"});
        await page.click(wxAdClass.extent);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("2579583342");
    },50000);

    test("测试广告名称 ", async () => {
        await page.bringToFront();
        let content = await page.evaluate(async (eleClass)  => {
            let item = document.querySelector(eleClass.title);
            let color = getComputedStyle(item).color;
            let inner = item.innerHTML;
            let tagTitle = document.querySelector(eleClass.tagContent).innerHTML;
            return  [color, inner, tagTitle];
        }, wxAdClass);
        //expect(content[0]).toBe("rgb(6, 174, 86)");
        expect(content[1].split("<em>")[0]).toBe("WXAD测试号视频号主页");
        expect(page).toHaveElement(wxAdClass.tagContent)
        expect(content[2]).toBe("官方");
    },50000);

    // todo 如何置换出视频号名称？
    test("测试广告名称点击", async () => {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.headTitle);
        let ele =  await page.$$(wxAdClass.headTitle);
        let path = './static/pic/ad_title.png';
        const image =  await ele.at(1).screenshot({path: path});
        await addAttach({attach: image, description: "广告名称截图"});
        await page.click(wxAdClass.headTitle);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("v2_060000231003b20faec8c7e28d1ecad2c900ea34b077192ae8bad1b4f00e998bfc98c5f05d66@finder");
    },50000);

    test("测试广告账号(小程序账号)", async () => {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.account);
        let ele =  await page.$(wxAdClass.account);
        let path = './static/pic/ad_account.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.account);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    },50000);

    test("测试广告账号进店按钮", async () => {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.account_link);
        let ele =  await page.$(wxAdClass.account_link);
        let path = './static/pic/ad_account_link.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.account_link);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_8ed2afad9972@app");
    },50000);

    test("测试广告账号（公众号账号）", async () => {
        await page.bringToFront();
        let className = "div.ad-account-info__list div.ad-account-info__item.active__item:nth-of-type(2)";
        await page.waitForSelector(wxAdClass.account);
        let ele =  await page.$$(wxAdClass.account);
        let path = './static/pic/ad_gzh.png';
        const image =  await ele.at(1).screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(className);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("gh_1e80bb81a1d2");
    },50000);

    test("测试地址按钮 -- info_loc_to_h5", async () => {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.loc);
        let ele =  await page.$(wxAdClass.loc);
        let path = './static/pic/ad_loc.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.loc);
        await page.waitForTimeout(700);
        let page2 = await pageExtend.click("outer");
        const screenshotBuffer = await page2.screenshot({
            path: "./static/pic/test_baidu.png",
            fullPage: true
        })
        await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});
        expect(pageExtend.url).toContain("http://www.baidu.com");
        expect(await page2.title()).toBe("百度一下");
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
        await addAttach({attach: image, description: "在线客服截图"});
        await page.click(wxAdClass.helper);
        await page.waitForTimeout(700);
        expect(pageExtend.url).toBe("https://work.weixin.qq.com/kfid/kfc7f0d8acb45de1b0a");
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

        await page.bringToFront();
        //再次点击收起投诉广告按钮
        await page.click(wxAdClass.feedback);
        await page.waitForTimeout(1000);
        let display =  await page.evaluate((className) => {
            let item = document.querySelector(className.feedback_mask);
            return getComputedStyle(item).display;
        }, wxAdClass)
        expect(display).toBe("none");

    },50000);

    test("测试产品系列tab点击", async () => {
        await page.bringToFront();
        let tab_content = ["系列1", "系列2", "系列3", "系列4"];
        let product_num = [4, 6, 4, 6];
        /*let content =  await page.evaluate((className) => {
            let item = document.querySelector(className.active_tab);
            return item.innerHTML;
        }, wxAdClass)
        expect(content).toBe(tab_content[0]);
        let products = await page.$$(wxAdClass.product);
        expect(products.length).toBe(product_num[0]);*/
        for (let i = 0; i < 4; i++) {
            if (i > 0){
                await page.waitForSelector(wxAdClass.tab_space + `:nth-child(${(4 * i) + 2})`);
                await page.click(wxAdClass.tab_space + `:nth-child(${(4 * i) + 2})`);
                await page.waitForTimeout(700);
            }
            let content =  await page.evaluate((className) => {
                let item = document.querySelector(className.active_tab);
                return item.innerHTML;
            }, wxAdClass, i)
            let path_arr = [];
            let products = await page.$$(wxAdClass.product);
            for (let j = 0; j < products.length ; j++) {
                await page.waitForSelector(wxAdClass.product + `:nth-of-type(${j + 1})`);
                await page.click(wxAdClass.product + `:nth-of-type(${j + 1})`);
                await page.waitForTimeout(700);
                expect(path_arr.indexOf(pageExtend.weappPath)).toBe(-1);
                if (path_arr.indexOf(pageExtend.weappPath) == -1){
                    path_arr.push(pageExtend.weappPath)
                }
            }
            console.log(path_arr);
            expect(products.length).toBe(product_num[i]);
            expect(content).toBe(tab_content[i]);
        }
    },50000);

    test("测试联系电话按钮", async () => {
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
            await page.click(wxAdClass.phone);
        }
    },50000);

    test("测试更多 -- account_more", async () => {
        await page.bringToFront();
        await page.waitForSelector(wxAdClass.more_account);
        let ele =  await page.$(wxAdClass.more_account);
        let path = './static/pic/ad_more.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.more_account);
        await page.waitForTimeout(700);
        let page2 = await pageExtend.click("outer");
        const screenshotBuffer = await page2.screenshot({
            path: "./static/pic/test_more.png",
            fullPage: true
        })
        await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});
    },50000);

})