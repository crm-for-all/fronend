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

export const organizationsApi = {
  create: async (data: CreateOrganizationRequestDTO): Promise<CreateOrganizationResponseDTO> => {
    const response = await api.post<CreateOrganizationResponseDTO>('/organizations', data);
    return response.data;
  },
};
