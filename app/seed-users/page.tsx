"use client"

import { useState, useEffect } from "react"
import { createTestUser, createAllTestUsers, checkSupabaseConnection, createDatabaseTables } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, ArrowLeft, AlertCircle, CheckCircle2, Info, Database } from "lucide-react"
import Link from "next/link"

export default function SeedUsersPage() {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean
    success: boolean
    message: string
    data?: any
  }>({
    checked: false,
    success: false,
    message: "",
  })
  const [tablesCreated, setTablesCreated] = useState<{
    checked: boolean
    success: boolean
    message: string
  }>({
    checked: false,
    success: false,
    message: "",
  })

  useEffect(() => {
    // Check Supabase connection
    const checkConnection = async () => {
      try {
        const result = await checkSupabaseConnection()
        setConnectionStatus({
          checked: true,
          success: result.success,
          message: result.message,
          data: result.data,
        })
      } catch (err) {
        setConnectionStatus({
          checked: true,
          success: false,
          message: err instanceof Error ? err.message : "Error checking connection",
        })
      }
    }

    checkConnection()
  }, [])

  const handleCreateTables = async () => {
    setIsLoading(true)
    try {
      const result = await createDatabaseTables()
      setTablesCreated({
        checked: true,
        success: result.success,
        message: result.message,
      })
    } catch (err) {
      setTablesCreated({
        checked: true,
        success: false,
        message: err instanceof Error ? err.message : "Error creating tables",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (email: string) => {
    setIsLoading(true)
    setError("")
    try {
      const result = await createTestUser(email)
      setResults((prev) => [...prev, { user: email, ...result }])
    } catch (err) {
      console.error(err)
      setError("Error creating user")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAllUsers = async () => {
    setIsLoading(true)
    setError("")
    try {
      const results = await createAllTestUsers()
      setResults(results)
    } catch (err) {
      console.error(err)
      setError("Error creating all users")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="container flex max-w-screen-xl flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Return to Home</span>
            </Link>
            <h1 className="text-3xl font-bold">Create Test Users</h1>
            <p className="text-muted-foreground">Create preset test user accounts for the system</p>
          </div>

          {connectionStatus.checked && (
            <Alert variant={connectionStatus.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {connectionStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>Supabase Connection Status</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {connectionStatus.message}
                {connectionStatus.data && (
                  <div className="mt-2 text-xs">
                    <div>URL: {connectionStatus.data.url ? "Configured" : "Not Configured"}</div>
                    <div>Service Key: {connectionStatus.data.hasServiceKey ? "Configured" : "Not Configured"}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>Make sure the database tables are properly set up before creating users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateTables} disabled={isLoading || !connectionStatus.success} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" /> Create Necessary Database Tables
                  </>
                )}
              </Button>

              {tablesCreated.checked && (
                <Alert variant={tablesCreated.success ? "default" : "destructive"} className="mt-4">
                  <AlertDescription>{tablesCreated.message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              <p className="mt-2">
                1. We use <strong>gmail.com</strong> domain because Supabase might reject certain test domains.
              </p>
              <p className="mt-1">
                2. Password format: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Password123!</code>
              </p>
              <p className="mt-1">3. Please click the "Create Necessary Database Tables" button first, then create users.</p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Test Users</CardTitle>
              <CardDescription>These users will be created in Supabase and can be used to test different roles and permissions in the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleCreateUser("admin@gmail.com")}
                  disabled={isLoading || !connectionStatus.success}
                >
                  Create Administrator
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateUser("coach@gmail.com")}
                  disabled={isLoading || !connectionStatus.success}
                >
                  Create Coach
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateUser("medical@gmail.com")}
                  disabled={isLoading || !connectionStatus.success}
                >
                  Create Medical Staff
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateUser("player@gmail.com")}
                  disabled={isLoading || !connectionStatus.success}
                >
                  Create Player
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCreateUser("parent@gmail.com")}
                  disabled={isLoading || !connectionStatus.success}
                >
                  Create Parent
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handleCreateAllUsers}
                className="w-full"
                disabled={isLoading || !connectionStatus.success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create All Test Users"
                )}
              </Button>

              {results.length > 0 && (
                <div className="w-full mt-4 border rounded-md overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-medium">Creation Results</div>
                  <div className="divide-y">
                    {results.map((result, index) => (
                      <div key={index} className="px-4 py-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{result.user}:</span>
                          <span className={result.success ? "text-green-600" : "text-red-600"}>
                            {result.success ? "Success" : "Failed"}
                          </span>
                        </div>
                        {result.message && (
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{result.message}</div>
                        )}
                        {result.details && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 overflow-hidden text-ellipsis">
                            {result.details}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center text-sm mt-4">
                <Link href="/login" className="text-primary hover:underline">
                  Return to Login Page
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
