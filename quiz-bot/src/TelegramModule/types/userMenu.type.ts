import { UserComand } from "./command.enum";

export const UserMenu: Record<UserComand, string> = {
    [UserComand.MAKE_AN_APPOINTMENT]: '📆 Запланировать сессию'
}