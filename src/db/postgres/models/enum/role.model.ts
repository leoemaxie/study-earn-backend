import Student from '@models/student.model';
import Staff from '@models/staff.model';
import Admin from '@models/admin.model';

const RoleModel = {
  student: Student,
  staff: Staff,
  admin: Admin,
};

export default RoleModel;
