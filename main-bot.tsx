import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, CheckCircle, XCircle, Settings } from "lucide-react"

interface BotStatusProps {
  isOnline: boolean
  lastRestart: string
  guildsCount: number
  commandsDeployed: boolean
}

export default function MainBotStatus({ isOnline, lastRestart, guildsCount, commandsDeployed }: BotStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-4">
        <Bot className="h-10 w-10" /> حالة بوت الديسكورد
      </h1>

      <Card className="w-full max-w-md bg-gray-800 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            {isOnline ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
            حالة البوت: {isOnline ? "متصل" : "غير متصل"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
            <p>
              <Settings className="h-4 w-4 inline-block mr-1" />
              لإدارة البوت، استخدم أوامر Slash Commands في الديسكورد.
            </p>
            <p>
              <a
                href="https://discord.com/developers/applications"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Discord Developer Portal
              </a>{" "}
              لإعدادات البوت.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// هذا الملف مخصص الآن لعرض واجهة المستخدم فقط.
// تم إزالة منطق بوت الديسكورد من هذا الملف.
