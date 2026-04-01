export interface User {
  id: string;
  email: string;
}

export interface CustomerPhone {
  id?: string;
  phone_number: string;
  is_primary: boolean;
}

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type TagTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple' | 'pink' | 'teal';

export interface Tag {
  id: string;
  name: string;
  tone?: TagTone;
}

export interface Status {
  id: string;
  name: string;
  tone: StatusTone;
  color?: string; // Temporarily keeping color for migration/legacy overlap
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
  status_tone?: StatusTone;
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
  status_tone?: StatusTone;
}
