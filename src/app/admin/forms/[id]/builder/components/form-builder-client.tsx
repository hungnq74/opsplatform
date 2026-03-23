'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowDown, ArrowUp, Plus, Trash2, Save, GripVertical } from 'lucide-react'
import { saveFormFields } from '../actions'
import { useRouter } from 'next/navigation'

export function FormBuilderClient({ form, initialFields }: { form: any, initialFields: any[] }) {
  const [fields, setFields] = useState<any[]>(initialFields)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addField = () => {
    setFields([...fields, {
      id: `temp_${Date.now()}`,
      label: 'Trường nhập liệu mới',
      field_type: 'text',
      is_required: false,
      display_order: fields.length
    }])
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields]
    newFields[index][key] = value
    setFields(newFields)
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === fields.length - 1) return

    const newFields = [...fields]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    const temp = newFields[index]
    newFields[index] = newFields[targetIndex]
    newFields[targetIndex] = temp

    newFields.forEach((f, i) => f.display_order = i)
    setFields(newFields)
  }

  const handleSave = async () => {
    setLoading(true)
    const payload = fields.map((f, i) => ({
      ...f,
      id: f.id.toString().startsWith('temp_') ? undefined : f.id,
      display_order: i
    }))

    try {
      await saveFormFields(form.id, payload)
      alert("Đã lưu cấu hình biểu mẫu thành công!")
      router.refresh()
    } catch (e) {
      alert("Đã có lỗi xảy ra khi lưu form")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] items-start">
      <div className="md:col-span-2 space-y-[14px]">
        {fields.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-[#dde3ea] rounded-[10px] bg-[#ffffff] flex flex-col items-center">
            <div className="w-[40px] h-[40px] opacity-25 mb-4 text-[24px]">📝</div>
            <h3 className="text-[13px] font-medium text-[#5a7085] mb-1">Chưa có trường nhập liệu</h3>
            <p className="text-[12px] text-[#a0b0be] mb-6">Biểu mẫu này đang trống. Hãy thêm các thuộc tính để thu thập dữ liệu.</p>
            <Button onClick={addField}>
              Thêm trường đầu tiên
            </Button>
          </div>
        ) : (
          fields.map((field, index) => (
            <Card key={field.id} className="relative group transition-colors duration-150">
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-[#ffffff] p-1 rounded-[6px] border border-[#dde3ea]">
                <Button variant="ghost" size="icon-sm" onClick={() => moveField(index, 'up')} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <div className="w-[1px] h-4 bg-[#dde3ea] my-auto mx-1" />
                <Button variant="ghost" size="icon-sm" className="text-[#c0392b] hover:bg-[#fdedec]" onClick={() => removeField(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-12 items-start">
                  <div className="sm:col-span-1 hidden sm:flex pt-8 justify-center">
                    <GripVertical className="text-[#a0b0be] h-6 w-6" />
                  </div>
                  <div className="sm:col-span-11 grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col gap-[6px]">
                      <Label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7f8fa0]">Tiêu đề (Label)</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(index, 'label', e.target.value)}
                        placeholder="VD: Họ và tên, Doanh thu,..."
                      />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <Label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7f8fa0]">Loại dữ liệu</Label>
                      <Select value={field.field_type} onValueChange={(val) => updateField(index, 'field_type', val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Văn bản ngắn (Text)</SelectItem>
                          <SelectItem value="textarea">Văn bản dài (Textarea)</SelectItem>
                          <SelectItem value="number">Số (Number)</SelectItem>
                          <SelectItem value="date">Ngày tháng (Date)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-6 sm:pl-[8.33%]">
                  <Switch
                    id={`required-${field.id}`}
                    checked={field.is_required}
                    onCheckedChange={(checked) => updateField(index, 'is_required', checked)}
                  />
                  <Label htmlFor={`required-${field.id}`} className="text-[12px] font-medium text-[#5a7085] cursor-pointer select-none">Bắt buộc nhập</Label>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {fields.length > 0 && (
          <Button onClick={addField} variant="outline" className="w-full border-dashed border-2 py-8 group transition-colors duration-150">
            <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-[13px]">Thêm trường mới</span>
          </Button>
        )}
      </div>

      <div className="sticky top-[79px]">
        <Card>
          <CardHeader>
            <CardTitle>Thao tác</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={handleSave} disabled={loading} className="w-full">
              <Save className="mr-2 h-4 w-4" /> {loading ? 'Đang lưu...' : 'Lưu cấu hình Form'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/admin/forms')}>
              Đóng và Trở về
            </Button>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-[11px] text-[#5a7085]">
            <div className="flex justify-between w-full py-1 border-b border-[#f0f3f6]">
              <span>Trạng thái</span>
              <span className="font-medium text-[#1c2b3a]">{form.status === 'published' ? 'Đã phát hành' : 'Bản nháp'}</span>
            </div>
            <div className="flex justify-between w-full py-1">
              <span>Số lượng trường</span>
              <span className="font-medium text-[#1c2b3a]">{fields.length}</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
