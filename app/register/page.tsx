"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Loader2, ArrowLeft, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("player")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // Check if a test domain is used
      if (email.endsWith("@example.com")) {
        setError("Please use a real email address. Test domains like example.com are not accepted.")
        setIsLoading(false)
        return
      }

      // 1. Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // 2. Create corresponding record in users table
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: email,
          username: email.split("@")[0],
          full_name: fullName,
          role: role,
        })

        if (userError) {
          setError(`Failed to create user record: ${userError.message}`)
          return
        }

        setSuccess("Registration successful! Please check your email to confirm your account.")
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="container flex max-w-screen-xl flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Return to Home</span>
            </Link>
            <Trophy className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold">Sports Team Management System</h1>
            <p className="text-muted-foreground">Create a new account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create your account to access the system</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <Info className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    When testing the system, please use a real email format (e.g., yourname@gmail.com). Alternatively, you can use the{" "}
                    <Link href="/seed-users" className="underline font-medium">
                      Test User Generation Page
                    </Link>{" "}
                    to create preset accounts.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="medical">Medical Staff</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
