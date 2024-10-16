const USER_FIELDS = [
  'firstName',
  'lastName',
  'dob',
  'phoneNumber',
  'department',
];

export const STUDENT_FIELDS = [
  'matricNo',
  'cgpa',
  'level',
  'semester',
];

const ALLOWED_FIELDS = {
  staff: USER_FIELDS,
  admin: USER_FIELDS,
  student: [...STUDENT_FIELDS, ...USER_FIELDS],
};

export const CUSTOM_FIELDS = 
{
  staff: USER_FIELDS,
  admin: USER_FIELDS,
  student: STUDENT_FIELDS,
};

export default ALLOWED_FIELDS;