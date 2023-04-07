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
            `Expected the page to have the element of selector ${selector}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `Expected the page to have the element of selector ${selector}`,
          pass: false,
        };
      }
    } catch (err) {
      return {
        message: () =>
          `Expected the page to have the element of selector ${selector}, but ${err}}`,
        pass: false,
      };
    }
  },

  toBeStartWith(received: string, selector: string) {
    try {
      let pass = received.startsWith(selector);
      if (pass) {
        return {
          message: () =>
              `Expected the ${received} to be start with ${selector}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
              `Expected the ${received} to be start with ${selector}`,
          pass: false,
        };
      }
    } catch (err) {
      return {
        message: () =>
            `Expected the ${received} to be start with ${selector}, but ${err}}`,
        pass: false,
      };
    }
  }
});