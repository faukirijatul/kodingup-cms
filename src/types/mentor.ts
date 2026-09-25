export interface Expertises {
  expertises: string[];
}

export interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  companyLogoUrl: string;
  shortDescription: string;
  longDescription: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  expertises: string[];
}

export interface CreateMentorFormValues {
  firstName: string;
  lastName?: string;
  title: string;
  companyLogoUrl: File | string | null;
  shortDescription: string;
  longDescription: string;
  avatarUrl: File | string | null;
  expertises: string[];
}

export interface UpdateMentorPayload {
  mentorId: string;
  payload: CreateMentorFormValues;
}

export interface CreateMentorResponse {
  data: Mentor;
}

export interface ListMentorsQueryParams {
  offset?: number;
  limit?: number;
}

export interface ListMentorsResponse {
  data: Mentor[];
}

export interface GetMentorResponse {
  data: Mentor;
}
