'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveFormFields(formId: string, fields: any[]) {
  const supabase = await createClient()
  
  // Note: For a robust app, you would upsert or soft-delete to preserve history, 
  // but for drafting a layout, a full replace handles removals elegantly.
  await supabase.from('form_fields').delete().eq('form_id', formId)
  
  if (fields.length > 0) {
    const payload = fields.map(f => {
      // Prepare strictly matching properties omitting extraneous UI state ghosts
      return {
        id: f.id,
        form_id: formId,
        label: f.label,
        field_type: f.field_type,
        is_required: f.is_required,
        display_order: f.display_order
      }
    })
    const { error } = await supabase.from('form_fields').insert(payload)
    if (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }
  
  revalidatePath(`/admin/forms/${formId}/builder`)
  return { success: true }
}
