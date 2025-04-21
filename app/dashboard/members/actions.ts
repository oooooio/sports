"use server"

import { createMember, updateMember, deleteMember } from "@/services/members"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const memberSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  position: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  jersey_number: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
  join_date: z.string().optional(),
  status: z.enum(["active", "inactive", "injured", "suspended"]).default("active"),
})

export async function addMember(formData: FormData) {
  try {
    const validatedFields = memberSchema.parse({
      name: formData.get("name"),
      position: formData.get("position"),
      date_of_birth: formData.get("date_of_birth"),
      gender: formData.get("gender"),
      jersey_number: formData.get("jersey_number"),
      height: formData.get("height"),
      weight: formData.get("weight"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      emergency_contact: formData.get("emergency_contact"),
      emergency_phone: formData.get("emergency_phone"),
      join_date: formData.get("join_date"),
      status: formData.get("status") || "active",
    })

    const member = await createMember(validatedFields)

    revalidatePath("/dashboard/members")
    return { success: true, data: member }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }

    return { success: false, error: "Failed to add member" }
  }
}

export async function editMember(id: string, formData: FormData) {
  try {
    const validatedFields = memberSchema.parse({
      name: formData.get("name"),
      position: formData.get("position"),
      date_of_birth: formData.get("date_of_birth"),
      gender: formData.get("gender"),
      jersey_number: formData.get("jersey_number"),
      height: formData.get("height"),
      weight: formData.get("weight"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      emergency_contact: formData.get("emergency_contact"),
      emergency_phone: formData.get("emergency_phone"),
      join_date: formData.get("join_date"),
      status: formData.get("status") || "active",
    })

    const member = await updateMember(id, validatedFields)

    revalidatePath("/dashboard/members")
    revalidatePath(`/dashboard/members/${id}`)
    return { success: true, data: member }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }

    return { success: false, error: "Failed to update member" }
  }
}

export async function removeMember(id: string) {
  try {
    await deleteMember(id)

    revalidatePath("/dashboard/members")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete member" }
  }
}
