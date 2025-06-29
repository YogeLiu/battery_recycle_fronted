export interface User {
  id: number;
  username: string;
  real_name?: string;
  role: 'super_admin' | 'normal';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface BatteryCategory {
  id: number;
  name: string;
  description?: string;
  unit_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateInboundOrderItem {
  category_id: number;
  gross_weight: number;
  tare_weight: number;
  unit_price: number;
}

export interface CreateInboundOrderRequest {
  supplier_name: string;
  items: CreateInboundOrderItem[];
  notes?: string;
}

export interface InboundOrder {
  id: number;
  order_no: string;
  supplier_name: string;
  total_amount: number;
  status: string;
  notes?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  category_id: number;
  current_weight_kg: number;
  last_inbound_at?: string;
  last_outbound_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InboundOrderDetail {
  category_id: number;
  category_name: string;
  gross_weight: number;
  tare_weight: number;
  net_weight: number;
  unit_price: number;
  sub_total: number;
}

export interface InboundOrderDetailResponse {
  order: InboundOrder;
  detail: InboundOrderDetail[];
}

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}