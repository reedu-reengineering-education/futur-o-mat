import fs from "fs";
import path from "path";

const manifestPath = path.resolve("src/assets/avatar_parts_manifest.json");

function inferSubcategory(part) {
  if (!part || !part.id) return undefined;
  const id = (part.id || "").toLowerCase();
  const src = (part.src || "").toLowerCase();

  const bottomKeywords = [
    "jeans",
    "shorts",
    "denim",
    "rock",
    "langrock",
    "skirt",
    "elegant",
  ];
  if (bottomKeywords.some((k) => id.includes(k) || src.includes(k)))
    return "bottom";

  const topKeywords = [
    "hemd",
    "hoodie",
    "turtleneck",
    "bluse",
    "sacko",
    "leger",
    "knallig",
    "weiss",
    "weiß",
  ];
  if (topKeywords.some((k) => id.includes(k) || src.includes(k))) return "top";

  const onepieceKeywords = ["kleid", "sommerkleid", "jumpsuit"];
  if (onepieceKeywords.some((k) => id.includes(k) || src.includes(k)))
    return "onepiece";

  const bagKeywords = ["jutebeutel", "handtasche", "bauchtasche"];
  if (bagKeywords.some((k) => id.includes(k) || src.includes(k))) return "bag";

  const accKeywords = ["uhr", "kette", "schal", "sonnenbrille", "tattoo"];
  if (accKeywords.some((k) => id.includes(k) || src.includes(k)))
    return "accessory";

  // fallback: if category is accessoires, mark as accessory
  if ((part.category || "").toLowerCase() === "accessoires") return "accessory";

  return undefined;
}

try {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const parts = JSON.parse(raw);

  const updated = parts.map((p) => {
    // only add for clothes or accessoires (leave other categories untouched)
    if (p.subcategory !== undefined || !p.category) return p;
    const cat = (p.category || "").toLowerCase();
    if (cat === "clothes" || cat === "accessoires") {
      const sub = inferSubcategory(p);
      return { ...p, subcategory: sub };
    }
    return p;
  });

  fs.writeFileSync(
    manifestPath,
    JSON.stringify(updated, null, 2) + "\n",
    "utf8"
  );
  console.log("Updated manifest with subcategories at", manifestPath);
  process.exit(0);
} catch (err) {
  console.error("Failed to update manifest:", err);
  process.exit(1);
}
