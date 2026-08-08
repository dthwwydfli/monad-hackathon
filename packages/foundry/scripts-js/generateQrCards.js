import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseUrl = process.argv[2] || "http://localhost:3000";
const outDir = join(__dirname, "../nextjs/public/qr");

mkdirSync(outDir, { recursive: true });

const links = [
  { name: "checkpoint-0", url: `${baseUrl}/claim?quest=1&checkpoint=0` },
  { name: "checkpoint-1", url: `${baseUrl}/claim?quest=1&checkpoint=1` },
  { name: "checkpoint-2", url: `${baseUrl}/claim?quest=1&checkpoint=2` },
];

for (const link of links) {
  const png = await QRCode.toBuffer(link.url, { width: 512, margin: 2 });
  writeFileSync(join(outDir, `${link.name}.png`), png);
  writeFileSync(join(outDir, `${link.name}.txt`), link.url);
  console.log(`Wrote ${link.name}: ${link.url}`);
}
