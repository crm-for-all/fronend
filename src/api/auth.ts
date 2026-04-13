import api from './client';

export interface RegisterDTO {
  email: string;
  password?: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  password?: string;
}

export interface OrganizationDTO {
  id: string;
  name: string;
}

export interface AuthResponseDTO {
  access_token: string;
  user_id: string;
  email: string;
  name?: string;
  organizations: OrganizationDTO[];
}

export const authApi = {
  login: async (data: LoginDTO): Promise<AuthResponseDTO> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDTO): Promise<AuthResponseDTO> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};
