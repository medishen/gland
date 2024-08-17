import { IncomingMessage, ServerResponse } from 'http';

declare module 'http' {
  interface IncomingMessage {
    json(): Promise<object>;
    get(header: string): string | undefined;
    path(): string;
    hostname(): string;
    protocol(): 'http' | 'https';
  }

  interface ServerResponse {
    code(statusCode: number): this;
    clearCookie(name: string): this;
    cookie(name: string, value: string, options?: CookieOptions): this;
    redirect(url: string, statusCode?: number): void;
    render(view: string, options?: object): void;
  }
}

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}