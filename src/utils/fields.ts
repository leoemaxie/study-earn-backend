const USER_FIELDS = [
  'firstName',
  'lastName',
  'dob',
  'phoneNumber',
  'department',
  'gps',
];

export const STUDENT_FIELDS = ['matricNo', 'cgpa', 'level', 'semester'];
export const STAFF_FIELDS = ['position', 'directorate'];

const ALLOWED_FIELDS = {
  admin: USER_FIELDS,
  staff: [...STAFF_FIELDS, ...USER_FIELDS],
  student: [...STUDENT_FIELDS, ...USER_FIELDS],
};

export const CUSTOM_FIELDS = {
  staff: USER_FIELDS,
  admin: USER_FIELDS,
  student: STUDENT_FIELDS,
};

export default ALLOWED_FIELDS;
