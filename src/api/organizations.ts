import api from './client';

export interface OrganizationStatusDTO {
  name: string;
  color: string;
}

export interface OrganizationTagDTO {
  name: string;
}

export interface CreateOrganizationRequestDTO {
  name: string;
  plan: string;
  statuses?: OrganizationStatusDTO[];
  tags?: OrganizationTagDTO[];
}

export interface CreateOrganizationResponseDTO {
  organization_id: string;
}

export interface CreateInviteRequestDTO {
  expires_in_hours: number;
}

export interface CreateInviteResponseDTO {
  invite_url: string;
}

export const organizationsApi = {
  create: async (data: CreateOrganizationRequestDTO): Promise<CreateOrganizationResponseDTO> => {
    const response = await api.post<CreateOrganizationResponseDTO>('/organizations', data);
    return response.data;
  },
  createInvite: async (organizationId: string, data: CreateInviteRequestDTO): Promise<CreateInviteResponseDTO> => {
    const response = await api.post<CreateInviteResponseDTO>(`/organizations/${organizationId}/invites`, data);
    return response.data;
  },
};
