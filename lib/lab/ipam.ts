/**
 * Small address-management helpers for the Lab IP allocation demo. Pure functions, no I/O.
 * IPv4 as unsigned 32-bit numbers, IPv6 as bigint.
 */

export type V4Net = { base: number; prefix: number };
export type V6Net = { base: bigint; prefix: number };

export function parseIPv4(s: string): number | null {
  const parts = s.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export const ipv4ToString = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");

/** "10.8.0.0/24": the base is masked, so "10.8.0.7/24" gives 10.8.0.0. Prefix limited to /16../30. */
export function parseIPv4Cidr(s: string): V4Net | null {
  const [ip, pre] = s.trim().split("/");
  const addr = parseIPv4(ip ?? "");
  const prefix = Number(pre);
  if (addr === null || !/^\d+$/.test(pre ?? "") || prefix < 16 || prefix > 30) return null;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return { base: (addr & mask) >>> 0, prefix };
}

/** Usable host offsets: 1 .. size - 2 (network and broadcast excluded). */
export const ipv4MaxOffset = (net: V4Net) => 2 ** (32 - net.prefix) - 2;

export function parseIPv6(s: string): bigint | null {
  const str = s.trim().toLowerCase();
  if (!/^[0-9a-f:]+$/.test(str) || str.split("::").length > 2) return null;
  const [head, tail] = str.includes("::") ? str.split("::") : [str, undefined];
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const missing = 8 - h.length - t.length;
  if (tail === undefined ? h.length !== 8 : missing < 1) return null;
  const groups = tail === undefined ? h : [...h, ...Array(missing).fill("0"), ...t];
  let n = BigInt(0);
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/.test(g)) return null;
    n = (n << BigInt(16)) + BigInt(parseInt(g, 16));
  }
  return n;
}

/** RFC 5952 text form: lowercase, longest run of two or more zero groups shortened to "::". */
export function ipv6ToString(n: bigint): string {
  const groups: number[] = [];
  for (let i = 7; i >= 0; i--) groups.push(Number((n >> BigInt(i * 16)) & BigInt(0xffff)));
  let best = -1;
  let bestLen = 1;
  for (let i = 0; i < 8; ) {
    if (groups[i] !== 0) {
      i++;
      continue;
    }
    let j = i;
    while (j < 8 && groups[j] === 0) j++;
    if (j - i > bestLen) {
      best = i;
      bestLen = j - i;
    }
    i = j;
  }
  const hex = groups.map((g) => g.toString(16));
  if (best < 0) return hex.join(":");
  return `${hex.slice(0, best).join(":")}::${hex.slice(best + bestLen).join(":")}`;
}

/** "fd00:8::/64", prefix /48../120. */
export function parseIPv6Cidr(s: string): V6Net | null {
  const [ip, pre] = s.trim().split("/");
  const addr = parseIPv6(ip ?? "");
  const prefix = Number(pre);
  if (addr === null || !/^\d+$/.test(pre ?? "") || prefix < 48 || prefix > 120) return null;
  const hostBits = BigInt(128 - prefix);
  return { base: (addr >> hostBits) << hostBits, prefix };
}

/** Lowest free offset from 2 (offset 1 is the server), or null when the network is full. */
export function nextFreeOffset(used: number[], max: number): number | null {
  const taken = new Set(used);
  for (let o = 2; o <= max; o++) if (!taken.has(o)) return o;
  return null;
}

/**
 * A made-up WireGuard-shaped key (32 bytes, base64), derived from a seed so server and client
 * render the same text. Not a real key: the demo says so.
 */
export function fakeKey(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  let x = h >>> 0 || 1;
  const bytes: number[] = [];
  for (let i = 0; i < 32; i++) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    bytes.push((x >>> 0) & 255);
  }
  return btoa(String.fromCharCode(...bytes));
}
