import { Action, Resource } from "./types"



export interface AccessInfo {
  resource: Resource
  actions: [Action, 'own' | 'any'][]
}

export interface AccessInfoDecorator {
  resource: Resource
  action: Action
}

export interface RoleObject {
  roleName: string
  accessInfo: AccessInfo[]
}