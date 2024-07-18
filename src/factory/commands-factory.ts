import {
    CommandInteraction,
    REST,
    Routes,
    SlashCommandBuilder,
} from 'discord.js'
import {
    DEBUG_MODE,
    DISCORD_CLIENT_ID,
    GUILD_ID,
    TOKEN,
    UPDATE,
} from '../tools/env'
import { assertIsMod } from '../tools/mods'
import { directoryImport } from 'directory-import'
import {
    DiscordCommand,
    DiscordInternalCommand,
    DiscordOption,
    DiscordOptionType,
    DiscordUserPermission,
} from './commands-types'
import consola from 'consola'

export const commands = new Map<string, DiscordInternalCommand>()

export const addDiscordCommand = (command: DiscordCommand) => {
    if (command.name === '')
        throw new Error('The command must have a valid name.')
    if (commands.has(command.name))
        throw new Error('This command already exists.')
    const data = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
    command.options.forEach(c => assignOptions(data, c))
    const execute = async (interaction: CommandInteraction) => {
        if (
            command.permissions !== DiscordUserPermission.ADMIN ||
            (await assertIsMod(interaction))
        )
            await command.handler(interaction)
    }
    const internal: DiscordInternalCommand = {
        data: data,
        execute: execute,
    }
    commands.set(command.name, internal)
    return internal
}

const assignOptions = (builder: SlashCommandBuilder, option: DiscordOption) => {
    switch (option.type) {
        case DiscordOptionType.STRING:
            builder.addStringOption(o =>
                o
                    .setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required),
            )
            break
        case DiscordOptionType.BOOLEAN:
            builder.addBooleanOption(o =>
                o
                    .setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required),
            )
            break
        case DiscordOptionType.CHANNEL:
            builder.addChannelOption(o =>
                o
                    .setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required),
            )
            break
        case DiscordOptionType.CHOICES:
            builder.addStringOption(o => {
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required)
                    .setAutocomplete(true)
                if (option.choices) o.addChoices(...option.choices)
                return o
            })
            break
        case DiscordOptionType.NUMBER:
            builder.addNumberOption(o => {
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required)
                if (option.min) o.setMinValue(option.min)
                if (option.max) o.setMaxValue(option.max)
                return o
            })
            break
        case DiscordOptionType.ROLE:
            builder.addRoleOption(o =>
                o
                    .setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required),
            )
            break
        case DiscordOptionType.USER:
            builder.addUserOption(o =>
                o
                    .setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required),
            )
            break
        default:
            throw new Error('Unknown option type.')
    }
}

export const syncDiscordCommands = async () => {
    let canUpdateCommands = UPDATE === 1
    if (UPDATE === 0)
        canUpdateCommands = await consola.prompt('Update commands ?', {
            type: 'confirm',
        })
    const commandsAsBody: object[] = []
    directoryImport('../commands/', (moduleName, modulePath, moduleData) => {
        if (!modulePath.startsWith('/debug') || DEBUG_MODE) {
            const command = addDiscordCommand(
                (moduleData as { default: object }).default as DiscordCommand,
            )
            if (canUpdateCommands) {
                if (DEBUG_MODE)
                    consola.log(`- ${command.data.name} - ${modulePath}`)
                commandsAsBody.push(command.data.toJSON())
            }
        }
    })
    if (canUpdateCommands) {
        consola.start('Started refreshing application (/) commands.')
        const data = (await new REST({ version: '10' })
            .setToken(TOKEN)
            .put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, GUILD_ID), {
                body: commandsAsBody,
            })) as object[]
        consola.success(
            `Successfully reloaded ${data.length} application (/) commands.`,
        )
    }
}
