import { readFile } from 'fs-extra';
import { join } from 'path';

export class PageAssetService {

  async fetchEntryHtmlContent(distDir: string) {
    const path = join(distDir, 'app.html');
    const content = await readFile(path, {
      encoding: 'utf-8',
    });
    const handledContent = this.addFileSchemeToReferenceInContent(content);
    return handledContent;
  }

  async fetchReferenceContent(distDir: string, relPath: string) {
    const path = join(distDir, relPath);
    const content = await readFile(path, {
      encoding: 'utf-8',
    });
    return content;
  }

  private addFileSchemeToReferenceInContent(content: string) {
    // note: puppeteer setContent does not work for local reference without any scheme.
    // <link rel="stylesheet" type="text/css" href="dist/style.css?t=1652845833423"/>
    const linkRegex = /\<\s*link\s+rel\=\"\s*stylesheet\s*\"\s+type\=\"\s*text\/css\s*\"\s+href\=\"\s*([^\s]+)\s*\"\s*\/\>/gi;
    // <script src="dist/chunk-info.js?t=1652845833423"></script>
    const scriptRegex = /\<\s*script\s+src\=\"\s*([^\s]+)\s*\"\s*\>\<\/\s*script\s*\>/gi;
    return content.replace(linkRegex, ($0, $1) => {
      if (/^dist/g.test($1)) {
        return `<link rel="stylesheet" type="text/css" href="${new URL($1, 'file:').href}"/>`;
      }
      return $0;
    }).replace(scriptRegex, ($0, $1) => {
      if (/^dist/g.test($1)) {
        return `<script src="${new URL($1, 'file:').href}"></script>`;
      }
      return $0;
    });
  }

  public getImageProxyUrl(url: string) {
    return this.getProxyUrl(url, `image`);
  }

  public getFontProxyUrl(url: string) {
    return this.getProxyUrl(url, `font`);
  }

  private getProxyUrl(url: string, pathname: string) {
    const urlObject = new URL(`http://example.com`);
    urlObject.protocol = `http`;
    urlObject.hostname = `localhost`;
    urlObject.port = '4000';
    urlObject.pathname = pathname;
    urlObject.searchParams.append(`url`, encodeURIComponent(url));
    return urlObject.href;
  }
}
