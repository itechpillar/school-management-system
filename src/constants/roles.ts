export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  NURSE: 'nurse'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES]; 