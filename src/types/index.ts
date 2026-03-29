export interface User {
  id: string;
  email: string;
}

export interface CustomerPhone {
  id: string;
  phone_number: string;
  is_primary: boolean;
}

export type CustomerStatus = 'lead' | 'contacted' | 'qualified' | 'customer' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  status: CustomerStatus;
  notes: string | null;
  last_event: string | null;
  created_at: string;
  updated_at: string;
  phones: CustomerPhone[];
}

export interface CustomerCreateDTO {
  name: string;
  email?: string;
  status: CustomerStatus;
  notes?: string;
  last_event?: string;
  phones?: { phone_number: string; is_primary: boolean }[];
}

export interface CustomerUpdateDTO {
  name?: string;
  email?: string;
  status?: CustomerStatus;
  notes?: string;
  last_event?: string;
}
