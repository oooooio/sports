"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TrainingTemplates } from "@/components/training-templates"

export default function TrainingTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/training">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Training Templates</h1>
        </div>
      </div>

      <div>
        <p className="text-muted-foreground">
          Create and manage reusable training templates to quickly set up new training sessions.
        </p>
      </div>

      <TrainingTemplates />
    </div>
  )
}
