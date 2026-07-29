import fs from "fs";
import path from "path";

const SKILL_DIR = path.join(process.cwd(), ".agents/skills/cwp_template");
const DEMO_TEMPLATE_RELATIVE = "src/demo/presentation/assets/CWP_Template.pptx";

export type CwpSkillAssetReference = {
  relativePath: string;
  absolutePath: string;
  exists: boolean;
  fileName: string;
};

export type CwpSkillReference = {
  skillPath: string;
  skillName: string;
  sampleDeck: CwpSkillAssetReference;
  baseTemplate: CwpSkillAssetReference;
  layoutGuide: {
    relativePath: string;
    absolutePath: string;
    exists: boolean;
  };
  browserPreviewGuide: {
    relativePath: string;
    absolutePath: string;
    exists: boolean;
  };
  referenceSlideSkill: {
    relativePath: string;
    absolutePath: string;
    exists: boolean;
  };
  skillDoc: {
    relativePath: string;
    absolutePath: string;
    exists: boolean;
  };
};

function resolveAsset(relativePath: string): CwpSkillAssetReference {
  const absolutePath = path.join(process.cwd(), relativePath);
  return {
    relativePath,
    absolutePath,
    exists: fs.existsSync(absolutePath),
    fileName: path.basename(relativePath),
  };
}

function resolveDoc(relativePath: string) {
  const absolutePath = path.join(process.cwd(), relativePath);
  return {
    relativePath,
    absolutePath,
    exists: fs.existsSync(absolutePath),
  };
}

export function getCwpSkillDir() {
  return SKILL_DIR;
}

export function getCwpTemplatePath() {
  return path.join(process.cwd(), DEMO_TEMPLATE_RELATIVE);
}

/** @deprecated Use loadCwpSkillReference().baseTemplate */
export function loadCwpTemplateReference(): CwpSkillReference {
  return loadCwpSkillReference();
}

export function loadCwpSkillReference(): CwpSkillReference {
  const sampleDeckRelative =
    ".agents/skills/cwp_template/assets/portfolio-building-analytics-cwp-v2.pptx";
  const layoutGuideRelative =
    ".agents/skills/cwp_template/references/analytics-layout-guide.md";
  const browserPreviewGuideRelative =
    ".agents/skills/cwp_template/references/browser-preview-mapping.md";
  const referenceSlideSkillRelative =
    ".agents/skills/cwp_template/reference-slide-presentations-SKILL.md";
  const skillDocRelative = ".agents/skills/cwp_template/SKILL.md";

  return {
    skillPath: ".agents/skills/cwp_template",
    skillName: "cwp-analytics-decks",
    sampleDeck: resolveAsset(sampleDeckRelative),
    baseTemplate: resolveAsset(DEMO_TEMPLATE_RELATIVE),
    layoutGuide: resolveDoc(layoutGuideRelative),
    browserPreviewGuide: resolveDoc(browserPreviewGuideRelative),
    referenceSlideSkill: resolveDoc(referenceSlideSkillRelative),
    skillDoc: resolveDoc(skillDocRelative),
  };
}

function stripFrontmatter(markdown: string) {
  if (!markdown.startsWith("---")) {
    return markdown.trim();
  }

  const end = markdown.indexOf("---", 3);
  if (end === -1) {
    return markdown.trim();
  }

  return markdown.slice(end + 3).trim();
}

function readSkillFile(relativePath: string): string | null {
  const filePath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return stripFrontmatter(fs.readFileSync(filePath, "utf8"));
}

export function readCwpSkillDoc(): string | null {
  return readSkillFile(".agents/skills/cwp_template/SKILL.md");
}

export function readCwpReferenceSlideSkill(): string | null {
  return readSkillFile(".agents/skills/cwp_template/reference-slide-presentations-SKILL.md");
}

export function readCwpLayoutGuide(): string | null {
  const filePath = path.join(SKILL_DIR, "references", "analytics-layout-guide.md");
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8").trim();
}

export function readCwpBrowserPreviewGuide(): string | null {
  const filePath = path.join(SKILL_DIR, "references", "browser-preview-mapping.md");
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8").trim();
}

export function buildCwpSkillAssetPathsPrompt(skillReference?: CwpSkillReference): string {
  const ref = skillReference ?? loadCwpSkillReference();

  return [
    "CWP SKILL ASSET PATHS:",
    `- Skill: ${ref.skillPath} (${ref.skillName})`,
    `- Layout guide: ${ref.layoutGuide.relativePath} (exists: ${ref.layoutGuide.exists})`,
    `- Browser preview mapping: ${ref.browserPreviewGuide.relativePath} (exists: ${ref.browserPreviewGuide.exists})`,
    `- Reference-slide skill (PPTX): ${ref.referenceSlideSkill.relativePath} (exists: ${ref.referenceSlideSkill.exists})`,
    `- Sample analytics deck: ${ref.sampleDeck.relativePath} (exists: ${ref.sampleDeck.exists})`,
    `- Base brand template (PPTX seed): ${ref.baseTemplate.relativePath} (exists: ${ref.baseTemplate.exists})`,
    "",
    "Browser preview → follow layout guide + browser preview mapping exactly.",
    "PPTX download → reference-slide skill + base template after PowerPoint editing.",
  ].join("\n");
}

/** @deprecated Use buildCwpSkillAssetPathsPrompt */
export function buildCwpSkillContextPrompt(skillReference?: CwpSkillReference): string {
  return buildCwpSkillAssetPathsPrompt(skillReference);
}
