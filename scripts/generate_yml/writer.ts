import fs from "fs/promises";
import path from "path";
import { isDebugEnabled } from "./utils";

export type WriteJob = { fname: string; content: string };

export function createAsyncWriter(verbose = false, writeConcurrency = 4) {
  const writeQueue: WriteJob[] = [];
  const queuedWrites = new Set<string>();
  let writeActive = 0;

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function startNextWrite() {
    while (writeActive < writeConcurrency && writeQueue.length > 0) {
      const job = writeQueue.shift()!;
      const dbg = verbose || isDebugEnabled();
      if (dbg)
        console.log(
          `(async-write) Starting job for ${job.fname} (queue=${writeQueue.length})`
        );
      writeActive++;
      (async () => {
        try {
          await fs.mkdir(path.dirname(job.fname), { recursive: true });
          const tmp = `${job.fname}.tmp`;
          await fs.writeFile(tmp, job.content, "utf8");
          await fs.rename(tmp, job.fname);
          if (dbg) console.log(`(async-write) Wrote ${job.fname}`);
        } catch (err) {
          console.warn(`(async-write) Failed to write ${job.fname}`, err);
        } finally {
          queuedWrites.delete(job.fname);
          writeActive--;
        }
      })();
    }
  }

  function enqueueWrite(fname: string, content: string) {
    if (queuedWrites.has(fname)) return;
    queuedWrites.add(fname);
    writeQueue.push({ fname, content });
    const dbg = verbose || isDebugEnabled();
    if (dbg)
      console.log(
        `(async-write) Enqueued ${fname} (queue=${writeQueue.length})`
      );
    void startNextWrite();
  }

  async function flushWrites() {
    const dbg = verbose || isDebugEnabled();
    if (dbg) console.log(`(async-write) Flushing writes`);
    while (writeActive > 0 || writeQueue.length > 0) {
      await delay(50);
    }
  }

  return { enqueueWrite, flushWrites, queuedWrites } as const;
}
