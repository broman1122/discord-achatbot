import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

const replayDatabase = new Map()

function generateMockReplayData(username) {
  const actions = [
    "تحرك للأمام",
    "قفز",
    "ركض",
    "تفاعل مع كائن",
    "أطلق النار",
    "تلقى ضرر",
    "استخدم مهارة",
    "تحدث في الشات",
    "التقط عنصر",
    "أسقط عنصر",
  ]
  const chatMessages = [
    "مرحباً بالجميع!",
    "هل من أحد هنا؟",
    "أحتاج مساعدة في هذه المهمة.",
    "هذه اللعبة رائعة!",
    "هل يمكن لأحد أن يشرح لي هذا؟",
  ]
  const voiceActivity = ["تحدث", "صمت", "ضحك", "غنى"]

  const replayData = {
    username: username,
    timestamp: new Date().toISOString(),
    movementLog: Array.from({ length: 20 }, (_, i) => ({
      time: i * 0.5,
      position: `(${Math.random() * 100}, ${Math.random() * 50}, ${Math.random() * 100})`,
      action: actions[Math.floor(Math.random() * actions.length)],
    })),
    chatLog: Array.from({ length: 5 }, (_, i) => ({
      time: i * 10,
      message: chatMessages[Math.floor(Math.random() * chatMessages.length)],
    })),
    voiceLog: Array.from({ length: 10 }, (_, i) => ({
      time: i * 5,
      activity: voiceActivity[Math.floor(Math.random() * voiceActivity.length)],
    })),
    violations: [],
  }
  return replayData
}

async function fetchReplayData(username) {
  // في المستقبل، يمكن جلب البيانات من Supabase أو أي قاعدة بيانات أخرى هنا.
  // مثال:
  // import { supabase } from "../lib/supabase.js";
  // const { data, error } = await supabase.from('replay_logs').select('*').eq('username', username).single();
  // if (data) return data;

  if (!replayDatabase.has(username.toLowerCase())) {
    replayDatabase.set(username.toLowerCase(), generateMockReplayData(username))
  }
  return replayDatabase.get(username.toLowerCase())
}

export const replayCommands = [
  new SlashCommandBuilder()
    .setName("replay")
    .setDescription("عرض تسجيل شامل لحركة اللاعب والشات")
    .addStringOption((option) => option.setName("username").setDescription("اسم اللاعب").setRequired(true)),

  new SlashCommandBuilder()
    .setName("chat-log")
    .setDescription("عرض سجل الشات للاعب")
    .addStringOption((option) => option.setName("username").setDescription("اسم اللاعب").setRequired(true)),

  new SlashCommandBuilder()
    .setName("voice-log")
    .setDescription("عرض سجل النشاط الصوتي للاعب")
    .addStringOption((option) => option.setName("username").setDescription("اسم اللاعب").setRequired(true)),

  new SlashCommandBuilder()
    .setName("replay-video")
    .setDescription("محاكاة فيديو لحركة اللاعب")
    .addStringOption((option) => option.setName("username").setDescription("اسم اللاعب").setRequired(true)),

  new SlashCommandBuilder()
    .setName("live-replay")
    .setDescription("محاكاة مراقبة مباشرة لحركة اللاعب")
    .addStringOption((option) => option.setName("username").setDescription("اسم اللاعب").setRequired(true)),
]

export async function handleReplayCommands(interaction) {
  const username = interaction.options.getString("username")
  const replayData = await fetchReplayData(username)

  if (!replayData) {
    await interaction.reply({
      content: `❌ لا توجد بيانات Replay للاعب ${username}.`,
      ephemeral: true,
    })
    return
  }

  const embed = new EmbedBuilder().setTitle(`🎬 سجل Replay للاعب: ${username}`).setColor(0x0099ff)

  switch (interaction.commandName) {
    case "replay":
      embed.setDescription("عرض شامل لحركة اللاعب والشات والنشاط الصوتي.")
      embed.addFields(
        {
          name: "🏃‍♂️ سجل الحركة (أول 5)",
          value:
            replayData.movementLog
              .slice(0, 5)
              .map((log) => `[${log.time}s] ${log.action} @ ${log.position}`)
              .join("\n") || "لا توجد بيانات حركة.",
          inline: false,
        },
        {
          name: "💬 سجل الشات (أول 3)",
          value:
            replayData.chatLog
              .slice(0, 3)
              .map((log) => `[${log.time}s] ${log.message}`)
              .join("\n") || "لا توجد بيانات شات.",
          inline: false,
        },
        {
          name: "🎤 سجل الصوت (أول 3)",
          value:
            replayData.voiceLog
              .slice(0, 3)
              .map((log) => `[${log.time}s] ${log.activity}`)
              .join("\n") || "لا توجد بيانات صوت.",
          inline: false,
        },
      )
      break
    case "chat-log":
      embed.setDescription("سجل الشات للاعب.")
      embed.addFields({
        name: "💬 سجل الشات",
        value: replayData.chatLog.map((log) => `[${log.time}s] ${log.message}`).join("\n") || "لا توجد بيانات شات.",
        inline: false,
      })
      break
    case "voice-log":
      embed.setDescription("سجل النشاط الصوتي للاعب.")
      embed.addFields({
        name: "🎤 سجل الصوت",
        value: replayData.voiceLog.map((log) => `[${log.time}s] ${log.activity}`).join("\n") || "لا توجد بيانات صوت.",
        inline: false,
      })
      break
    case "replay-video":
      embed.setDescription("محاكاة فيديو لحركة اللاعب.")
      embed.addFields({
        name: "🎥 رابط الفيديو (محاكاة)",
        value: `[شاهد فيديو Replay للاعب ${username}](https://example.com/replay/${username}?video=true)`,
        inline: false,
      })
      break
    case "live-replay":
      embed.setDescription("محاكاة مراقبة مباشرة لحركة اللاعب.")
      embed.addFields({
        name: "🔴 رابط المراقبة المباشرة (محاكاة)",
        value: `[شاهد المراقبة المباشرة للاعب ${username}](https://example.com/live-replay/${username})`,
        inline: false,
      })
      break
  }

  await interaction.reply({ embeds: [embed] })
}
