import { Role } from "./types"
import { AccessInfo, RoleObject } from "./interfaces"

export class RBACBuilder {
public roles: RoleObject[] = []
private role: Role

insertRole (roleName: Role) {
  let Role: RoleObject = {
    roleName,
    accessInfo: []
  }
  const duplicate = this.roles.find((obj) => obj.roleName === roleName)
  if (duplicate) {
    throw new Error(`Role ${roleName} already exists`)
  }
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

private findRole(roleName: string) {
  const roleObject = this.roles.find((obj) => obj.roleName === roleName)
  if (!roleObject) {
    throw new Error(`Role ${roleName} not found`)
  }
  return roleObject
}


private handleReEntry(roleObj: RoleObject, accessInfo: AccessInfo[]) {
  const inResources = accessInfo.map((obj) => obj.resource)
  roleObj.accessInfo.forEach((obj) => {
    for (let inResource of inResources) {
      if (inResource.includes(obj.resource)) {
      roleObj.accessInfo = roleObj.accessInfo.filter((obj) => obj.resource !== inResource)
      }
    }
  })
}
}


export const roleBuilder: RBACBuilder = new RBACBuilder()