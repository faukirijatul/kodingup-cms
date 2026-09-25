export interface CourseSection {
  courseId: string;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListCourseSectionsQueryParams {
  offset?: number;
  limit?: number;
  courseId?: string;
}

export interface ListCourseSectionsResponse {
  data: CourseSection[];
  meta: {
    total: number;
  };
}

export interface GetCourseSectionResponse {
  data: CourseSection;
}

export interface GetCourseSectionTotalsResponse {
  data: {
    id: string;
    courseId: string;
    name: string;
    position: number;
    totalModules: number;
    totalDuration: number;
  };
}

export interface CourseSectionHttpArgs {
  courseId: string;
  sectionPosition: string;
}