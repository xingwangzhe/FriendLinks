import YAML from "yaml";
import { SiteSchema } from "../../src/utils/site-collection";
import type { Site } from "../../types/site";

export interface Source {
  index: number;
  file: string;
  relative: string;
  text: string;
}
export interface ParseResult {
  index: number;
  record?: { file: string; site: Site };
  error?: string;
}

/** The production schema, YAML parser, and issue formatting are deliberately shared. */
export function parseSources(sources: Source[]): ParseResult[] {
  return sources.map(({ index, file, relative, text }) => {
    try {
      const data = YAML.parse(text);
      const result = SiteSchema.safeParse(data?.site);
      if (!result.success)
        throw new Error(
          result.error.issues.map((issue) => `site.${issue.path.join(".")}: ${issue.message}`).join("; "),
        );
      return { index, record: { file: relative, site: result.data as Site } };
    } catch (error) {
      return { index, error: `[${file}] ${(error as Error).message}` };
    }
  });
}

export function parseWithWorkers(sources: Source[], count: number): Promise<ParseResult[]> {
  const partitions = Array.from({ length: count }, () => [] as Source[]);
  for (let index = 0; index < sources.length; index++) partitions[index % count].push(sources[index]);
  return Promise.all(
    partitions.map(
      (partition) =>
        new Promise<ParseResult[]>((resolve, reject) => {
          const worker = new Worker(new URL("./yaml-parse-worker.ts", import.meta.url), {
            type: "module",
            smol: process.env.YAML_WORKER_SMOL !== "0",
            ref: true,
          });
          worker.onmessage = (event: MessageEvent<ParseResult[]>) => {
            worker.terminate();
            resolve(event.data);
          };
          worker.onerror = (event) => {
            worker.terminate();
            reject(new Error(event.message));
          };
          worker.postMessage(partition);
        }),
    ),
  ).then((parts) => parts.flat().sort((a, b) => a.index - b.index));
}
