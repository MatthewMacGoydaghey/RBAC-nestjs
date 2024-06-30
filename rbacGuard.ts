import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AccessInfo, AccessInfoDecorator } from "./interfaces";
import { ACCESS_INFO_KEY } from "./decorators";
import { Reflector } from "@nestjs/core";
import { roleBuilder } from "./rbacBuilder";


/*
Must be defined after user authtentication and defining access info for the route
Using example:

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

// By default guard checks 'roles' property inside 'request.user' object, you can change it to your own property in this variable:
const userRolesProperty = 'roles'
// And if you keep roles as objects in DB table and it has additional property for value. This variable is undefiend by default.
const userRolesObjectValueProperty = undefined


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
    const userAccessInfo = checkAccessToResource(requestAccessInfo, userRoles) as AccessInfo
    return checkAccessToAction(userAccessInfo, requestAccessInfo)
  } catch (err) {
    throw new ForbiddenException({message: err})
  }
}}



function checkAccessToResource(requestAccessInfo: AccessInfoDecorator, userRoles: any ) {
  try {
    const roles = roleBuilder.roles
  let hasAccess: boolean = false
  let accesInfo: AccessInfo | undefined = undefined
  for (let role of userRoles) {
    const roleObj = roles.find((obj) => obj.roleName === (role[userRolesObjectValueProperty] ?? role))
    if (!roleObj) {
      continue
    }
    accesInfo = roleObj.accessInfo.find((obj) => obj.resource === requestAccessInfo.resource)
    if (accesInfo) {
      hasAccess = true
      break
    }
  }
    if (hasAccess) {
      return accesInfo
    } else {
        throw new ForbiddenException({message: 'You dont have access to this resource'})
    }
  } catch (err) {
    throw new ForbiddenException({message: err})
  }
  
  }



  function checkAccessToAction(userAccessInfo: AccessInfo, requestAccessInfo: AccessInfoDecorator) {
    for (let action of userAccessInfo.actions) {
      if (action.includes(requestAccessInfo.action) || action.includes('all')) {
        return true
      }
    }
    throw new ForbiddenException({message: 'You dont have enough rights to use this resource'})
  }