import { Action, Resource, Role } from "./config"
import { AccessInfo, RoleObject } from "./interfaces"

export class RBACManager {
public roles: RoleObject[] = []
private role: Role

insertRole (roleName: Role) {
  let Role: RoleObject = {
    roleName,
    accessInfo: []
  }
  const duplicate = this.roles.find((obj) => obj.roleName === roleName)
  if (duplicate) throw new Error(`Role ${roleName} already exists`)
  this.role = roleName
  this.roles.push(Role)
  return this
}

grantAccess(accessInfo: AccessInfo[]) {
  const roleObj = this.findRole(this.role)
  this.handleReEntry(roleObj, accessInfo)
  roleObj.accessInfo.push(...accessInfo)
  return this

}

extendAccess(fromRole: Role) {
  const toRoleObj = this.findRole(this.role)
  const fromRoleObj = this.findRole(fromRole)
  toRoleObj.accessInfo.push(...fromRoleObj.accessInfo)
  return this
}


allowedAny(roles: Role[], resource: Resource, action: Action): Boolean {
  for (let role of roles) {
  const foundRole = this.findRole(role)
  const resourceAcesses = foundRole.accessInfo.find((obj) => obj.resource === resource)
  if (!resourceAcesses) continue
  const actionAccess = resourceAcesses.actions.find((obj) => obj[0] === action || obj[0] == 'all')
  if (!actionAccess) continue
  return actionAccess[1] === 'any'
  }
  return false
}


private findRole(roleName: string) {
  const roleObject = this.roles.find((obj) => obj.roleName === roleName)
  if (!roleObject) throw new Error(`Role ${roleName} not found`)
  return roleObject
}


private handleReEntry(roleObj: RoleObject, accessInfo: AccessInfo[]) {
  const inResources = accessInfo.map((obj) => obj.resource)
  roleObj.accessInfo.forEach((obj) => {
    for (let inResource of inResources) {
      if (inResource.includes(obj.resource)) 
        roleObj.accessInfo = roleObj.accessInfo.filter((obj) => obj.resource !== inResource)
    }
  })
}
}


export const rbacManager: RBACManager = new RBACManager()