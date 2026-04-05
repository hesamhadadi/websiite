import dbConnect from "@/lib/db";
import { SettingsModel } from "@/models/Settings";

export const DEFAULT_SITE_URL = "https://example.com";
export const DEFAULT_OG_IMAGE = "/og-default.svg";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function absoluteUrl(path = "") {
  return new URL(path, getSiteUrl()).toString();
}

export async function getSettingsMap() {
  try {
    await dbConnect();
    const docs = await SettingsModel.find({}).lean<Array<{ key: string; value: string }>>();
    return docs.reduce<Record<string, string>>((acc, item) => {
      if (item.key) acc[item.key] = item.value ?? "";
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export function getSettingValue(
  settings: Record<string, string>,
  key: string,
  fallback = ""
) {
  const value = settings[key]?.trim();
  return value || fallback;
}
