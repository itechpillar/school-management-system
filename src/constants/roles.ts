export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  NURSE: 'nurse',
  PARENT: 'parent',
  STUDENT: 'student'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES]; 