export { cn } from "cn";

import { urls } from "@/config/site";

export function absoluteUrl(path = "/") {
  return new URL(path, urls.origin).toString();
}
