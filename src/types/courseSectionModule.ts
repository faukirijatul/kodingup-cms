export interface CourseSectionModule {
  courseSectionId: string;
  type: string;
  title: string;
  description: string;
  position: number;
  assetUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListCourseSectionModulesQueryParams {
  offset?: number;
  limit?: number;
  courseId?: string;
  sectionPosition?: number;
}

export interface ListCourseSectionModulesResponse {
  data: CourseSectionModule[];
  meta: {
    total: number;
  };
}

export interface CourseSectionModuleHttpArgs {
  courseId: string;
  sectionPosition: string;
  modulePosition: string;
}