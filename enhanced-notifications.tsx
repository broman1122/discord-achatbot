// هذا الملف قد يكون جزءًا من واجهة ويب أو مكونات React.
// وظيفة الإشعارات المحسنة يتم التعامل معها حاليًا في instant-alerts.js.
// هذا الملف لا يؤثر مباشرة على تشغيل البوت الحالي.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BellRing, ShieldAlert, UserX } from "lucide-react"

interface NotificationProps {
  type: "alert" | "ban" | "warning"
  title: string
  description: string
  timestamp: string
  details: Record<string, string>
}

export function EnhancedNotificationCard({ type, title, description, timestamp, details }: NotificationProps) {
  let icon
  let colorClass

  switch (type) {
    case "alert":
      icon = <ShieldAlert className="h-6 w-6 text-red-500" />
      colorClass = "border-red-500"
      break
    case "ban":
      icon = <UserX className="h-6 w-6 text-orange-500" />
      colorClass = "border-orange-500"
      break
    case "warning":
      icon = <BellRing className="h-6 w-6 text-yellow-500" />
      colorClass = "border-yellow-500"
      break
    default:
      icon = <BellRing className="h-6 w-6 text-gray-500" />
      colorClass = "border-gray-500"
  }

  return (
    <Card className={`w-full max-w-md mx-auto my-4 ${colorClass} border-l-4`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon} {title}
        </CardTitle>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold mb-2">{description}</p>
        {Object.entries(details).map(([key, value]) => (
          <p key={key} className="text-sm text-gray-600">
            <span className="font-medium">{key}:</span> {value}
          </p>
        ))}
      </CardContent>
    </Card>
  )
}

// مثال على الاستخدام (للتوضيح فقط، ليس جزءًا من منطق البوت)
/*
export function NotificationList() {
  const notifications: NotificationProps[] = [
    {
      type: "alert",
      title: "تنبيه اختراق السرعة",
      description: "تم الكشف عن لاعب يستخدم اختراق السرعة.",
      timestamp: "منذ 5 دقائق",
      details: {
        "اللاعب": "PlayerX",
        "السرعة المكتشفة": "200%",
        "المنطقة": "Spawn Area"
      }
    },
    {
      type: "ban",
      title: "حظر لاعب",
      description: "تم حظر اللاعب PlayerY بسبب الغش المتكرر.",
      timestamp: "منذ ساعة",
      details: {
        "اللاعب": "PlayerY",
        "السبب": "غش متكرر",
        "المشرف": "AdminZ"
      }
    }
  ]

  return (
    <div className="flex flex-col items-center">
      {notifications.map((notif, index) => (
        <EnhancedNotificationCard key={index} {...notif} />
      ))}
    </div>
  )
}
*/
