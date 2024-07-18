import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

export type DiscordEventHandler = (
    interaction: CommandInteraction,
) => Promise<void>

export enum DiscordUserPermission {
    USER,
    ADMIN,
}

export enum DiscordOptionType {
    STRING,
    NUMBER,
    USER,
    BOOLEAN,
    ROLE,
    CHANNEL,
    CHOICES,
}

export interface DiscordChoice {
    name: string
    value: string
}

export interface DiscordOption {
    name: string
    description?: string
    type: DiscordOptionType
    required: boolean
    min?: number
    max?: number
    choices?: DiscordChoice[]
}

export interface DiscordCommand {
    name: string
    description: string
    permissions: DiscordUserPermission
    options: DiscordOption[]
    handler: DiscordEventHandler
}

export interface DiscordInternalCommand {
    data: SlashCommandBuilder
    execute: DiscordEventHandler
}
