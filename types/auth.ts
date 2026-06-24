import { UserRole } from "@/utils/schemas/enums.schemas"

export interface UserPayload {
  sub: {
    user_id: string
    role: UserRole
  }
}