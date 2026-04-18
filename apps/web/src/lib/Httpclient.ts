// src/shared/api/HttpClient.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

export interface RequestOptions extends RequestInit {
    params?: Record<string, any>;
}

class HttpClient {
    private baseUrl: string;
    private onUnauthorized?: () => void;

    constructor(baseUrl: string) {
        // Normalize: strip trailing slash, ensure /api/v1 suffix
        let url = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        if (!url.endsWith('/api/v1')) {
            url = `${url}/api/v1`;
        }
        this.baseUrl = url;
    }

    setUnauthorizedCallback(callback: () => void) {
        this.onUnauthorized = callback;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...customConfig } = options;

        // 1. URL Construction with Query Params
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const fullURL = `${this.baseUrl}${cleanEndpoint}`;
        const url = new URL(fullURL);

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== 'all') {
                    url.searchParams.append(key, String(params[key]));
                }
            });
        }

        // 2. Headers Configuration
        const headers: Record<string, string> = {
            ...(customConfig.headers as Record<string, string> || {}),
        };

        // Inject Authorization header if token exists in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!(customConfig.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const config: RequestInit = {
            ...customConfig,
            headers,
            cache: 'no-store',
        };

        // 3. Execution
        const response = await fetch(url.toString(), config);

        // 4. Response Interceptor
        if (response.status === 401) {
            localStorage.removeItem('token');
            if (this.onUnauthorized) {
                this.onUnauthorized();
            }
            // Importamos dinámicamente para evitar dependencia circular
            import('sonner').then(({ toast }) => toast.error('Sesión expirada. Iniciá sesión nuevamente.'));
            throw new Error('Sesión expirada');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.message || errorData.data?.message || `Error ${response.status}`;
            const error = new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
            (error as any).status = response.status;
            (error as any).data = errorData;
            throw error;
        }

        if (response.status === 204) return {} as T;
        const json = await response.json();
        // Auto-unwrap nested 'data' property if it exists
        return (json && typeof json === 'object' && 'data' in json) ? json.data : json;
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    }

    async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    }

    async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body instanceof FormData ? body : JSON.stringify(body)
        });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient(API_URL);
export const http = httpClient; // Alias for backward compatibility during refactor
