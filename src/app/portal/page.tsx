import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileEdit, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function PortalDashboard() {
  const supabase = await createClient()

  const { data: forms } = await supabase
    .from('forms')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <h1 className="text-[19px] font-bold text-[#1c2b3a]">Nhiệm vụ Báo cáo</h1>
        <p className="text-[12px] text-[#7f8fa0] mt-[3px]">Danh sách các biểu mẫu cần hoàn thành của Khối/Chi nhánh</p>
      </div>

      <div className="grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
        {(!forms || forms.length === 0) ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-[#dde3ea] rounded-[10px] bg-white flex flex-col items-center gap-[10px]">
            <div className="w-[40px] h-[40px] opacity-25 text-[24px]">📋</div>
            <p className="text-[13px] font-medium text-[#5a7085]">Chưa có biểu mẫu báo cáo nào</p>
            <p className="text-[12px] text-[#a0b0be]">Hiện tại chưa có yêu cầu thực hiện từ Trung tâm.</p>
          </div>
        ) : (
          forms.map(form => (
            <Card key={form.id} className="flex flex-col hover:border-primary/30 transition-colors duration-150">
              <CardHeader className="border-b-0 pb-0">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-[var(--color-navy-light)] rounded-lg">
                    <FileEdit className="h-6 w-6 text-[var(--color-navy)]" />
                  </div>
                  <Badge variant="success">Sẵn sàng</Badge>
                </div>
                <CardTitle className="text-[14px] leading-tight mt-4">{form.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{form.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <Link href={`/portal/forms/${form.id}/submit`} className="w-full" passHref>
                  <Button className="w-full group/btn">
                    Bắt đầu điền <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
