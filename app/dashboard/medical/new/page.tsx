"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DatePicker } from "@/components/date-picker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for members
const mockMembers = [
  { id: "1", name: "张三" },
  { id: "2", name: "李四" },
  { id: "3", name: "王五" },
  { id: "4", name: "赵六" },
  { id: "5", name: "钱七" },
]

// Form schema
const formSchema = z.object({
  memberId: z.string({
    required_error: "请选择队员",
  }),
  injuryType: z.string().min(2, {
    message: "伤病类型至少需要2个字符",
  }),
  date: z.date({
    required_error: "请选择日期",
  }),
  severity: z.string({
    required_error: "请选择严重程度",
  }),
  location: z.string().min(2, {
    message: "受伤部位至少需要2个字符",
  }),
  symptoms: z.string().min(5, {
    message: "症状描述至少需要5个字符",
  }),
  diagnosis: z.string().min(5, {
    message: "诊断结果至少需要5个字符",
  }),
  treatment: z.string().min(5, {
    message: "治疗方案至少需要5个字符",
  }),
  estimatedRecovery: z.string({
    required_error: "请选择预计恢复时间",
  }),
  notes: z.string().optional(),
})

export default function NewMedicalRecord() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  })

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)
      toast({
        title: "医疗记录已创建",
        description: `已为 ${mockMembers.find((m) => m.id === values.memberId)?.name} 创建了新的医疗记录`,
      })
      router.push("/dashboard/medical")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/medical">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">新建医疗记录</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>医疗记录信息</CardTitle>
          <CardDescription>创建新的队员医疗记录，包括伤病信息、诊断和治疗方案</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>队员</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择队员" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>日期</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="injuryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>伤病类型</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：踝关节扭伤" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>受伤部位</FormLabel>
                      <FormControl>
                        <Input placeholder="例如：右踝" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>严重程度</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择严重程度" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mild">轻度</SelectItem>
                          <SelectItem value="moderate">中度</SelectItem>
                          <SelectItem value="severe">重度</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedRecovery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>预计恢复时间</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择预计恢复时间" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-week">1周内</SelectItem>
                          <SelectItem value="2-3-weeks">2-3周</SelectItem>
                          <SelectItem value="1-month">1个月</SelectItem>
                          <SelectItem value="2-3-months">2-3个月</SelectItem>
                          <SelectItem value="3-6-months">3-6个月</SelectItem>
                          <SelectItem value="6-plus-months">6个月以上</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>症状描述</FormLabel>
                    <FormControl>
                      <Textarea placeholder="详细描述伤病症状..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>诊断结果</FormLabel>
                    <FormControl>
                      <Textarea placeholder="详细描述诊断结果..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>治疗方案</FormLabel>
                    <FormControl>
                      <Textarea placeholder="详细描述治疗方案..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>其他备注</FormLabel>
                    <FormControl>
                      <Textarea placeholder="其他需要记录的信息..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormDescription>可选，记录任何其他相关信息</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex justify-between px-0">
                <Button variant="outline" type="button" onClick={() => router.push("/dashboard/medical")}>
                  取消
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "创建医疗记录"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
