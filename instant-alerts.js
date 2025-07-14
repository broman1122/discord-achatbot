import { EmbedBuilder } from "discord.js"

export class InstantHackAlerts {
  constructor(client, alertsChannelId) {
    this.client = client
    this.alertsChannelId = alertsChannelId
  }

  async sendAlert(type, username, details) {
    const channel = await this.client.channels.fetch(this.alertsChannelId)
    if (!channel || !channel.isTextBased()) {
      console.error(`❌ قناة التنبيهات (ID: ${this.alertsChannelId}) غير موجودة أو ليست قناة نصية.`)
      return
    }

    const embed = new EmbedBuilder()
      .setTitle(`🚨 تنبيه اختراق: ${type}`)
      .setDescription(`تم الكشف عن نشاط مشبوه!`)
      .addFields(
        { name: "👤 اللاعب", value: username, inline: true },
        { name: "📝 التفاصيل", value: details, inline: false },
        { name: "⏰ الوقت", value: new Date().toLocaleString("ar-SA"), inline: true },
      )
      .setColor(0xff0000)
      .setTimestamp()

    await channel.send({ embeds: [embed] })
  }

  async sendBanNotification(username, reason, moderator) {
    const channel = await this.client.channels.fetch(this.alertsChannelId)
    if (!channel || !channel.isTextBased()) {
      console.error(`❌ قناة التنبيهات (ID: ${this.alertsChannelId}) غير موجودة أو ليست قناة نصية.`)
      return
    }

    const embed = new EmbedBuilder()
      .setTitle("🚫 تم حظر لاعب")
      .setDescription(`تم حظر اللاعب ${username} من السيرفر.`)
      .addFields(
        { name: "👤 اللاعب", value: username, inline: true },
        { name: "📝 السبب", value: reason, inline: true },
        { name: "👮 بواسطة", value: `<@${moderator}>`, inline: true },
        { name: "⏰ الوقت", value: new Date().toLocaleString("ar-SA"), inline: false },
      )
      .setColor(0xffa500)
      .setTimestamp()

    await channel.send({ embeds: [embed] })
  }

  async sendWarning(username, warningCount, reason) {
    const channel = await this.client.channels.fetch(this.alertsChannelId)
    if (!channel || !channel.isTextBased()) {
      console.error(`❌ قناة التنبيهات (ID: ${this.alertsChannelId}) غير موجودة أو ليست قناة نصية.`)
      return
    }

    const embed = new EmbedBuilder()
      .setTitle("⚠️ تحذير لاعب")
      .setDescription(`تم إصدار تحذير للاعب ${username}.`)
      .addFields(
        { name: "👤 اللاعب", value: username, inline: true },
        { name: "🔢 عدد التحذيرات", value: warningCount.toString(), inline: true },
        { name: "📝 السبب", value: reason, inline: false },
        { name: "⏰ الوقت", value: new Date().toLocaleString("ar-SA"), inline: true },
      )
      .setColor(0xffff00)
      .setTimestamp()

    await channel.send({ embeds: [embed] })
  }
}
