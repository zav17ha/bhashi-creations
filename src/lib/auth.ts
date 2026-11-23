/** Single-user password auth for /admin, using a signed, httpOnly cookie. */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "bc_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

// Changing ADMIN_PASSWORD (or ADMIN_SECRET) signs everyone out.
const key = () => `${process.env.ADMIN_SECRET ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;
const sign = (data: string) => createHmac("sha256", key()).update(data).digest("base64url");
const sha = (s: string) => createHash("sha256").update(s).digest();

export function checkPassword(input: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  return timingSafeEqual(sha(input), sha(expected));
}

export function createSessionValue() {
  const exp = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionValue(value: string | undefined) {
  if (!value || !adminConfigured()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  return good.length === given.length && timingSafeEqual(good, given);
}

export async function isAdmin() {
  return verifySessionValue((await cookies()).get(SESSION_COOKIE)?.value);
}
