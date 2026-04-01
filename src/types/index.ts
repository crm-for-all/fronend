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
