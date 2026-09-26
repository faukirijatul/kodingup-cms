import * as authService from './auth';
import * as studentService from './student';
import * as studentInvitationService from './studentInvitation';
import * as courseService from './course';
import * as courseSectionService from './courseSection';
import * as courseSectionModuleService from './courseSectionModule';
import * as mentorService from './mentor';
import * as organizationService from './organization';
import * as assignmentService from './assignment';
import * as imageKitService from './imageKit';

export const HttpService = {
  ...authService,
  ...studentService,
  ...studentInvitationService,
  ...courseService,
  ...courseSectionService,
  ...courseSectionModuleService,
  ...mentorService,
  ...organizationService,
  ...assignmentService,
  ...imageKitService,
};
