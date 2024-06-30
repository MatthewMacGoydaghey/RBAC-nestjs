import { roleBuilder } from "./rbacBuilder"

// One should define custom roles/resources/actions in 'types.ts' file

roleBuilder

.insertRole('student')
.grantAccess([{
  resource: 'profiles',
  actions: ['read', 'create']
}, {
  resource: 'lessons',
  actions: ['read']
}])

.insertRole('teacher')
.extendAccess('student')
.grantAccess([{
  resource: 'lessons',
  actions: ['all']
}])

.insertRole('director')
.extendAccess('teacher')
.grantAccess([{
  resource: 'profiles',
  actions: ['all']
}, {
  resource: 'workers',
  actions: ['all']
}])