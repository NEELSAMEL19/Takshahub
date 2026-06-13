"use client";

import { API_BASE_URL } from "./routes";
import { ApiError } from "../utils/errors";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseResponseData = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
};

const getResponseMessage = (data: unknown) => {
  if (isRecord(data) && typeof data.message === "string") {
    return data.message;
  }

  return "Request failed";
};

const getResponseErrors = (data: unknown) => {
  if (!isRecord(data) || !isRecord(data.errors)) {
    return undefined;
  }

  const errors: Record<string, string> = {};

  Object.entries(data.errors).forEach(([key, value]) => {
    if (typeof value === "string") {
      errors[key] = value;
    }
  });

  return Object.keys(errors).length ? errors : undefined;
};

const getRequestBody = (body: unknown): BodyInit | undefined => {
  if (body === undefined) {
    return undefined;
  }

  if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body as BodyInit;
  }

  return JSON.stringify(body);
};

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(
    endpoint: string,
    params?: RequestOptions["params"],
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await parseResponseData(response);

    if (!response.ok) {
      throw new ApiError(
        getResponseMessage(data),
        response.status,
        getResponseErrors(data),
      );
    }

    return data as T;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const isFormData = options.body instanceof FormData;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      signal: controller.signal,
      headers: {
        ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      body: getRequestBody(options.body),
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeout);
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      clearTimeout(timeout);

      if (error instanceof ApiError) {
        throw error;
      }

      const name = isRecord(error) ? error.name : undefined;

      if (name === "AbortError" || error instanceof TypeError) {
        throw new ApiError(
          "Request failed. Please check your connection.",
          0,
        );
      }

      throw new ApiError("Something went wrong", 0);
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body === undefined ? undefined : (body as BodyInit),
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body === undefined ? undefined : (body as BodyInit),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
