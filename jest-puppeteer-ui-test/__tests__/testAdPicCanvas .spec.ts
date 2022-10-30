import {setup} from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import {PageExtend} from "../lib/search-page/page-extend";
import {wxAdClass } from "../lib/utils/resultMap";
import {addAttach} from "jest-html-reporters/helper";

let page: Puppeteer.Page ;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;


describe("微信商品品专广告测试", () => {

    beforeAll(async () => {
        pageExtend = await setup("wxadtestPicCanvas", 20);
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
                path: "./static/pic/test_wxad.png",
                fullPage: true
            }).catch(()=>{})
            global.reporter.addAttachment("Screenshot", image, "image/png");
        }
        catch(err){
            console.log(err);
        }

    },50000);
    //todo 如何置换小程序链接
    test("测试广告头部点击 -- zoneheader_click", async () => {
        await page.waitForSelector(wxAdClass.head);
        let ele =  await page.$(wxAdClass.head);
        let path = './static/pic/ad_head.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.head);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("唯品会特卖");
        /*let page2 = await pageExtend.click("outer");
        const screenshotBuffer = await page2.screenshot({
          path: "./static/pic/test_3.png",
          fullPage: true
        })*/
        //await addAttach({attach: screenshotBuffer, description: "here is the jump pic."});
    },50000);

    test("测试广告名称", async () => {
        let content = await page.evaluate(async (eleClass)  => {
            return  document.querySelector(eleClass.title).innerHTML;
        }, wxAdClass);
        expect(content).toBe("快乐测试123");
    },50000);
    
    test("测试广告名称点击", async () => {
        await page.waitForSelector(wxAdClass.title);
        let ele =  await page.$$(wxAdClass.title);
        let path = './static/pic/ad_title.png';
        const image =  await ele.at(1).screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.title);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("快乐测试123");
    },50000);

    test("测试广告账号(小程序账号)", async () => {
        await page.waitForSelector(wxAdClass.account);
        let ele =  await page.$(wxAdClass.account);
        let path = './static/pic/ad_account.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.account);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("唯品会特卖");
    },50000);

    test("测试广告账号进店按钮", async () => {
        await page.waitForSelector(wxAdClass.account_link);
        let ele =  await page.$(wxAdClass.account_link);
        let path = './static/pic/ad_account_link.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.account_link);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("唯品会特卖");
    },50000);

    test("测试广告账号（公众号账号）", async () => {
        let className = "div.ad-account-info__list div.ad-account-info__item.active__item:nth-of-type(2)";
        await page.waitForSelector(wxAdClass.account);
        let ele =  await page.$$(wxAdClass.account);
        let path = './static/pic/ad_gzh.png';
        const image =  await ele.at(1).screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(className);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("快乐测试123");
    },50000);

    test("测试地址按钮 -- info_loc_to_h5", async () => {
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
        expect(await page2.title()).toBe("百度一下");
    },50000);

    // todo 链接需要客户端支持
    test("测试在线客服 -- info_helper", async () => {
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

    // todo 链接需要客户端支持
    test("测试更多 -- account_more", async () => {
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

    test("测试广告投诉按钮 -- header_complaint", async () => {
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

        //再次点击收起投诉广告按钮
        await page.click(wxAdClass.feedback);
        await page.waitForTimeout(1000);
        let display =  await page.evaluate((className) => {
            let item = document.querySelector(className.feedback_mask);
            return getComputedStyle(item).display;
        }, wxAdClass)
        expect(display).toBe("none");

    },50000);

    test("测试外链点击", async () => {
        await page.waitForSelector(wxAdClass.extent);
        let ele =  await page.$(wxAdClass.extent);
        let path = './static/pic/ad_extent.png';
        const image =  await ele.screenshot({path: path});
        await addAttach({attach: image, description: "here is the ad head."});
        await page.click(wxAdClass.extent);
        await page.waitForTimeout(700);
        expect(pageExtend.extendInfo).toBe("唯品会特卖");
    },50000);

})