/** Reinterpret compact coordinate bytes, copying only when their offset is unaligned. */
export function asInt16(value: unknown): Int16Array {
  if (value instanceof Int16Array) return value;
  if (!(value instanceof Uint8Array)) throw new TypeError("Expected Int16Array or Uint8Array coordinate data");
  if (value.byteLength % Int16Array.BYTES_PER_ELEMENT !== 0)
    throw new RangeError("Int16 coordinate data must contain an even number of bytes");
  if (value.byteOffset % Int16Array.BYTES_PER_ELEMENT === 0)
    return new Int16Array(value.buffer, value.byteOffset, value.byteLength / Int16Array.BYTES_PER_ELEMENT);
  const aligned = new Uint8Array(value);
  return new Int16Array(aligned.buffer);
}
