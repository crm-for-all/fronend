export interface User {
  id: string;
  email: string;
}

export interface CustomerPhone {
  id?: string;
  phone_number: string;
  is_primary: boolean;
}

export type StatusColor = 'gray' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'pink' | 'teal';

export interface Tag {
  id: string;
  name: string;
}

export interface Status {
  id: string;
  name: string;
  color: StatusColor;
}

export type CustomerStatus = 'lead' | 'contacted' | 'qualified' | 'customer' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  status: CustomerStatus | Status | string | null;
  status_id?: string;
  tag_ids?: string[];
  tags?: Tag[];
  notes: string | null;
  last_event: string | null;
  created_at: string;
  updated_at: string;
  phones: CustomerPhone[];
}

export interface CustomerCreateDTO {
  name: string;
  email?: string;
  status?: string;
  status_id?: string;
  tag_ids?: string[];
  notes?: string;
  last_event?: string;
  phones?: { phone_number: string; is_primary: boolean }[];
  status_color?: StatusColor;
}

export interface CustomerUpdateDTO {
  name?: string;
  email?: string;
  status?: string;
  status_id?: string;
  tag_ids?: string[];
  notes?: string;
  last_event?: string;
  phones?: { phone_number: string; is_primary: boolean }[];
  status_color?: StatusColor;
}

export interface CustomerFilters {
  name?: string;
  name_match?: 'full' | 'starts_with';
  phone?: string;
  phone_match?: 'starts_with' | 'ends_with';
  email?: string;
  email_match?: 'starts_with';
  status?: string;
  tag?: string;
}
export interface StatusStat {
  status_id: string | null;
  status_name: string | null;
  count: number;
}

export interface TagStat {
  tag_id: string;
  tag_name: string;
  count: number;
}

export interface OverviewStats {
  by_status: StatusStat[];
  by_tag: TagStat[];
}

export type TimePeriod = 
  | "last_12_months" 
  | "last_3_months_weekly" 
  | "last_12_days" 
  | "last_7_days" 
  | "last_3_days";

export interface TimeSeriesPoint {
  label: string;
  count: number;
}

export interface TimeSeriesResponse {
  period: TimePeriod;
  data: TimeSeriesPoint[];
}

// Financials
export interface Contract {
  id: string;
  customer_id: string;
  title: string;
  total_amount: number;
  total_paid: number;
  remaining_balance: number;
  payment_count: number;
  is_fully_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractCreateDTO {
  title: string;
  total_amount: number;
}

export interface ContractUpdateDTO {
  title?: string;
  total_amount?: number;
}

export interface Payment {
  id: string;
  contract_id: string;
  amount: number;
  paid_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentCreateDTO {
  amount: number;
  paid_at?: string;
}

export interface PaymentUpdateDTO {
  amount?: number;
  paid_at?: string;
}
