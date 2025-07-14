// هذا الملف قد يكون جزءًا من واجهة ويب أو مكونات React.
// وظيفة نظام Replay يتم التعامل معها حاليًا في replag-commands.js.
// هذا الملف لا يؤثر مباشرة على تشغيل البوت الحالي.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, MessageSquare, Mic, Footprints, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReplayData {
  username: string
  timestamp: string
  movementLog: { time: number; position: string; action: string }[]
  chatLog: { time: number; message: string }[]
  voiceLog: { time: number; activity: string }[]
  violations: string[]
}

interface ReplaySystemProps {
  data: ReplayData
}

export function ReplaySystem({ data }: ReplaySystemProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Play className="h-6 w-6" /> سجل Replay للاعب: {data.username}
        </CardTitle>
        <p className="text-sm text-gray-500">وقت التسجيل: {new Date(data.timestamp).toLocaleString()}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-4">
          <Button>
            <Play className="h-4 w-4 mr-2" /> تشغيل
          </Button>
          <Button variant="outline">
            <Pause className="h-4 w-4 mr-2" /> إيقاف مؤقت
          </Button>
          <Button variant="destructive">
            <RotateCcw className="h-4 w-4 mr-2" /> إعادة تعيين
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Footprints className="h-5 w-5" /> سجل الحركة
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 max-h-40 overflow-y-auto bg-gray-100 p-3 rounded-md">
            {data.movementLog.length > 0 ? (
              data.movementLog.map((log, index) => (
                <li key={index}>
                  [{log.time}s] {log.action} @ {log.position}
                </li>
              ))
            ) : (
              <li>لا توجد بيانات حركة.</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5" /> سجل الشات
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 max-h-40 overflow-y-auto bg-gray-100 p-3 rounded-md">
            {data.chatLog.length > 0 ? (
              data.chatLog.map((log, index) => (
                <li key={index}>
                  [{log.time}s] {log.message}
                </li>
              ))
            ) : (
              <li>لا توجد بيانات شات.</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Mic className="h-5 w-5" /> سجل الصوت
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 max-h-40 overflow-y-auto bg-gray-100 p-3 rounded-md">
            {data.voiceLog.length > 0 ? (
              data.voiceLog.map((log, index) => (
                <li key={index}>
                  [{log.time}s] {log.activity}
                </li>
              ))
            ) : (
              <li>لا توجد بيانات صوت.</li>
            )}
          </ul>
        </div>

        {data.violations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-red-500" /> المخالفات المكتشفة
            </h3>
            <ul className="list-disc list-inside text-sm text-red-700 bg-red-50 p-3 rounded-md">
              {data.violations.map((violation, index) => (
                <li key={index}>{violation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// مثال على البيانات (للتوضيح فقط)
/*
const mockReplayData: ReplayData = {
  username: "TestPlayer",
  timestamp: new Date().toISOString(),
  movementLog: [
    { time: 0.5, position: "(10, 5, 10)", action: "تحرك للأمام" },
    { time: 1.0, position: "(12, 5, 11)", action: "ركض" },
    { time: 1.5, position: "(15, 6, 13)", action: "قفز" },
  ],
  chatLog: [
    { time: 10, message: "مرحباً!" },
    { time: 25, message: "هل من أحد هنا؟" },
  ],
  voiceLog: [
    { time: 5, activity: "تحدث" },
    { time: 15, activity: "صمت" },
  ],
  violations: ["سرعة زائدة", "محاولة تليبورت"],
}

export function DemoReplaySystem() {
  return <ReplaySystem data={mockReplayData} />
}
*/
