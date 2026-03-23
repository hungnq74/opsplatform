'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { submitFormData } from '../actions'
import { Send, CheckCircle2 } from 'lucide-react'

export function DynamicForm({ formId, formVersion, fields }: { formId: string, formVersion: number, fields: any[] }) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState("")
  const router = useRouter()

  const validate = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true
    fields.forEach(f => {
      if (f.is_required && !formData[f.id]) {
        newErrors[f.id] = "Trường này là bắt buộc"
        isValid = false
      }
      if (f.field_type === 'number' && formData[f.id] && isNaN(Number(formData[f.id]))) {
        newErrors[f.id] = "Giá trị bắt buộc phải là số"
        isValid = false
      }
    })
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError("")
    if (!validate()) return

    setLoading(true)
    const res = await submitFormData(formId, formVersion, formData)
    setLoading(false)

    if (res?.error) {
      setServerError(res.error)
    } else if (res?.success) {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-[#eafaf1] rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-[#27ae60]" />
        </div>
        <h2 className="text-[19px] font-bold text-[#1c2b3a] mb-3">Gửi Báo cáo Thành công!</h2>
        <p className="text-[12px] text-[#5a7085] mb-8 max-w-sm">Dữ liệu của đơn vị bạn đã được ghi nhận. Cảm ơn bạn đã cập nhật thông tin đúng hạn.</p>
        <Button onClick={() => router.push('/portal')} variant="outline" className="px-6">
          Quay lại Màn hình chính
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {serverError && (
        <div className="p-4 bg-[#fdedec] border border-[#c0392b]/20 rounded-[6px] text-[#c0392b] font-medium text-[12px]">
          {serverError}
        </div>
      )}

      <div className="space-y-8">
        {fields.length === 0 ? (
          <p className="text-[#a0b0be] py-8 text-center italic text-[12px]">Biểu mẫu này chưa có yêu cầu nhập liệu gì.</p>
        ) : fields.map(field => (
          <div key={field.id} className="flex flex-col gap-[6px]">
            <Label className="text-[13px] text-[#1c2b3a] font-semibold flex gap-1">
              {field.label}
              {field.is_required && <span className="text-[#c0392b]">*</span>}
            </Label>

            {field.field_type === 'textarea' ? (
              <Textarea
                className={`min-h-[120px] ${errors[field.id] ? 'border-[#c0392b]' : ''}`}
                value={formData[field.id] || ''}
                onChange={e => {
                  setFormData({...formData, [field.id]: e.target.value})
                  if (errors[field.id]) setErrors({...errors, [field.id]: ''})
                }}
              />
            ) : field.field_type === 'date' ? (
              <Input
                type="date"
                className={errors[field.id] ? 'border-[#c0392b]' : ''}
                value={formData[field.id] || ''}
                onChange={e => {
                  setFormData({...formData, [field.id]: e.target.value})
                  if (errors[field.id]) setErrors({...errors, [field.id]: ''})
                }}
              />
            ) : (
              <Input
                type={field.field_type === 'number' ? 'number' : 'text'}
                className={errors[field.id] ? 'border-[#c0392b]' : ''}
                value={formData[field.id] || ''}
                onChange={e => {
                  setFormData({...formData, [field.id]: e.target.value})
                  if (errors[field.id]) setErrors({...errors, [field.id]: ''})
                }}
              />
            )}

            {errors[field.id] && (
              <p className="text-[11px] text-[#c0392b] font-medium">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>

      {fields.length > 0 && (
        <div className="pt-6 border-t border-[#dde3ea] mt-8">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto px-8" size="lg">
            <Send className="mr-3 h-5 w-5" />
            {loading ? "Đang truyền tải dữ liệu..." : "Hoàn tất & Gửi Báo cáo"}
          </Button>
        </div>
      )}
    </form>
  )
}
