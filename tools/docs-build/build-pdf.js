import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT_DIR = path.join(ROOT, 'docs', 'pdf');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const FILES = [
  { input: 'README.md',                       output: '00-readme.pdf',           title: 'Repository Overview',    subtitle: 'How to navigate the ProjectMarket repository' },
  { input: 'docs/product-overview.md',        output: '01-product-overview.pdf', title: 'Product Overview',       subtitle: 'Vision, concepts, roles, and principles' },
  { input: 'docs/tech-stack.md',              output: '02-tech-stack.pdf',       title: 'Tech Stack',             subtitle: 'Decisions and their rationale' },
  { input: 'docs/services-and-apis.md',       output: '03-services-and-apis.pdf',title: 'Services and APIs',      subtitle: 'Third-party services, pricing, GDPR posture' },
  { input: 'docs/architecture.md',            output: '04-architecture.pdf',     title: 'Architecture',           subtitle: 'System shape and the concept-specific seam' },
  { input: 'docs/roadmap.md',                 output: '05-roadmap.pdf',          title: 'Roadmap',                subtitle: 'Phased plan and idea catalogue' },
  { input: 'docs/glossary.md',                output: '06-glossary.pdf',         title: 'Glossary',               subtitle: 'Concept-neutral terminology' },
  { input: 'docs/design-brief.md',            output: '07-design-brief.pdf',     title: 'Design Brief',           subtitle: 'Direction for Figma and the visual system' },
  { input: 'docs/design-system.md',           output: '08-design-system.pdf',    title: 'Design System Tokens',   subtitle: 'Palettes, typography, spacing — Figma-ready' },
  { input: 'docs/diagrams/erd-core.md',       output: '09-erd-core.pdf',         title: 'Core ERD',               subtitle: 'Domain-agnostic core schema' },
  { input: 'docs/research/beauty-services-concept.md', output: '10-research-beauty.pdf', title: 'Market Research', subtitle: 'Beauty & lifestyle services concept (preliminary)' },
];

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    if (lang === 'mermaid') return code;
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));
marked.setOptions({ gfm: true, breaks: false });

const HLJS_CSS_PATH = path.join(__dirname, 'node_modules', 'highlight.js', 'styles', 'github-dark.css');
const hljsCss = await fs.readFile(HLJS_CSS_PATH, 'utf8').catch(() => '');

const baseCss = `
@page { size: A4; margin: 25mm 22mm 25mm 22mm; }
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif;
  font-size: 11pt; line-height: 1.55; color: #1a1a1a; margin: 0; padding: 0;
  -webkit-font-smoothing: antialiased;
}
.cover {
  page-break-after: always;
  display: flex; flex-direction: column;
  min-height: 247mm; padding: 30mm 0 18mm 0;
}
.cover-eyebrow { font-size: 10.5pt; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #d97757; }
.cover-title { font-size: 48pt; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; margin: 22pt 0 14pt 0; color: #1a1a1a; }
.cover-subtitle { font-size: 16pt; font-weight: 400; color: #5a5a5a; line-height: 1.4; max-width: 480pt; }
.cover-spacer { flex: 1; }
.cover-meta { font-size: 9pt; color: #9a9a9a; display: flex; justify-content: space-between; text-transform: uppercase; letter-spacing: 0.14em; border-top: 1px solid #e6e6e6; padding-top: 10pt; }
main h1 { font-size: 24pt; font-weight: 700; margin: 0 0 14pt 0; letter-spacing: -0.01em; border-bottom: 1px solid #e6e6e6; padding-bottom: 8pt; }
main h2 { font-size: 17pt; font-weight: 600; margin: 22pt 0 10pt 0; letter-spacing: -0.005em; color: #1a1a1a; page-break-after: avoid; }
main h3 { font-size: 13.5pt; font-weight: 600; margin: 18pt 0 6pt 0; color: #2a2a2a; page-break-after: avoid; }
main h4 { font-size: 11.5pt; font-weight: 600; margin: 14pt 0 4pt 0; color: #2a2a2a; page-break-after: avoid; }
main p { margin: 0 0 10pt 0; }
main ul, main ol { margin: 0 0 10pt 0; padding-left: 22pt; }
main li { margin: 0 0 4pt 0; }
main li > ul, main li > ol { margin: 4pt 0 4pt 0; }
main strong { font-weight: 600; color: #1a1a1a; }
main em { font-style: italic; }
main a { color: #c0613e; text-decoration: none; border-bottom: 1px solid #f2d3c5; }
main code {
  font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
  font-size: 9.5pt;
  background: #f5f3ef; padding: 1px 5px; border-radius: 3px; color: #b54a2a;
}
main pre {
  background: #1f1f1f; color: #f1f1f1;
  padding: 12pt 14pt; border-radius: 6px; overflow: hidden;
  font-size: 9pt; line-height: 1.5;
  margin: 8pt 0 14pt 0;
  page-break-inside: avoid;
}
main pre code { background: transparent; color: inherit; padding: 0; font-size: inherit; }
main blockquote { border-left: 3px solid #d97757; padding: 4pt 0 4pt 14pt; margin: 8pt 0 14pt 0; color: #5a5a5a; font-style: italic; }
main table { width: 100%; border-collapse: collapse; margin: 8pt 0 14pt 0; font-size: 9.5pt; page-break-inside: avoid; }
main th { background: #fafafa; font-weight: 600; text-align: left; padding: 6pt 8pt; border-bottom: 2px solid #d97757; }
main td { padding: 6pt 8pt; border-bottom: 1px solid #efefef; vertical-align: top; }
main hr { border: 0; border-top: 1px solid #e6e6e6; margin: 20pt 0; }
.mermaid { text-align: center; margin: 14pt 0; page-break-inside: avoid; background: #fafafa; padding: 10pt; border-radius: 6px; }
.mermaid svg { max-width: 100%; height: auto; }
`;

function renderHtml({ title, subtitle, contentHtml, date }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>${hljsCss}</style>
<style>${baseCss}</style>
</head>
<body>
  <div class="cover">
    <div>
      <div class="cover-eyebrow">ProjectMarket · Foundation</div>
      <h1 class="cover-title">${title}</h1>
      <div class="cover-subtitle">${subtitle}</div>
    </div>
    <div class="cover-spacer"></div>
    <div class="cover-meta">
      <div>Internal document</div>
      <div>${date}</div>
    </div>
  </div>
  <main>${contentHtml}</main>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    (() => {
      const blocks = Array.from(document.querySelectorAll('pre code.language-mermaid'));
      window.__mmCount = blocks.length;
      blocks.forEach(block => {
        const pre = block.parentNode;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = block.textContent;
        pre.parentNode.replaceChild(div, pre);
      });
      if (window.__mmCount === 0) { window.__mermaidDone = true; return; }
      window.__mermaidDone = false;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: true },
        er: { useMaxWidth: true },
        sequence: { useMaxWidth: true },
      });
      mermaid.run().then(() => { window.__mermaidDone = true; })
        .catch(err => { window.__mermaidError = String(err); window.__mermaidDone = true; });
    })();
  </script>
</body>
</html>`;
}

console.log('Launching Chrome…');
const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
const today = new Date().toISOString().slice(0, 10);

let ok = 0, fail = 0;
try {
  for (const file of FILES) {
    const mdPath = path.join(ROOT, file.input);
    const outPath = path.join(OUT_DIR, file.output);

    let md;
    try {
      md = await fs.readFile(mdPath, 'utf8');
    } catch (err) {
      console.error(`SKIP ${file.input}: ${err.message}`);
      fail++;
      continue;
    }

    // Strip leading H1 since the cover already holds the title.
    md = md.replace(/^#\s+.+\n+/, '');

    const contentHtml = marked.parse(md);
    const html = renderHtml({ title: file.title, subtitle: file.subtitle, contentHtml, date: today });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.waitForFunction('window.__mermaidDone === true', { timeout: 60000 });
    const mmErr = await page.evaluate(() => window.__mermaidError || null);
    if (mmErr) console.warn(`  mermaid warning in ${file.input}: ${mmErr}`);
    await new Promise(r => setTimeout(r, 250));

    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `<div style="font-size: 8pt; color: #9a9a9a; width: 100%; padding: 0 22mm; display: flex; justify-content: space-between; font-family: -apple-system, sans-serif;">
        <span>ProjectMarket · ${file.title}</span>
        <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`,
      margin: { top: '25mm', right: '22mm', bottom: '25mm', left: '22mm' },
    });
    await page.close();
    ok++;
    console.log(`  built ${file.output}`);
  }
} finally {
  await browser.close();
}

console.log(`\nDone — ${ok} built, ${fail} skipped.`);
