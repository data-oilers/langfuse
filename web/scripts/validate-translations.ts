import * as fs from "fs";
import * as path from "path";

const MESSAGES_DIR = path.resolve(__dirname, "../messages");
const SOURCE_LOCALE = "en";
const TARGET_LOCALE = "es";

type NestedRecord = { [key: string]: string | NestedRecord };

function flattenKeys(obj: NestedRecord, prefix = ""): Map<string, string> {
  const result = new Map<string, string>();
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result.set(fullKey, value);
    } else {
      for (const [k, v] of flattenKeys(value, fullKey)) {
        result.set(k, v);
      }
    }
  }
  return result;
}

function extractInterpolations(value: string): string[] {
  const matches = value.match(/\{[^}]+\}/g);
  return matches ? matches.sort() : [];
}

function getNamespaces(locale: string): string[] {
  const dir = path.join(MESSAGES_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

let hasErrors = false;

const sourceNamespaces = getNamespaces(SOURCE_LOCALE);
const targetNamespaces = getNamespaces(TARGET_LOCALE);

const missingNamespaces = sourceNamespaces.filter(
  (ns) => !targetNamespaces.includes(ns),
);
const orphanNamespaces = targetNamespaces.filter(
  (ns) => !sourceNamespaces.includes(ns),
);

if (missingNamespaces.length > 0) {
  console.error(
    `\n❌ Missing namespaces in ${TARGET_LOCALE}/: ${missingNamespaces.join(", ")}`,
  );
  hasErrors = true;
}

if (orphanNamespaces.length > 0) {
  console.warn(
    `\n⚠️  Orphan namespaces in ${TARGET_LOCALE}/ (no ${SOURCE_LOCALE} counterpart): ${orphanNamespaces.join(", ")}`,
  );
}

const commonNamespaces = sourceNamespaces.filter((ns) =>
  targetNamespaces.includes(ns),
);

for (const ns of commonNamespaces) {
  const sourceFile = path.join(MESSAGES_DIR, SOURCE_LOCALE, `${ns}.json`);
  const targetFile = path.join(MESSAGES_DIR, TARGET_LOCALE, `${ns}.json`);

  const sourceData: NestedRecord = JSON.parse(
    fs.readFileSync(sourceFile, "utf-8"),
  );
  const targetData: NestedRecord = JSON.parse(
    fs.readFileSync(targetFile, "utf-8"),
  );

  const sourceKeys = flattenKeys(sourceData);
  const targetKeys = flattenKeys(targetData);

  const missingKeys: string[] = [];
  const orphanKeys: string[] = [];
  const interpolationMismatches: string[] = [];

  for (const [key, value] of sourceKeys) {
    if (!targetKeys.has(key)) {
      missingKeys.push(key);
    } else {
      const sourceInterp = extractInterpolations(value);
      const targetInterp = extractInterpolations(targetKeys.get(key)!);
      if (JSON.stringify(sourceInterp) !== JSON.stringify(targetInterp)) {
        interpolationMismatches.push(
          `${key}: ${SOURCE_LOCALE}=${sourceInterp.join(",")} vs ${TARGET_LOCALE}=${targetInterp.join(",")}`,
        );
      }
    }
  }

  for (const key of targetKeys.keys()) {
    if (!sourceKeys.has(key)) {
      orphanKeys.push(key);
    }
  }

  if (
    missingKeys.length === 0 &&
    orphanKeys.length === 0 &&
    interpolationMismatches.length === 0
  ) {
    console.log(`✅ ${ns}: ${sourceKeys.size} keys, all matched`);
    continue;
  }

  console.log(`\n📦 ${ns}:`);

  if (missingKeys.length > 0) {
    hasErrors = true;
    console.error(`  ❌ Missing in ${TARGET_LOCALE} (${missingKeys.length}):`);
    for (const k of missingKeys) console.error(`     - ${k}`);
  }

  if (orphanKeys.length > 0) {
    console.warn(`  ⚠️  Orphan in ${TARGET_LOCALE} (${orphanKeys.length}):`);
    for (const k of orphanKeys) console.warn(`     - ${k}`);
  }

  if (interpolationMismatches.length > 0) {
    hasErrors = true;
    console.error(
      `  ❌ Interpolation mismatches (${interpolationMismatches.length}):`,
    );
    for (const m of interpolationMismatches) console.error(`     - ${m}`);
  }
}

console.log("");
if (hasErrors) {
  console.error("❌ Validation failed — fix the issues above.");
  process.exit(1);
} else {
  console.log("✅ All translations are valid.");
}
