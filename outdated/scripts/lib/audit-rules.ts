import { readFileSync } from "node:fs";
import YAML from "yaml";

export interface AuditRules {
  sensitiveTerms: string[];
  commercialTerms: string[];
  directoryTerms: string[];
  blogTerms: string[];
  platformTerms: string[];
}

const DEFAULT_RULES: AuditRules = {
  sensitiveTerms: [],
  commercialTerms: [],
  directoryTerms: [],
  blogTerms: [],
  platformTerms: [],
};

function readTerms(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((term): term is string => typeof term === "string" && term.trim() !== "")
    .map((term) => term.toLowerCase());
}

export function loadAuditRules(path: string): AuditRules {
  const raw = YAML.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  return {
    sensitiveTerms: readTerms(raw.sensitiveTerms),
    commercialTerms: readTerms(raw.commercialTerms),
    directoryTerms: readTerms(raw.directoryTerms),
    blogTerms: readTerms(raw.blogTerms),
    platformTerms: readTerms(raw.platformTerms),
  };
}

export function mergeAuditRules(base: AuditRules, override: Partial<AuditRules>): AuditRules {
  return {
    sensitiveTerms: override.sensitiveTerms ?? base.sensitiveTerms,
    commercialTerms: override.commercialTerms ?? base.commercialTerms,
    directoryTerms: override.directoryTerms ?? base.directoryTerms,
    blogTerms: override.blogTerms ?? base.blogTerms,
    platformTerms: override.platformTerms ?? base.platformTerms,
  };
}

export { DEFAULT_RULES };
