"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Test user data - using real email domains
const testUsers = [
  {
    email: "admin@gmail.com", // Using real email domain
    password: "Password123!", // Stronger password
    fullName: "Administrator",
    role: "admin",
    username: "admin",
  },
  {
    email: "coach@gmail.com",
    password: "Password123!",
    fullName: "Coach",
    role: "coach",
    username: "coach",
  },
  {
    email: "medical@gmail.com",
    password: "Password123!",
    fullName: "Medical Staff",
    role: "medical",
    username: "medical",
  },
  {
    email: "player@gmail.com",
    password: "Password123!",
    fullName: "Player",
    role: "player",
    username: "player",
  },
  {
    email: "parent@gmail.com",
    password: "Password123!",
    fullName: "Parent",
    role: "parent",
    username: "parent",
  },
]

export async function createTestUser(email: string) {
  try {
    console.log(`Starting to create user: ${email}`)

    // Find user data
    const userData = testUsers.find((user) => user.email === email)
    if (!userData) {
      return {
        success: false,
        message: `User data not found: ${email}`,
      }
    }

    // Create Supabase client - using service role key for full permissions
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("Supabase client created")

    // Check if user exists using Supabase Admin API
    try {
      // Try to find user by email
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        filter: {
          email: userData.email,
        },
      })

      if (listError) {
        console.error("Error listing users:", listError)
      } else if (userList && userList.users.length > 0) {
        const existingUser = userList.users[0]
        console.log(`User ${email} already exists and will be deleted, ID:`, existingUser.id)

        // Delete existing user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id)
        if (deleteError) {
          console.error("Error deleting existing user:", deleteError)
        } else {
          console.log(`User ${email} has been successfully deleted`)
        }
      } else {
        console.log(`User ${email} does not exist, will create new user`)
      }
    } catch (checkError) {
      console.error("Error checking if user exists:", checkError)
      // Continue creating user even if check fails
    }

    // Create user using admin API
    console.log("Attempting to create user:", userData.email)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: userData.fullName,
        role: userData.role,
      },
    })

    if (authError) {
      console.error("Error creating user:", authError)
      return {
        success: false,
        message: `Authentication error: ${authError.message}`,
        details: JSON.stringify(authError),
      }
    }

    if (!authData.user) {
      console.error("User creation successful but no user data returned")
      return {
        success: false,
        message: "User creation successful but no user data returned",
      }
    }

    console.log("User creation successful, ID:", authData.user.id)

    // Ensure users table exists
    const { error: tableError } = await supabase.from("users").select("id").limit(1)

    if (tableError) {
      console.error("Error checking users table:", tableError)
      if (tableError.message.includes("relation") && tableError.message.includes("does not exist")) {
        console.log("users table does not exist, will create table")

        // Create users table
        const { error: createTableError } = await supabase.rpc("create_users_table", {})

        if (createTableError) {
          console.error("Error creating users table:", createTableError)

          // If RPC doesn't exist, try creating table directly
          if (createTableError.message.includes("function") && createTableError.message.includes("does not exist")) {
            try {
              const { error: sqlError } = await supabase.sql(`
                CREATE TABLE IF NOT EXISTS public.users (
                  id UUID PRIMARY KEY REFERENCES auth.users(id),
                  username TEXT,
                  email TEXT,
                  full_name TEXT,
                  avatar_url TEXT,
                  role TEXT,
                  is_active BOOLEAN DEFAULT true,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
                );
              `)

              if (sqlError) {
                console.error("Error creating table directly:", sqlError)
                return {
                  success: true,
                  message: `User created successfully, but could not create users table: ${sqlError.message}`,
                  userId: authData.user.id,
                }
              } else {
                console.log("users table created successfully")
              }
            } catch (sqlError) {
              console.error("Error executing SQL to create table:", sqlError)
              return {
                success: true,
                message: `User created successfully, but could not create users table: ${sqlError instanceof Error ? sqlError.message : "Unknown error"}`,
                userId: authData.user.id,
              }
            }
          } else {
            return {
              success: true,
              message: `User created successfully, but could not create users table: ${createTableError.message}`,
              userId: authData.user.id,
            }
          }
        } else {
          console.log("users table created successfully")
        }
      } else {
        return {
          success: true,
          message: `User created successfully, but error accessing users table: ${tableError.message}`,
          userId: authData.user.id,
        }
      }
    }

    // Create record in users table
    console.log("Attempting to create record in users table")
    const { error: dbError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: userData.email,
      username: userData.username,
      full_name: userData.fullName,
      role: userData.role,
    })

    if (dbError) {
      console.error("Error creating record in users table:", dbError)
      return {
        success: true,
        message: `User created successfully, but error creating record in users table: ${dbError.message}`,
        userId: authData.user.id,
      }
    }

    console.log(`User ${email} creation complete`)
    return {
      success: true,
      message: `Successfully created user: ${email}`,
      userId: authData.user.id,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      error: JSON.stringify(error),
    }
  }
}

export async function createAllTestUsers() {
  const results = []

  for (const user of testUsers) {
    const result = await createTestUser(user.email)
    results.push({
      user: user.email,
      ...result,
    })
  }

  revalidatePath("/seed-users")
  return results
}

// Check Supabase connection
export async function checkSupabaseConnection() {
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return {
        success: false,
        message: `Supabase connection error: ${error.message}`,
      }
    }

    return {
      success: true,
      message: "Supabase connection successful",
      data: {
        url: process.env.SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Create database tables
export async function createDatabaseTables() {
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create users table
    const { error: usersError } = await supabase.sql(`
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        username TEXT,
        email TEXT,
        full_name TEXT,
        avatar_url TEXT,
        role TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `)

    if (usersError) {
      return {
        success: false,
        message: `Error creating users table: ${usersError.message}`,
      }
    }

    return {
      success: true,
      message: "Database tables created successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
