import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "./routes";

export type ApiClient = AxiosInstance;

<<<<<<< Updated upstream
export const apiClient: ApiClient = axios.create({
  baseURL: typeof window !== "undefined" ? "" : API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
});
=======
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
    const contentType = response.headers.get("content-type");

    let data: any = {};

    try {
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = {};
      }
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || "Request failed",
        response.status,
        data?.errors,
      );
    }

    return data as T;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const isFormData = options.body instanceof FormData;

    const config: RequestInit = {
      ...options,
      credentials: "include",
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      body: isFormData ? options.body : options.body,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeout);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeout);

      // API error
      if (error instanceof ApiError) {
        throw error;
      }

      // Abort / network error
      if (error?.name === "AbortError" || error instanceof TypeError) {
        const err = new ApiError(
          "Request failed. Please check your connection.",
          0,
        );
        (err as any).isNetworkError = true;
        throw err;
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
      body: body ? JSON.stringify(body) : undefined,
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
      body: body ? JSON.stringify(body) : undefined,
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
>>>>>>> Stashed changes
