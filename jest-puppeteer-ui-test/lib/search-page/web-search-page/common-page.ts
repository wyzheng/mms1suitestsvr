import { HTTPRequest, Page, ScreenshotOptions} from "puppeteer";
import EventEmitter from "events";
import stripJsHandler from 'strip-js';
import { writeFileSync } from "fs-extra";
import {LoggerService} from "../../logger/logger.service";
import {Logger} from "log4js";

/**
 * common functions of a page
 */
export class CommonPage {
  private loggerService = new LoggerService();

  private logger: Logger;

  constructor(public instance: Page) {
    this.logger = this.loggerService.getLogger('puppeteer');
  }

  public async takeScreenshot(options: ScreenshotOptions): Promise<void> {
    await this.instance.screenshot(options);
  }

  public async outputContent({ path, stripJs = false }: { path: string; stripJs?: boolean }) {
    let htmlContent = await this.instance.content();
    if (stripJs) {
      htmlContent = stripJsHandler(htmlContent);
    }
    await writeFileSync(path, htmlContent);
  }

  public async bind({ requestInterceptor }: {
    requestInterceptor?: (req: HTTPRequest) => void;
    logger?: {
      log?: (_: string) => void;
      error?: (_: string) => void;
    };
  }) {
    await this.instance.removeAllListeners();
    if (!!requestInterceptor) {
      await this.instance.setRequestInterception(true);
    }
    this.instance.on('request', (req) => {
      requestInterceptor?.(req);
    });
    this.instance.on('console', (msg) => {
    });
    this.instance.on('pageerror', (evt) => {
    });
    this.instance.on('requestfailed', (req) => {
    });
    this.instance.on('requestfinished', (req) => {
    });
  }

  public async close() {
    await this.instance.removeAllListeners();
    await this.instance.close();
    this.instance = null;
  }

  // see: https://github.com/puppeteer/puppeteer/issues/3627
  protected createFunctionWaitForIdleNetwork(
    isRequestRequiredAttention: (_: HTTPRequest) => Boolean = _ => true
  ) {
    const pendingRequests: HTTPRequest[] = [];
    const emitter = new EventEmitter();

    const enum EventType {
      Active = 'active',
      Idle = 'idle',
    }

    function pushRequest(req: HTTPRequest) {
      if (isRequestRequiredAttention(req)) {
        pendingRequests.push(req);
        emitter.emit(EventType.Active);
      }
    }

    function popRequest(req: HTTPRequest) {
      const index = pendingRequests.indexOf(req);
      // remove request
      if (index >= 0) {
        pendingRequests.splice(index, 1);
      }
      // no pending request
      if (pendingRequests.length <= 0) {
        emitter.emit(EventType.Idle);
      }
    }

    this.instance.on('request', pushRequest);
    this.instance.on('requestfailed', popRequest);
    this.instance.on('requestfinished', popRequest);

    const removePageListeners = () => {
      this.instance.off('request', pushRequest);
      this.instance.off('requestfailed', popRequest);
      this.instance.off('requestfinished', popRequest);
    }

    return function waitForIdleNetwork(idleTimeout: number, failTimeout: number) {
      let idleTimer: NodeJS.Timeout = null;
      let failTimer: NodeJS.Timeout = null;

      return new Promise<void>((resolve, reject) => {
        function fail() {
          removePageListeners();
          if (!!idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
          }
          if (!!failTimer) {
            clearTimeout(failTimer);
            failTimer = null;
          }
          reject(
            new Error(
              `After ${failTimeout}ms, there are still ${pendingRequests.length} pending requests: ${pendingRequests.map(req => req.url()).join(',')}`
            ),
          );
        }

        function success() {
          removePageListeners();
          if (!!idleTimer) {
            clearTimeout(idleTimer);
            idleTimer = null;
          }
          if (!!failTimer) {
            clearTimeout(failTimer);
            failTimer = null;
          }
          resolve();
        }

        // Start failure time immediately.
        failTimer = setTimeout(fail, failTimeout);

        // Handle edge case where neither active nor idle is emitted during the lifetime of this promise.
        if (pendingRequests.length <= 0) {
          idleTimer = setTimeout(success, idleTimeout);
        }

        // Play a game of whack-a-mole with the idle and active events.
        emitter.on(EventType.Idle, () => {
          if (!!idleTimer) {
            clearTimeout(idleTimer);
          }
          idleTimer = setTimeout(success, idleTimeout);
        });
        emitter.on(EventType.Active, () => {
          if (!!idleTimer) {
            clearTimeout(idleTimer);
          }
        });
      });
    }
  }

}
