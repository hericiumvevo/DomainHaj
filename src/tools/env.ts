import dotenv from 'dotenv'

// ENV VARS INIT
dotenv.config()
const TOKEN = process.env['DISCORD_TOKEN'] ?? ''
if (!TOKEN) throw new Error('No token found.')
const DISCORD_CLIENT_ID = process.env['DISCORD_CLIENT_ID'] ?? ''
if (!DISCORD_CLIENT_ID) throw new Error('No client found.')
const DEBUG_MODE = (process.env['DEBUG_MODE'] ?? '0') === '1'
const MOD_ROLES = (process.env['MOD_ROLES'] ?? '').split('+')
const GUILD_ID = process.env['GUILD_ID'] ?? ''
const UPDATE = (Number(process.env['UPDATE']) ?? 0) % 3

export {
    TOKEN,
    DISCORD_CLIENT_ID,
    DEBUG_MODE,
    MOD_ROLES,
    GUILD_ID,
    UPDATE,
}
