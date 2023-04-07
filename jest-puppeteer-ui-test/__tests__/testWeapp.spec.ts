import {
  getHeightOfEle,
  getLeftOfEle,
  getLineNum,
  getOCRRes,
} from "../lib/utils/tools";
import { setup } from "../lib/utils/setup";
import Puppeteer from "puppeteer";
import { PageExtend } from "../lib/search-page/page-extend";
import { addAttach, addMsg } from "jest-html-reporters/helper";
import { bizWeAppClass, bizWeAppsList } from "../lib/utils/resultMap";


let page: Puppeteer.Page;
let browser:  Puppeteer.Browser;
let pageExtend: PageExtend;
let resArr = [];
let num = 0;
let pass = 0;
let fail = 0;
let err = 0;


describe("小程序账号box测试", () => {

  beforeAll(async () => {
    pageExtend = await setup("美团外卖", 20, 3192443972, false);
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

  test("> query = 美团外卖，验证混排页召回美团外卖小程序", async () => {
    /*await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美团外卖,发起搜索\n  2. 检查混排页是否召回小程序box`
    });*/
    let num = 3;
    while (num != 0) {
      try {
        const image = await page.screenshot({
          path: "./static/pic/test_testWeapp.png"
        })
        await addAttach({attach: image, description: "页面截图"});
        await expect(page).toHaveElement(bizWeAppsList(1, 0, 0).account);
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 美团外卖，小程序box标题为\"query-小程序\"", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美团外卖,发起搜索\n  2. 检查检查小程序box标题为title-小程序`
    });
    let num = 3;
    while (num != 0) {
      try {
        await page.waitForSelector(bizWeAppClass.title)
        let ele = await page.$(bizWeAppClass.title)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptitle.png"
        })
        await addAttach({attach: image, description: "标题截图"});
        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass.title + " >em");
          let color = getComputedStyle(item).color;
          return item.innerHTML;
        }, bizWeAppClass);
        await expect(content).toBe("美团外卖");
        let ocrres = await getOCRRes("./static/pic/test_testWeapptitle.png")
        console.log(ocrres);
        await expect(ocrres.ocr_comm_res.items[0].text).toBe("美团外卖-小程序");
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 美团外卖，验证小程序标题不超过两行", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美团外卖,发起搜索\n  2. 检查小程序账号标题不超过两行`
    });
    let num = 3;
    while (num != 0) {
      try {
        await page.waitForSelector(bizWeAppsList(1,0,0).accountTitle);
        let ele = await page.$(bizWeAppsList(1,0,0).accountTitle);
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptitlec.png"
        })
        await addAttach({attach: image, description: "小程序账号标题"});

        let linNum = await getLineNum("./static/pic/test_testWeapptitlec.png");
        expect(linNum).toBeLessThanOrEqual(2);
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 美团外卖，验证小程序描述不超过两行", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美团外卖,发起搜索\n  2. 检查小程序描述不超过两行`
    });
    let num = 3;
    while (num != 0) {
      try {
        await page.waitForSelector(bizWeAppsList(1,0,0).accountDesc);
        let ele = await page.$(bizWeAppsList(1,0,0).accountDesc);
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeappdesc.png"
        })
        await addAttach({attach: image, description: "小程序描述"});

        let linNum = await getLineNum("./static/pic/test_testWeappdesc.png");
        expect(linNum).toBeLessThanOrEqual(2);

        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 美团外卖，验证小程序描述、小程序标题、小程序来源是否左对齐", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美团外卖,发起搜索\n  2. 验证小程序描述、小程序标题、小程序来源是否左对齐`
    });
    let num = 3;
    while (num != 0) {
      try {
        let left1 = await getLeftOfEle(page, bizWeAppsList(1,0,0).accountDesc);
        let left2 = await getLeftOfEle(page, bizWeAppsList(1,0,0).accountTitle);
        let left3 = await getLeftOfEle(page, bizWeAppsList(1,0,0).accountSourceIcon);

        expect(left1).toBe(left2)
        expect(left1).toBe(left3)
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);

  test("> query = 美团外卖，点击更多入口验证是否跳转到小程序垂搜页", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美团外卖,发起搜索\n  2. 点击更多入口，验证是否跳转到小程序垂搜页`
    });
    let num = 3;
    while (num != 0) {
      try {
        await page.waitForSelector(bizWeAppClass.more);
        await page.click(bizWeAppClass.more);
        //await page.waitForTimeout(2000);
        const image = await page.screenshot({
          path: "./static/pic/test_testWeapptab.png"
        })
        await addAttach({attach: image, description: "垂搜截图"});
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);

  test("> query = 饿了么外卖，验证是否召回饿了么小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=饿了么外卖,发起搜索\n  2. 验证混排结果是否召回饿了么小程序`
    });
    let num = 3;
    while (num != 0) {
      try {
        await pageExtend.change("饿了么外卖");
        const image = await page.screenshot({
          path: "./static/pic/test_testWeapp.png"
        })
        await addAttach({attach: image, description: "页面截图"});
        await expect(page).toHaveElement(bizWeAppsList(1, 0, 0).account);
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 饿了么外卖，验证带服务小程序描述不超过1行", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=饿了么外卖,发起搜索\n  2. 检查带服务的小程序描述是否不超过1行`
    });
    let num = 3;
    while (num != 0) {
      try {
        await page.waitForSelector(bizWeAppsList(1,0,0).accountDesc);
        let ele = await page.$(bizWeAppsList(1,0,0).accountDesc);
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeappdesc.png"
        })
        await addAttach({attach: image, description: "小程序描述"});

        let linNum = await getLineNum("./static/pic/test_testWeappdesc.png");
        expect(linNum).toBeLessThanOrEqual(1);

        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 饿了么外卖，验证小程序召回服务，点击服务验证是否正确跳转到\"饿了么\"小程序", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=饿了么外卖,发起搜索\n  2. 检查小程序账号是否带服务\n 3. 检查小程序服务描述为"优惠订外卖"， 点击账号服务，跳转到饿了么小程序`
    });
    let num = 3;
    while (num != 0) {
      try {
        await expect(page).toHaveElement(bizWeAppsList(1,0, 1).weappService)
        let ele = await page.waitForSelector(bizWeAppsList(1, 0, 1).weappService)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeappservice.png"
        })

        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          return item.innerHTML;
        }, bizWeAppsList(1, 0, 1).weappServiceText);
        await expect(content.replace(/[\r\n]/g, "").replace(/\ +/g, "")).toBe("优惠订外卖");
        await page.click(bizWeAppsList(1, 0, 1).weappServiceLink);
        expect(pageExtend.extendInfo).toBe("gh_6506303a12bb@app");
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 饿了么外卖，验证小程序来源icon和文案在同一行", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=饿了么外卖,发起搜索\n  2. 验证小程序来源为"上海拉扎斯信息科技有限公司"，且icon和文案在同一行`
    });
    let num = 3;
    while (num != 0) {
      try {
        await expect(page).toHaveElement(bizWeAppsList(1,0, 0).accountSourceText)
        let ele = await page.waitForSelector(bizWeAppsList(1, 0, 1).accountSourceText)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptag.png"
        })

        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          //let color = getComputedStyle(item).color;
          return item.innerHTML;
        }, bizWeAppsList(1, 0, 1).accountSourceText);
        await expect(content).toBe("上海拉扎斯信息科技有限公司");

        let lineNum = await getLineNum("./static/pic/test_testWeapptag.png")
        expect(lineNum).toBe(1);

        let h1 = await getHeightOfEle(page, bizWeAppsList(1, 0, 1).accountSourceText);
        let h2 = await getHeightOfEle(page, bizWeAppsList(1, 0, 1).accountSourceIcon)
        expect(h1).toBeCloseTo(h2, 2)

        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 饿了么外卖，验证小程序有xx人使用标签", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=饿了么外卖,发起搜索\n  2. 小程序有有xx人使用标签`
    });
    let num = 3;
    while (num != 0) {
      try {
        await expect(page).toHaveElement(bizWeAppsList(1,0, 0).accountSourceTag)
        let ele = await page.waitForSelector(bizWeAppsList(1, 0, 1).accountSourceTag)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptag.png"
        })

        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          //let color = getComputedStyle(item).color;
          return item.innerHTML;
        }, bizWeAppsList(1, 0, 1).accountSourceTag);
        await expect(content).toBe("10万+人最近使用");
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);

  test("> query = 美妆娃娃，验证小程序来源为\"个人\"", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=美妆娃娃,发起搜索\n  2. 验证小程序来源为\"个人\" `
    });
    let num = 3;
    while (num != 0) {
      try {
        await pageExtend.change("美妆娃娃");
        let ele = await page.waitForSelector(bizWeAppsList(1, 0, 1).accountSourceText)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptag.png"
        })

        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          return item.innerHTML;
        }, bizWeAppsList(1, 0, 1).accountSourceText);
        await expect(content).toBe("个人");
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 腾讯视频，验证小程序有\"使用过\"标签", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query= 腾讯视频,发起搜索\n  2. 验证小程序有\"使用过\"标签`
    });
    let num = 3;
    while (num != 0) {
      try {
        await pageExtend.change("腾讯视频");
        await expect(page).toHaveElement(bizWeAppsList(1,0, 0).accountSourceTag)
        let ele = await page.waitForSelector(bizWeAppsList(1, 0, 1).accountSourceTag)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptag.png"
        })

        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          return item.innerHTML;
        }, bizWeAppsList(1, 0, 1).accountSourceTag);
        await expect(content).toBe("使用过");
        break;
      } catch (e) {
        if (num == 1) {
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
        num--;
      }
    }
  },50000);


  test("> query = 随申办，验证小程序有\"事业单位\"认证，跟标题一行展示", async () => {
    await addMsg({
      context: undefined,
      message: ` 测试步骤：\n  1. 输入搜索query=随申办,发起搜索\n  2. 验证小程序有\"事业单位\"认证，且跟标题一行展示`
    });
    let num = 3;
    while (num != 0) {
      try {
        await pageExtend.change("随申办");
        await expect(page).toHaveElement(bizWeAppsList(1,1, 0).accountTag)
        let ele = await page.waitForSelector(bizWeAppsList(1, 1, 0).accountTag)
        const image = await ele.screenshot({
          path: "./static/pic/test_testWeapptag1.png"
        })

        let content = await page.evaluate(async (eleClass)  => {
          let item = document.querySelector(eleClass);
          return item.innerHTML;
        }, bizWeAppsList(1, 0, 1).accountTagTitle);
        await expect(content).toBe("事业单位");

        let h1 = await getHeightOfEle(page, bizWeAppsList(1,1, 0).accountTag);
        let h2 = await getHeightOfEle(page, bizWeAppsList(1,1, 0).accountTitle);
        expect(h1).toBeCloseTo(h2, 2)
        break;
      } catch (e) {
        if (num == 1) {
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