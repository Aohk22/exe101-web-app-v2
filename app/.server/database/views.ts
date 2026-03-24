/*
This file contains views schema for the frontend.
For actual entity types see schema.ts.
*/

import type { LucideIcon } from 'lucide-react'
import { z } from 'zod'

export const navItemSchema = z.object({
	label: z.string(),
	href: z.string(),
	icon: z.custom<LucideIcon>(),
})

export type NavItem = z.infer<typeof navItemSchema>
