import { MenuAssignmentsIcon } from '@/components/icons/MenuAssignmentsIcon';
import { MenuCoursesIcon } from '@/components/icons/MenuCoursesIcon';
import { MenuLiveSessionsIcon } from '@/components/icons/MenuLiveSessionsIcon';
import { MenuMentorsIcon } from '@/components/icons/MenuMentorsIcon';
import { MenuOrganizationsIcon } from '@/components/icons/MenuOrganizationsIcon';
import { MenuScheduleIcon } from '@/components/icons/MenuScheduleIcon';
import { MenuSettingsIcon } from '@/components/icons/MenuSettingsIcon';
import { MenuStudentsIcon } from '@/components/icons/MenuStudentsIcon';

export const NAVIGATION_ITEMS = [
  { label: 'Students', path: '/students', icon: MenuStudentsIcon },
  { label: 'Courses', path: '/courses', icon: MenuCoursesIcon },
  { label: 'Schedule', path: '/schedule', icon: MenuScheduleIcon },
  {
    label: 'Live Sessions',
    path: '/live-sessions',
    icon: MenuLiveSessionsIcon,
  },
  { label: 'Assignments', path: '/assignments', icon: MenuAssignmentsIcon },
  { label: 'Mentors', path: '/mentors', icon: MenuMentorsIcon },
  {
    label: 'Organizations',
    path: '/organizations',
    icon: MenuOrganizationsIcon,
  },
  { label: 'Settings', path: '/settings', icon: MenuSettingsIcon },
];
