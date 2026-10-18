import { parseSources, type Source } from "./yaml-parse-common";

self.onmessage = (event: MessageEvent<Source[]>) => {
  postMessage(parseSources(event.data));
};
