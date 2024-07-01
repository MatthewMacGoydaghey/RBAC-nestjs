import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccessInfo, AccessInfoDecorator } from "./interfaces";
import { ACCESS_INFO_KEY } from "./decorators";
import { Reflector } from "@nestjs/core";
import { rbacManager } from "./rbacManager";
import { Role, userRolesProperty } from "./config";


/*
Must be defined after user authtentication and defining access info for the route
Usage example:

@UseGuard(AuthGuard)
@AccessInfo({
  resource: 'lessons',
  action: 'read'
})
@UseGuard(RBACGuard)
getLessons() {
  return this.lessonsService.getLessons()
}
*/


@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    private Reflector: Reflector
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requestAccessInfo = this.Reflector.getAllAndOverride<AccessInfoDecorator>(ACCESS_INFO_KEY, [
        context.getHandler(),
        context.getClass()
      ])
    
    const request = context.switchToHttp().getRequest()
    const userRoles = request.user[userRolesProperty]
    if (!userRoles) {
      throw new ForbiddenException({message: `Request property ${userRolesProperty} not found`})
    }
    return checkAccessToResource(requestAccessInfo, userRoles)
  } catch (err) {
    throw new ForbiddenException({message: err})
  }
}}



function checkAccessToResource(requestAccessInfo: AccessInfoDecorator, userRoles: Role[] ) {
  try {
  const roles = rbacManager.roles
  let accesInfo: AccessInfo | undefined = undefined
  for (let role of userRoles) {
    const roleObj = roles.find((obj) => obj.roleName === role)
    if (!roleObj) continue
    accesInfo = roleObj.accessInfo.find((obj) => obj.resource === requestAccessInfo.resource)
    if (accesInfo) {
      for (let action of accesInfo.actions) {
        if (action[0].includes(requestAccessInfo.action) || action[0].includes('all')) return true
      }
    } else throw new ForbiddenException({message: 'You dont have enough rights to use this resource'})
  }
    throw new ForbiddenException({message: 'You dont have access to this resource'})
  } catch (err) {
    throw new ForbiddenException({message: err})
  }
  }