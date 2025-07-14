import { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } from "discord.js"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, CheckCircle, XCircle } from "lucide-react"

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

// Configuration
const CONFIG = {
  TOKEN: process.env.DISCORD_BOT_TOKEN!,
  CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
  GUILD_ID: process.env.DISCORD_GUILD_ID!,
  ROBLOX_API_KEY: process.env.ROBLOX_API_KEY!,
}

// Database simulation (use a real database in production)
const serverSettings = new Map()
const playerBans = new Map()
const replayData = new Map()

// Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the anti-cheat system")
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Channel for anti-cheat logs").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("webhook").setDescription("Webhook URL for Roblox integration").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("replay")
    .setDescription("Get player replay data")
    .addStringOption((option) => option.setName("username").setDescription("Roblox username").setRequired(true))
    .addIntegerOption((option) =>
      option.setName("duration").setDescription("Replay duration in minutes (default: 5)").setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a player")
    .addStringOption((option) =>
      option.setName("username").setDescription("Roblox username to unban").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName("players")
    .setDescription("Show current players in the server")
    .addStringOption((option) => option.setName("server").setDescription("Server ID (optional)").setRequired(false)),

  new SlashCommandBuilder().setName("commands").setDescription("Show all available commands"),

  new SlashCommandBuilder().setName("stats").setDescription("Show anti-cheat statistics"),
]

// Register commands
const rest = new REST({ version: "9" }).setToken(CONFIG.TOKEN)

async function deployCommands() {
  try {
    console.log("Started refreshing application (/) commands.")
    await rest.put(Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID), { body: commands })
    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
}

// Bot ready event
client.once("ready", () => {
  console.log(`✅ Bot is ready! Logged in as ${client.user?.tag}`)
  deployCommands()
})

// Interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const { commandName } = interaction

  try {
    switch (commandName) {
      case "setup":
        await handleSetup(interaction)
        break
      case "replay":
        await handleReplay(interaction)
        break
      case "unban":
        await handleUnban(interaction)
        break
      case "players":
        await handlePlayers(interaction)
        break
      case "commands":
        await handleCommands(interaction)
        break
      case "stats":
        await handleStats(interaction)
        break
    }
  } catch (error) {
    console.error("Error handling command:", error)
    await interaction.reply({
      content: "An error occurred while processing your command.",
      ephemeral: true,
    })
  }
})

async function handleSetup(interaction: any) {
  const channel = interaction.options.getChannel("channel")
  const webhook = interaction.options.getString("webhook")

  serverSettings.set(interaction.guildId, {
    logChannel: channel.id,
    webhook: webhook,
    setupBy: interaction.user.id,
    setupAt: new Date(),
  })

  const embed = new EmbedBuilder()
    .setTitle("🛡️ Anti-Cheat System Setup Complete")
    .setDescription("The anti-cheat system has been configured successfully!")
    .addFields(
      { name: "📢 Log Channel", value: `<#${channel.id}>`, inline: true },
      { name: "🔗 Webhook", value: "✅ Configured", inline: true },
      { name: "👤 Setup By", value: `<@${interaction.user.id}>`, inline: true },
    )
    .setColor(0x00ff00)
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })

  // Send setup instructions to user's DM
  try {
    const dmEmbed = new EmbedBuilder()
      .setTitle("🤖 Bot Commands & Setup Guide")
      .setDescription("Here are all the available commands and setup instructions:")
      .addFields(
        {
          name: "🎮 Game Commands",
          value:
            "`/replay <username>` - Get player replay\n`/players` - Show current players\n`/unban <username>` - Unban a player",
          inline: false,
        },
        {
          name: "⚙️ Admin Commands",
          value: "`/setup` - Configure the system\n`/stats` - View statistics\n`/commands` - Show this help",
          inline: false,
        },
        {
          name: "🔧 Roblox Integration",
          value:
            "1. Place the server script in ServerScriptService\n2. Update the webhook URL in the script\n3. Configure group permissions for admin commands",
          inline: false,
        },
        {
          name: "🎨 Customization",
          value:
            "You can customize:\n• Detection thresholds\n• Ban/kick messages\n• Webhook appearance\n• Command permissions",
          inline: false,
        },
      )
      .setColor(0x0099ff)
      .setFooter({ text: "Roblox Anti-Cheat System" })
      .setTimestamp()

    await interaction.user.send({ embeds: [dmEmbed] })
  } catch (error) {
    console.log("Could not send DM to user")
  }
}

async function handleReplay(interaction: any) {
  const username = interaction.options.getString("username")
  const duration = interaction.options.getInteger("duration") || 5

  await interaction.deferReply()

  // Simulate getting replay data (replace with actual Roblox API call)
  const replayEmbed = new EmbedBuilder()
    .setTitle(`🎬 Replay Data for ${username}`)
    .setDescription(`Showing last ${duration} minutes of gameplay`)
    .addFields(
      {
        name: "📊 Statistics",
        value: `• Positions recorded: 1,247\n• Suspicious actions: 3\n• Warnings issued: 1`,
        inline: true,
      },
      { name: "⚠️ Detections", value: `• Speed violations: 1\n• Teleport attempts: 2\n• Fly attempts: 0`, inline: true },
      { name: "🕐 Time Range", value: `Last ${duration} minutes`, inline: true },
    )
    .setColor(0xff9900)
    .setTimestamp()

  await interaction.editReply({ embeds: [replayEmbed] })
}

async function handleUnban(interaction: any) {
  const username = interaction.options.getString("username")

  // Simulate unbanning (replace with actual database operation)
  playerBans.delete(username.toLowerCase())

  const embed = new EmbedBuilder()
    .setTitle("✅ Player Unbanned")
    .setDescription(`${username} has been successfully unbanned.`)
    .addFields(
      { name: "👤 Player", value: username, inline: true },
      { name: "👮 Unbanned By", value: `<@${interaction.user.id}>`, inline: true },
      { name: "🕐 Time", value: new Date().toLocaleString(), inline: true },
    )
    .setColor(0x00ff00)
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

async function handlePlayers(interaction: any) {
  // Simulate current players (replace with actual Roblox API call)
  const players = [
    { name: "Player1", id: "123456789", joinTime: "5 minutes ago" },
    { name: "Player2", id: "987654321", joinTime: "12 minutes ago" },
    { name: "Player3", id: "456789123", joinTime: "3 minutes ago" },
  ]

  const embed = new EmbedBuilder()
    .setTitle("👥 Current Players in Server")
    .setDescription(`Total Players: ${players.length}/20`)
    .addFields(
      ...players.map((player) => ({
        name: `🎮 ${player.name}`,
        value: `ID: ${player.id}\nJoined: ${player.joinTime}`,
        inline: true,
      })),
    )
    .setColor(0x0099ff)
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

async function handleCommands(interaction: any) {
  const embed = new EmbedBuilder()
    .setTitle("🤖 Available Commands")
    .setDescription("Here are all the commands you can use:")
    .addFields(
      {
        name: "🎮 Game Commands",
        value:
          "`/replay <username>` - Get player replay data\n`/players` - Show current players in server\n`/stats` - View anti-cheat statistics",
        inline: false,
      },
      {
        name: "👮 Moderation Commands",
        value: "`/unban <username>` - Unban a player\n`/setup` - Configure the system (Admin only)",
        inline: false,
      },
      { name: "❓ Help Commands", value: "`/commands` - Show this help message", inline: false },
    )
    .setColor(0x0099ff)
    .setFooter({ text: "Use these commands to manage your Roblox server!" })
    .setTimestamp()

  await interaction.reply({ embeds: [embed], ephemeral: true })
}

async function handleStats(interaction: any) {
  const embed = new EmbedBuilder()
    .setTitle("📊 Anti-Cheat Statistics")
    .setDescription("System performance and detection stats")
    .addFields(
      {
        name: "🛡️ Detections Today",
        value: "• Speed hacks: 15\n• Teleport hacks: 8\n• Fly hacks: 3\n• Other exploits: 12",
        inline: true,
      },
      {
        name: "👥 Player Actions",
        value: "• Players kicked: 23\n• Players banned: 5\n• Warnings issued: 38",
        inline: true,
      },
      {
        name: "⚡ System Status",
        value: "• Status: ✅ Online\n• Uptime: 99.9%\n• Last restart: 2 hours ago",
        inline: true,
      },
    )
    .setColor(0x00ff00)
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

// Start the bot
client.login(CONFIG.TOKEN)

function DiscordBotIndex() {
  // هذه القيم هي أمثلة للعرض في الواجهة الأمامية فقط.
  // حالة البوت الفعلية يتم التعامل معها في main-bot.js (كعملية خادم).
  const isOnline = true // نفترض أنه متصل للعرض
  const lastRestart = "منذ 5 دقائق"
  const guildsCount = 3 // عدد السيرفرات التي يراقبها البوت
  const commandsDeployed = true // نفترض أن الأوامر منشورة

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
        <Bot className="h-10 w-10" />
        Roblox Anti-Cheat Discord Bot
      </h1>
      <p className="text-lg text-gray-300 text-center">هذه هي واجهة المستخدم (Frontend) لمشروع بوت الديسكورد.</p>
      <p className="text-md text-gray-400 mt-2">البوت يعمل في الخلفية كعملية Node.js منفصلة.</p>
      <Card className="mt-8 w-full max-w-md bg-gray-800 text-white shadow-lg">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            {isOnline ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            حالة البوت: {isOnline ? "متصل" : "غير متصل"}
          </h2>
          <p className="text-lg">
            آخر إعادة تشغيل: <span className="font-medium">{lastRestart}</span>
          </p>
          <p className="text-lg">
            عدد السيرفرات: <span className="font-medium">{guildsCount}</span>
          </p>
          <p className="text-lg flex items-center gap-2">
            الأوامر منشورة:{" "}
            {commandsDeployed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </p>
          <div className="mt-4 text-sm text-gray-400">
            <p>لإدارة البوت، استخدم أوامر Slash Commands في الديسكورد.</p>
            <p>تأكد من تعيين متغيرات البيئة اللازمة في إعدادات مشروع Vercel.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DiscordBotIndex
