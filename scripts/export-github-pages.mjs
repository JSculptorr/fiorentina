import { mkdir, rm, writeFile, cp, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const origin = process.env.EXPORT_ORIGIN ?? "http://127.0.0.1:3000";
const basePath = "/fiorentina";

const routes = [
  "/",
  "/about",
  "/admin",
  "/contacts",
  "/fan-materials",
  "/history",
  "/matches",
  "/matches/custom",
  "/matches/fiorentina-fiorentina-u20-2026-07-19",
  "/matches/fiorentina-gubbio-2026-07-22",
  "/matches/qpr-fiorentina-2026-07-25",
  "/matches/watford-fiorentina-2026-07-29",
  "/news",
  "/news/custom",
  "/news/gosens-farewell-letter-telegram",
  "/news/gosens-schalke-transfer-analysis",
  "/news/jimenez-official-transfer",
  "/news/dragusin-transfer-profile",
  "/partners",
  "/privacy",
];

const generatedTargets = [
  "about",
  "admin",
  "assets",
  "contacts",
  "fan-materials",
  "history",
  "images",
  "matches",
  "news",
  "partners",
  "privacy",
];

const staticNavigationScript = `<script>
(() => {
  const basePath = "${basePath}";

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest?.("a[href]");
    if (!link || (link.target && link.target !== "_self")) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) {
      return;
    }

    if (url.pathname !== basePath && !url.pathname.startsWith(\`\${basePath}/\`)) {
      return;
    }

    event.preventDefault();

    const hasFileExtension = /\\.[a-z0-9]+$/i.test(url.pathname);
    const pathname = hasFileExtension || url.pathname.endsWith("/") ? url.pathname : \`\${url.pathname}/\`;
    window.location.assign(\`\${pathname}\${url.search}\${url.hash}\`);
  }, true);
})();
</script>`;

for (const target of generatedTargets) {
  await rm(target, { recursive: true, force: true });
}

await cp("dist/client/assets", "assets", { recursive: true });
await cp("dist/client/images", "images", { recursive: true });

for (const file of await listFiles("assets")) {
  if (!file.endsWith(".css") && !file.endsWith(".js")) {
    continue;
  }

  const source = await readFile(file, "utf8");
  await writeFile(file, rewriteForPages(source));
}

for (const route of routes) {
  const response = await fetch(`${origin}${route}`);
  if (!response.ok) {
    throw new Error(`Failed to export ${route}: ${response.status}`);
  }

  const html = finalizeHtml(rewriteForPages(await response.text()));
  const outputPath = route === "/" ? "index.html" : join(route.slice(1), "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
}

const notFoundHtml = finalizeHtml(rewriteForPages(await (await fetch(`${origin}/`)).text()));
await writeFile("404.html", notFoundHtml);

async function listFiles(dir) {
  const entries = await import("node:fs/promises").then(({ readdir }) =>
    readdir(dir, { withFileTypes: true }),
  );
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else {
      files.push(path);
    }
  }

  return files;
}

function rewriteForPages(value) {
  return value
    .replaceAll("P=``", `P=\`${basePath}\``)
    .replace(/(href|src|action)="\/(?!fiorentina\/|\/)/g, `$1="${basePath}/`)
    .replace(/(href|src|action)='\/(?!fiorentina\/|\/)/g, `$1='${basePath}/`)
    .replace(/url\((["']?)\/(?!fiorentina\/|\/)/g, `url($1${basePath}/`)
    .replace(/(&quot;)\/(?!fiorentina\/|\/)(assets|images)\//g, `$1${basePath}/$2/`)
    .replace(/(\\")\/(?!fiorentina\/|\/)(assets|images)\//g, `$1${basePath}/$2/`)
    .replace(/(["'`])\/(?!fiorentina\/|\/)(assets|images)\//g, `$1${basePath}/$2/`)
    .replace(/(["'`])\/(?!fiorentina\/|\/)(favicon\.svg|file\.svg|globe\.svg|window\.svg)/g, `$1${basePath}/$2`)
    .replaceAll("http://127.0.0.1:3000", basePath)
    .replaceAll("http://localhost:3000", basePath)
    .replaceAll(`${basePath}${basePath}/`, `${basePath}/`);
}

function finalizeHtml(value) {
  return value.replace("<script id=\"_R_\">", `${staticNavigationScript}<script id="_R_">`);
}
