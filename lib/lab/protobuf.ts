/**
 * Minimal Protocol Buffers encoder for the Lab size demo: varint (wire type 0) and
 * length-delimited (wire type 2) fields, proto3 rules (default values are not written).
 * Every byte is returned with the field and the part it belongs to, so the UI can show them.
 */

export type BytePart = "tag" | "length" | "value";
export type Segment = { field: string; part: BytePart; bytes: number[] };

export function varint(value: number): number[] {
  const out: number[] = [];
  let v = value >>> 0;
  while (v > 0x7f) {
    out.push((v & 0x7f) | 0x80);
    v >>>= 7;
  }
  out.push(v);
  return out;
}

const tag = (fieldNumber: number, wireType: 0 | 2) => varint((fieldNumber << 3) | wireType);

export function lengthDelimited(field: string, fieldNumber: number, value: Uint8Array): Segment[] {
  return [
    { field, part: "tag", bytes: tag(fieldNumber, 2) },
    { field, part: "length", bytes: varint(value.length) },
    { field, part: "value", bytes: Array.from(value) },
  ];
}

export function varintField(field: string, fieldNumber: number, value: number): Segment[] {
  if (!value) return [];
  return [
    { field, part: "tag", bytes: tag(fieldNumber, 0) },
    { field, part: "value", bytes: varint(value) },
  ];
}

const utf8 = new TextEncoder();
export const stringField = (field: string, n: number, s: string) =>
  s ? lengthDelimited(field, n, utf8.encode(s)) : [];

/** Standard base64 to bytes, or null when the text is not valid base64. */
export function base64ToBytes(s: string): Uint8Array | null {
  try {
    const bin = atob(s.trim());
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

export const byteLength = (s: string) => utf8.encode(s).length;
export const segmentsLength = (segs: Segment[]) => segs.reduce((n, s) => n + s.bytes.length, 0);
export const hex = (b: number) => b.toString(16).padStart(2, "0");
