const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const buildDir = "./out";
const indexPath = path.join(buildDir, "index.html");

// HTML 파일 읽기
const html = fs.readFileSync(indexPath, "utf8");
const dom = new JSDOM(html);
const document = dom.window.document;

// CSS 파일들을 인라인으로 변환
const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
linkTags.forEach((link) => {
  const href = link.getAttribute("href");
  if (href.startsWith("/_next/static/css/")) {
    const cssPath = path.join(buildDir, href);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, "utf8");
      const style = document.createElement("style");
      style.textContent = cssContent;
      link.parentNode.replaceChild(style, link);
    }
  }
});

// JavaScript 파일들을 인라인으로 변환
const scriptTags = document.querySelectorAll("script[src]");
scriptTags.forEach((script) => {
  const src = script.getAttribute("src");
  if (src.startsWith("/_next/static/")) {
    const jsPath = path.join(buildDir, src);
    if (fs.existsSync(jsPath)) {
      const jsContent = fs.readFileSync(jsPath, "utf8");
      script.removeAttribute("src");
      script.textContent = jsContent;
    }
  }
});

// 수정된 HTML 저장
fs.writeFileSync(indexPath, dom.serialize());
console.log("✅ Assets 인라인 처리 완료!");
