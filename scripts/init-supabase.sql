-- scripts/init-supabase.sql
-- هذا السكريبت يقوم بإنشاء الجداول اللازمة لبوت الديسكورد في Supabase.

-- جدول لإعدادات السيرفرات (مثل قناة التنبيهات)
CREATE TABLE IF NOT EXISTS public.server_settings (
    guild_id TEXT PRIMARY KEY,
    alerts_channel_id TEXT,
    webhook_url TEXT, -- إذا كنت تخطط لاستخدام Webhooks لروبلوكس
    setup_by_discord_id TEXT,
    setup_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول للاعبين المحظورين
CREATE TABLE IF NOT EXISTS public.banned_players (
    username TEXT PRIMARY KEY,
    reason TEXT,
    banned_by_discord_id TEXT,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول لسجلات Replay (مثال، يمكنك توسيعه حسب الحاجة)
CREATE TABLE IF NOT EXISTS public.replay_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_username TEXT NOT NULL,
    player_id TEXT,
    log_type TEXT NOT NULL, -- e.g., 'movement', 'chat', 'voice', 'full'
    log_data JSONB, -- تخزين بيانات السجل كـ JSON
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guild_id TEXT REFERENCES public.server_settings(guild_id) ON DELETE CASCADE
);

-- إضافة مؤشرات لتحسين أداء الاستعلامات
CREATE INDEX IF NOT EXISTS idx_banned_players_username ON public.banned_players (username);
CREATE INDEX IF NOT EXISTS idx_replay_logs_player_username ON public.replay_logs (player_username);
CREATE INDEX IF NOT EXISTS idx_replay_logs_guild_id ON public.replay_logs (guild_id);

-- تعيين سياسات الأمان (RLS) إذا كنت تستخدم Supabase في تطبيق العميل
-- تأكد من فهمك لـ RLS قبل تفعيله في بيئة الإنتاج
ALTER TABLE public.server_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replay_logs ENABLE ROW LEVEL SECURITY;

-- مثال على سياسات RLS (يمكنك تعديلها حسب احتياجاتك الأمنية)
-- CREATE POLICY "Allow read access for authenticated users" ON public.server_settings FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow insert for authenticated users" ON public.server_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow update for authenticated users" ON public.server_settings FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow delete for authenticated users" ON public.server_settings FOR DELETE USING (auth.role() = 'authenticated');
