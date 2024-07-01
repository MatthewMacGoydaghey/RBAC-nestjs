// Your can define your own actions/roles/resources by changing and adding literals in these types
// Literal 'all' must not be deleted or changed

export type Action = 'all' | 'read' | 'create' | 'update' | 'delete'

export type Role = 'user' | 'editor' | 'admin'

export type Resource = 'articles' | 'users'


// By default RBAC guard checks 'roles' property inside 'request.user' object, you can change it to your own property in this variable:
export const userRolesProperty = 'roles'