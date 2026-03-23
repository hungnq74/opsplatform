import { createClient } from '@/utils/supabase/server'
import { Building2, FileText, Users, BarChart3, ClipboardList } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: orgCount } = await supabase.from('organizations').select('*', { count: 'exact', head: true })
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: submissionCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true })

  return (
    <div className="flex flex-col gap-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Tổng số Đơn vị"
          value={orgCount || 0}
          accent="#2563eb"
          bgAccent="#eff6ff"
        />
        <StatCard
          icon={Users}
          label="Tài khoản User"
          value={userCount || 0}
          accent="#059669"
          bgAccent="#ecfdf5"
        />
        <StatCard
          icon={FileText}
          label="Lượt nộp Báo cáo"
          value={submissionCount || 0}
          accent="#d97706"
          bgAccent="#fffbeb"
        />
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <Panel icon={ClipboardList} title="Hoạt động gần đây">
          <EmptyState
            icon={ClipboardList}
            title="Chưa có dữ liệu thống kê"
            description="Hoạt động nộp báo cáo sẽ hiện ở đây"
          />
        </Panel>

        <Panel icon={BarChart3} title="Tiến độ nộp Báo cáo">
          <EmptyState
            icon={BarChart3}
            title="Chưa có mẫu biểu đang kích hoạt"
            description="Tạo biểu mẫu và phát hành để theo dõi"
          />
        </Panel>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent, bgAccent }: {
  icon: React.ElementType
  label: string
  value: number
  accent: string
  bgAccent: string
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-white px-5 pt-5 pb-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-px"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#94a3b8]">{label}</p>
          <p className="mt-2 text-[36px] font-bold text-[#0f172a] leading-none tracking-tight">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: bgAccent }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </div>
  )
}

function Panel({ icon: Icon, title, children }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04]">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#f1f5f9]">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f1f5f9]">
          <Icon className="h-3.5 w-3.5 text-[#64748b]" />
        </div>
        <span className="text-[13px] font-semibold text-[#0f172a]">{title}</span>
      </div>
      <div className="px-5 py-8">
        {children}
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description }: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8fafc] ring-1 ring-black/[0.04]">
        <Icon className="h-4.5 w-4.5 text-[#94a3b8]" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#475569]">{title}</p>
        <p className="text-[12px] text-[#94a3b8] mt-0.5">{description}</p>
      </div>
    </div>
  )
}
