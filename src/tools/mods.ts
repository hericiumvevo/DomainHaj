import { CommandInteraction, GuildMemberRoleManager } from 'discord.js'
import { MOD_ROLES } from './env'

const allowedUsers: string[] = []

export const assertIsMod = async (interaction: CommandInteraction) => {
    if (!allowedUsers.includes(interaction.user.id)) {
        if (!interaction.member) return false
        for (const e of (
            interaction.member.roles as GuildMemberRoleManager
        ).cache.values()) {
            if (MOD_ROLES.includes(e.id)) {
                allowedUsers.push(e.id)
                return true
            }
        }
        await interaction.reply({
            content:
                "You can only use this command if you're an **administrator**.",
            ephemeral: true,
        })
        return false
    }
    return true
}
