import { SetMetadata } from "@nestjs/common"
import { AccessInfoDecorator } from "./interfaces"

// Defines an access information required for specific route
export const ACCESS_INFO_KEY = 'accessInfo'
export const SetAccessInfo = (accessInfo: AccessInfoDecorator) => SetMetadata(ACCESS_INFO_KEY, accessInfo)

/* 
Usage example:
@AccessInfo({
  resource: 'lessons',
  action: 'read'
})

*/