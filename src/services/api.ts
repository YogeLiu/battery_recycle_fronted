import { InboundOrderDetailResponse } from '../types';

const API_BASE_URL = 'http://localhost:8036/jxc/v1';

// 定义搜索参数接口
interface InboundOrderSearchParams {
  end_date?: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  supplier?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(response.status, data.msg || 'Request failed');
      }

      if (data.code !== 0) {
        throw new ApiError(data.code, data.msg || 'API request failed');
      }

      return data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error');
    }
  }

  // Auth
  async login(credentials: { username: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Users
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(user: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, user: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async createCategory(category: any) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: number, category: any) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: number) {
    return this.request<any>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Inbound Orders - 修改为新的搜索接口
  async getInboundOrders(params?: InboundOrderSearchParams) {
    // 设置默认参数
    const searchParams: InboundOrderSearchParams = {
      page: 1,
      page_size: 100,
      start_date: '',
      end_date: '',
      supplier: '',
      ...params
    };

    const response = await this.request<{ 
      page: number; 
      page_size: number; 
      orders: any[]; 
      total: number 
    }>('/inbound/orders/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
    
    // 返回 orders 数组，保持原有接口兼容性
    return response.orders;
  }

  // 新增：专门的搜索方法，返回完整响应信息
  async searchInboundOrders(params: InboundOrderSearchParams) {
    const searchParams: InboundOrderSearchParams = {
      page: 1,
      page_size: 100,
      start_date: '',
      end_date: '',
      supplier: '',
      ...params
    };

    return this.request<{ 
      page: number; 
      page_size: number; 
      orders: any[]; 
      total: number 
    }>('/inbound/orders/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  }

  async createInboundOrder(order: any) {
    return this.request<any>('/inbound/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async getInboundOrder(id: number) {
    return this.request<InboundOrderDetailResponse>(`/inbound/orders/${id}`);
  }

  async deleteInboundOrder(id: number) {
    return this.request<any>(`/inbound/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory
  async getInventory() {
    return this.request<any[]>('/inventory');
  }

  async getInventoryByCategory(categoryId: number) {
    return this.request<any>(`/inventory/${categoryId}`);
  }
}

export const apiService = new ApiService();
export { ApiError };
export type { InboundOrderSearchParams };