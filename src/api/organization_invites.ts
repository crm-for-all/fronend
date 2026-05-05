import api from './client';

export interface AcceptInviteRequestDTO {
  uid: string;
  token: string;
}

export interface AcceptInviteResponseDTO {
  organization_id: string;
}

export const organizationInvitesApi = {
  accept: async (data: AcceptInviteRequestDTO): Promise<AcceptInviteResponseDTO> => {
    const response = await api.post<AcceptInviteResponseDTO>('/organization-invites/accept', data);
    return response.data;
  },
};
