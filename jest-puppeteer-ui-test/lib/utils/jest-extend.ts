import { Page } from "puppeteer";

expect.extend({

  async toHaveElement(received: Page, selector: string) {
    try {
      const item = await received.evaluate((selector) => {
        return document.querySelectorAll(selector).length;
      }, selector)
      const pass = !(item === 0);
      if (pass) {
        return {
          message: () =>
            `expected the page to have the element of selector ${selector}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected the page to have the element of selector ${selector}`,
          pass: false,
        };
      }
    } catch (err) {
      return {
        message: () =>
          `expected the page to have the element of selector ${selector}, but ${err}}`,
        pass: false,
      };
    }
  }
});