"use client";

import type { LocalContent } from "@/src/lib/local-content";

const GITHUB_SETTINGS_KEY = "viola-community-github-settings-v1";

export type GitHubPublishSettings = {
  owner: string;
  repo: string;
  branch: string;
  path: string;
};

export type GitHubPublishInput = {
  content: LocalContent;
  settings: GitHubPublishSettings;
  token: string;
};

export const defaultGitHubPublishSettings: GitHubPublishSettings = {
  owner: "JSculptorr",
  repo: "fiorentina",
  branch: "main",
  path: "content/viola-content.json",
};

export function readGitHubPublishSettings(): GitHubPublishSettings {
  if (typeof window === "undefined") {
    return defaultGitHubPublishSettings;
  }

  try {
    const raw = window.localStorage.getItem(GITHUB_SETTINGS_KEY);
    if (!raw) {
      return defaultGitHubPublishSettings;
    }

    return normalizeSettings(JSON.parse(raw));
  } catch {
    return defaultGitHubPublishSettings;
  }
}

export function writeGitHubPublishSettings(settings: GitHubPublishSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(GITHUB_SETTINGS_KEY, JSON.stringify(normalizeSettings(settings)));
}

export async function publishContentToGitHub({ content, settings, token }: GitHubPublishInput) {
  const normalizedSettings = normalizeSettings(settings);
  const apiPath = encodeURIComponent(normalizedSettings.path).replaceAll("%2F", "/");
  const endpoint = `https://api.github.com/repos/${normalizedSettings.owner}/${normalizedSettings.repo}/contents/${apiPath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const currentFile = await readCurrentFileSha(endpoint, normalizedSettings.branch, headers);
  const response = await fetch(endpoint, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      branch: normalizedSettings.branch,
      content: toBase64(JSON.stringify(content, null, 2)),
      message: "Update Viola Community content",
      sha: currentFile.sha,
    }),
  });

  if (!response.ok) {
    throw new Error(await readGitHubError(response));
  }
}

async function readCurrentFileSha(
  endpoint: string,
  branch: string,
  headers: Record<string, string>,
) {
  const response = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, { headers });

  if (response.status === 404) {
    return { sha: undefined };
  }

  if (!response.ok) {
    throw new Error(await readGitHubError(response));
  }

  const data = (await response.json()) as { sha?: string };
  return { sha: data.sha };
}

async function readGitHubError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || `GitHub error ${response.status}`;
  } catch {
    return `GitHub error ${response.status}`;
  }
}

function toBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize));
  }

  return window.btoa(binary);
}

function normalizeSettings(value: unknown): GitHubPublishSettings {
  if (!isRecord(value)) {
    return defaultGitHubPublishSettings;
  }

  return {
    owner: readString(value.owner) || defaultGitHubPublishSettings.owner,
    repo: readString(value.repo) || defaultGitHubPublishSettings.repo,
    branch: readString(value.branch) || defaultGitHubPublishSettings.branch,
    path: readString(value.path) || defaultGitHubPublishSettings.path,
  };
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
