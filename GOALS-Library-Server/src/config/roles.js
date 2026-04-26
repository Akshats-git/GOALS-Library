const allRoles = {
  student: ['S', 'SL', 'AS', 'all'],
  librarian: ['L', 'SL', 'AL', 'all'],
  admin: ['A', 'AL', 'AS', 'all'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
