import { createClient } from '@/utils/supabase/server'
import { Building2, FileText, Users, ArrowUpRight, BarChart3, ClipboardList } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: orgCount } = await supabase.from('organizations').select('*', { count: 'exact', head: true })
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: submissionCount } = await supabase.from('submissions').select('*', { count: 'exact', head: true })

  return (
    <div className="flex flex-col gap-6">
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
        <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f5f9]">
                <ClipboardList className="h-3.5 w-3.5 text-[#64748b]" />
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">Hoạt động gần đây</span>
            </div>
          </div>
          <div className="px-5 py-10">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f5f9]">
                <ClipboardList className="h-5 w-5 text-[#94a3b8]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#475569]">Chưa có dữ liệu thống kê</p>
                <p className="text-[13px] text-[#94a3b8] mt-1">Hoạt động nộp báo cáo sẽ hiện ở đây</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f1f5f9]">
                <BarChart3 className="h-3.5 w-3.5 text-[#64748b]" />
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">Tiến độ nộp Báo cáo</span>
            </div>
          </div>
          <div className="px-5 py-10">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f5f9]">
                <BarChart3 className="h-5 w-5 text-[#94a3b8]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#475569]">Chưa có mẫu biểu đang kích hoạt</p>
                <p className="text-[13px] text-[#94a3b8] mt-1">Tạo biểu mẫu và phát hành để theo dõi</p>
              </div>
            </div>
          </div>
        </div>
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
    <div className="group relative overflow-hidden rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-[#64748b]">{label}</p>
          <p className="text-3xl font-bold text-[#0f172a] mt-2 tracking-tight">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: bgAccent }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
      {/* Accent bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ backgroundColor: accent }}
      />
    </div>
  )
}
