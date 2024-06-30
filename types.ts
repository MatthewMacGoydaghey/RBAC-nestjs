// Your own literals should be inserted in this types
// Literal 'all' must not be deleted or changed

export type Action = 'all' | 'read' | 'create' | 'update' | 'delete'


export type Role = 'HEAD PHYSICIAN' | 'OPERATOR' | 'THERAPIST' | 'SURGEON' | 'USER'

export type Resource = 'users' | 'reports' | 'appointments' | 'positions' | 'chats'
