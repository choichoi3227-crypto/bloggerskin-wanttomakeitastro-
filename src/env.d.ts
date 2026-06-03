/// <reference types="astro/client" />

interface D1Result { success: boolean; meta: unknown; results?: unknown[]; }
interface D1PreparedStatement { bind(...values: unknown[]): D1PreparedStatement; first<T = Record<string, unknown>>(): Promise<T | null>; run(): Promise<D1Result>; }
interface D1Database { prepare(query: string): D1PreparedStatement; }
declare class WebSocketPair { 0: WebSocket; 1: WebSocket; }

declare namespace App {
  interface Locals {
    runtime: { env: Env; cf?: unknown; ctx?: ExecutionContext };
  }
}

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  SITE_URL: string;
  SITE_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  DATA_GO_KR_API_KEY?: string;
  GITHUB_TOKEN?: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_IMAGE_DIR: string;
}
