import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: "osayubot",
  apiKey: process.env.NEXT_PUBLIC_MICOCMS_API_KEY,
});
