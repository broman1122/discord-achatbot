// هذا الملف قد يكون جزءًا من واجهة ويب أو مكونات React.
// وظيفة التنبيهات الفورية يتم التعامل معها حاليًا في instant-alerts.js.
// هذا الملف لا يؤثر مباشرة على تشغيل البوت الحالي.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BellRing, ShieldAlert, UserX } from "lucide-react"

interface AlertProps {
  type: "hack" | "ban" | "warning"
  player: string
  details: string
  timestamp: string
}

export function InstantAlertCard({ type, player, details, timestamp }: AlertProps) {
  let icon
  let titleText
  let colorClass

  switch (type) {
    case "hack":
      icon = <ShieldAlert className="h-6 w-6 text-red-500" />
      titleText = "🚨 تنبيه اختراق"
      colorClass = "border-red-500"
      break
    case "ban":
      icon = <UserX className="h-6 w-6 text-orange-500" />
      titleText = "🚫 حظر لاعب"
      colorClass = "border-orange-500"
      break
    case "warning":
      icon = <BellRing className="h-6 w-6 text-yellow-500" />
      titleText = "⚠️ تحذير لاعب"
      colorClass = "border-yellow-500"
      break
    default:
      icon = <BellRing className="h-6 w-6 text-gray-500" />
      titleText = "تنبيه"
      colorClass = "border-gray-500"
  }

  return (
    <Card className={`w-full max-w-md mx-auto my-4 ${colorClass} border-l-4`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon} {titleText}
        </CardTitle>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-2">اللاعب: {player}</p>
        <p className="text-sm text-gray-600">{details}</p>
      </CardContent>
    </Card>
  )
}

// مثال على الاستخدام (للتوضيح فقط، ليس جزءًا من منطق البوت)
/*
export function AlertList() {
  const alerts: AlertProps[] = [
    {
      type: "hack",
      player: "Hacker123",
      details: "تم الكشف عن اختراق سرعة في منطقة Spawn.",
      timestamp: "منذ 2 دقيقة",
    },
    {
      type: "ban",
      player: "CheaterPro",
      details: "تم حظر اللاعب بسبب استخدام برامج خارجية.",
      timestamp: "منذ 10 دقائق",
    },
    {
      type: "warning",
      player: "PlayerXYZ",
      details: "تحذير بسبب الشتم في الشات العام.",
      timestamp: "منذ 30 دقيقة",
    },
  ]

  return (
    <div className="flex flex-col items-center">
      {alerts.map((alert, index) => (
        <InstantAlertCard key={index} {...alert} />
      ))}
    </div>
  )
}
*/
