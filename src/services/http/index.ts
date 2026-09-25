import * as authService from './auth';
import * as studentService from './student';
import * as studentInvitationService from './studentInvitation';
import * as organizationService from './organization';

export const HttpService = {
  ...authService,
  ...studentService,
  ...studentInvitationService,
  ...organizationService,
};
