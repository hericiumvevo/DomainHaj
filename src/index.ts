import { Client, GatewayIntentBits } from 'discord.js'
import { TOKEN } from './tools/env'
import { commands, syncDiscordCommands } from './factory/commands-factory'
import consola from 'consola'

const BOT_NAME = ""

consola.start(`Starting ${BOT_NAME}...`)

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
]

const client = new Client({
    intents: intents,
})

client.on('ready', () => {
    if (!client.user) throw new Error("The bot can't connect as a user.")
    consola.info(`Logged in as ${client.user.username}`)
    //...//
})

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = commands.get(interaction.commandName)
        if (!command) throw new Error("This command doesn't exist")
        await command.execute(interaction)
    }
    //...//
})

client.on('messageCreate', async message => {
    if (!client.user) throw new Error("Unable to access the bot's user.")
    if (message.author.bot) return
    //...//
})

const init = async () => {
    await syncDiscordCommands()
    await client.login(TOKEN)
}

init().then()
