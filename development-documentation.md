# **Development Documentation**

## **2.1 Developing the Business Model**

### **Business Logic Code Implementation**
- 业务逻辑代码主要集中在 `services/` 文件夹中，例如 `matches.ts`、`medical-records.ts`、`members.ts` 等文件。
- 每个文件实现了与特定业务相关的功能，例如用户管理、比赛管理、医疗记录管理等。
- 业务逻辑代码通过调用 `lib/supabase.ts` 中的 Supabase API 进行数据库操作。

#### **用户管理模块 (`services/users.ts`)**
用户管理模块处理用户账户相关的所有业务逻辑，包括：

1. **用户认证与授权**
   - 实现了基于 Supabase Auth 的用户认证系统
   - 支持电子邮件/密码登录
   - 提供会话管理和令牌刷新机制

   ```typescript
   // 用户登录实现示例
   export async function login(email: string, password: string): Promise<boolean> {
     const supabase = getSupabaseBrowserClient()
     try {
       const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
       })
       if (error) return false
       return !!data.user
     } catch (error) {
       console.error("登录过程中出错:", error)
       return false
     }
   }
   ```

2. **用户管理操作**
   - 获取用户列表
   - 创建新用户
   - 更新用户信息
   - 更改用户状态（启用/禁用）
   - 重置用户密码
   - 用户角色管理
   
   ```typescript
   // 获取所有用户
   export async function getUsers(): Promise<UserWithAuth[]> {
     const supabase = getSupabaseBrowserClient()
     // 首先获取 auth.users 表中的用户
     const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
     if (authError) {
       console.error("获取认证用户列表失败:", authError)
       throw new Error("获取用户列表失败")
     }
     // 然后获取 public.users 表中的用户详情
     const { data: userDetails, error: userError } = await supabase.from("users").select("*")
     if (userError) {
       console.error("获取用户详情失败:", userError)
       throw new Error("获取用户详情失败")
     }
     // 合并两个数据源
     return authUsers.users.map((authUser) => {
       const userDetail = userDetails.find((u) => u.id === authUser.id) || {}
       return {
         id: authUser.id,
         username: userDetail.username || authUser.email?.split("@")[0] || "",
         name: userDetail.full_name || authUser.user_metadata?.full_name || "未命名用户",
         email: authUser.email || "",
         role: userDetail.role || authUser.user_metadata?.role || "player",
         avatar: userDetail.avatar_url || "",
         isActive: !authUser.banned_until,
         created_at: authUser.created_at,
         last_sign_in_at: authUser.last_sign_in_at,
       }
     })
   }
   ```

3. **权限管理**
   - 基于角色的权限控制系统
   - 定义了不同角色（管理员、教练、医疗人员、队员、家长）的权限
   - 提供权限验证函数
   
   ```typescript
   // 权限映射表示例
   const ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
     admin: {
       MANAGE_MEMBERS: true,
       MANAGE_TRAINING: true,
       MANAGE_MATCHES: true,
       MANAGE_MEDICAL: true,
       MANAGE_USERS: true,
       VIEW_REPORTS: true,
       // ...其他权限
     },
     coach: {
       MANAGE_MEMBERS: true,
       MANAGE_TRAINING: true,
       MANAGE_MATCHES: true,
       VIEW_MEDICAL: true,
       // ...更多权限
     },
     // ...其他角色权限
   }
   
   // 权限验证函数
   const hasPermission = (permission: string): boolean => {
     if (!user) return false
     const rolePermissions = ROLE_PERMISSIONS[user.role] || {}
     return !!rolePermissions[permission]
   }
   ```

#### **队员管理模块 (`services/members.ts`)**
队员管理模块处理体育队伍成员的业务逻辑，包括：

1. **成员数据操作**
   - 获取所有成员列表
   - 按ID获取特定成员
   - 创建新成员
   - 更新成员信息
   - 删除成员记录
   
   ```typescript
   // 定义成员类型
   export type Member = Database["public"]["Tables"]["members"]["Row"]
   export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"]
   export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"]
   
   // 获取所有成员
   export async function getMembers() {
     const supabase = createServerClient()
     const { data, error } = await supabase.from("members").select("*")
     if (error) {
       console.error("Error fetching members:", error)
       throw new Error("Failed to fetch members")
     }
     return data
   }
   
   // 创建新成员
   export async function createMember(member: MemberInsert) {
     const supabase = createServerClient()
     const { data, error } = await supabase.from("members").insert(member).select().single()
     if (error) {
       console.error("Error creating member:", error)
       throw new Error("Failed to create member")
     }
     return data
   }
   ```

2. **成员资料管理**
   - 成员个人信息管理
   - 成员健康状态追踪
   - 成员位置和角色管理
   - 成员统计数据收集
   
3. **成员数据验证**
   - 使用 Zod 进行数据验证
   - 验证成员数据的完整性和有效性
   
   ```typescript
   // 成员数据验证示例 (在 app/dashboard/members/actions.ts)
   const memberSchema = z.object({
     name: z.string().min(1, { message: "姓名不能为空" }),
     position: z.string().optional(),
     date_of_birth: z.string().optional(),
     gender: z.enum(["male", "female", "other"]).optional(),
     jersey_number: z.coerce.number().optional(),
     height: z.coerce.number().optional(),
     weight: z.coerce.number().optional(),
     phone: z.string().optional(),
     email: z.string().email({ message: "请输入有效的电子邮件地址" }).optional(),
     address: z.string().optional(),
     emergency_contact: z.string().optional(),
     emergency_phone: z.string().optional(),
     join_date: z.string().optional(),
     status: z.enum(["active", "inactive", "injured", "suspended"]).default("active"),
   })
   ```

#### **比赛管理模块 (`services/matches.ts`)**
比赛管理模块处理体育比赛相关的业务逻辑，包括：

1. **比赛数据操作**
   - 获取比赛列表（支持筛选和排序）
   - 获取特定比赛详情
   - 创建新比赛记录
   - 更新比赛信息
   - 删除比赛记录
   
   ```typescript
   // 比赛类型定义
   export type Match = Database["public"]["Tables"]["matches"]["Row"]
   export type MatchLineup = Database["public"]["Tables"]["match_lineup"]["Row"]
   export type MatchEvent = Database["public"]["Tables"]["match_events"]["Row"]
   
   export type MatchWithDetails = Match & {
     lineup_count?: number
     events?: MatchEvent[]
     lineup?: MatchLineup[]
   }
   
   // 获取比赛列表
   export async function getMatches(options?: {
     limit?: number
     type?: MatchType
     result?: MatchResult
     homeAway?: HomeAway
     upcoming?: boolean
     past?: boolean
   }): Promise<MatchWithDetails[]> {
     const supabase = createServerClient()
     
     let query = supabase.from("matches").select(`
       *,
       lineup:match_lineup(count)
     `)
     
     // 应用筛选条件
     if (options?.type) {
       query = query.eq("match_type", options.type)
     }
     
     if (options?.result) {
       query = query.eq("result", options.result)
     }
     
     if (options?.homeAway) {
       query = query.eq("home_away", options.homeAway)
     }
     
     if (options?.upcoming) {
       query = query.gt("match_date", new Date().toISOString())
     }
     
     if (options?.past) {
       query = query.lt("match_date", new Date().toISOString())
     }
     
     if (options?.limit) {
       query = query.limit(options.limit)
     }
     
     // 排序
     query = query.order("match_date", { ascending: options?.upcoming ? true : false })
     
     const { data, error } = await query
     
     if (error) {
       console.error("Error fetching matches:", error)
       throw new Error(`Failed to fetch matches: ${error.message}`)
     }
     
     return data.map((match) => ({
       ...match,
       lineup_count: match.lineup?.[0]?.count || 0,
     }))
   }
   ```

2. **比赛阵容管理**
   - 获取比赛阵容信息
   - 更新球员阵容位置
   - 记录首发和替补球员
   - 记录上场时间
   
   ```typescript
   // 获取比赛阵容
   export async function getMatchLineup(matchId: string): Promise<MatchLineup[]> {
     const supabase = createServerClient()
   
     const { data, error } = await supabase
       .from("match_lineup")
       .select(`
         *,
         member:members(id, name, position, jersey_number)
       `)
       .eq("match_id", matchId)
   
     if (error) {
       console.error(`Error fetching lineup for match ID ${matchId}:`, error)
       throw new Error(`Failed to fetch match lineup: ${error.message}`)
     }
   
     return data
   }
   
   // 更新比赛阵容
   export async function updateMatchLineup(
     matchId: string,
     memberId: string,
     lineupData: Partial<MatchLineupInput>
   ): Promise<MatchLineup> {
     const supabase = createServerClient()
   
     // 检查阵容记录是否已存在
     const { data: existingRecord } = await supabase
       .from("match_lineup")
       .select()
       .eq("match_id", matchId)
       .eq("member_id", memberId)
       .maybeSingle()
   
     if (existingRecord) {
       // 更新现有记录
       const { data, error } = await supabase
         .from("match_lineup")
         .update({
           ...lineupData,
           updated_at: new Date().toISOString(),
         })
         .eq("id", existingRecord.id)
         .select()
         .single()
   
       if (error) {
         console.error(`Error updating lineup for match ID ${matchId}, member ID ${memberId}:`, error)
         throw new Error(`Failed to update match lineup: ${error.message}`)
       }
   
       return data
     } else {
       // 创建新记录
       const { data, error } = await supabase
         .from("match_lineup")
         .insert({
           match_id: matchId,
           member_id: memberId,
           ...lineupData,
         })
         .select()
         .single()
   
       if (error) {
         console.error(`Error creating lineup for match ID ${matchId}, member ID ${memberId}:`, error)
         throw new Error(`Failed to create match lineup: ${error.message}`)
       }
   
       return data
     }
   }
   ```

3. **比赛事件管理**
   - 记录比赛中的关键事件（进球、助攻、黄牌、红牌等）
   - 管理比赛统计数据
   - 生成比赛报告
   
   ```typescript
   // 比赛事件类型
   export type EventType =
     | "goal"
     | "assist"
     | "yellow_card"
     | "red_card"
     | "substitution_in"
     | "substitution_out"
     | "injury"
     | "other"
   
   // 获取比赛事件
   export async function getMatchEvents(matchId: string): Promise<MatchEvent[]> {
     const supabase = createServerClient()
   
     const { data, error } = await supabase
       .from("match_events")
       .select(`
         *,
         member:members(id, name, position, jersey_number)
       `)
       .eq("match_id", matchId)
       .order("minute", { ascending: true })
   
     if (error) {
       console.error(`Error fetching events for match ID ${matchId}:`, error)
       throw new Error(`Failed to fetch match events: ${error.message}`)
     }
   
     return data
   }
   
   // 创建比赛事件
   export async function createMatchEvent(eventData: MatchEventInput): Promise<MatchEvent> {
     const supabase = createServerClient()
   
     const { data, error } = await supabase.from("match_events").insert(eventData).select().single()
   
     if (error) {
       console.error("Error creating match event:", error)
       throw new Error(`Failed to create match event: ${error.message}`)
     }
   
     return data
   }
   ```

4. **比赛统计分析**
   - 获取球队整体比赛统计
   - 分析胜率和得失球情况
   - 比赛结果趋势分析
   
   ```typescript
   // 获取比赛统计数据
   export async function getMatchStatistics(): Promise<{
     total: number
     wins: number
     losses: number
     draws: number
     upcoming: number
     winRate: number
     goalsFor: number
     goalsAgainst: number
   }> {
     const supabase = createServerClient()
   
     // 获取所有比赛
     const { data: matches, error } = await supabase.from("matches").select("*")
   
     if (error) {
       console.error("Error fetching match statistics:", error)
       throw new Error(`Failed to fetch match statistics: ${error.message}`)
     }
   
     const total = matches.length
     const wins = matches.filter((m) => m.result === "win").length
     const losses = matches.filter((m) => m.result === "loss").length
     const draws = matches.filter((m) => m.result === "draw").length
     const upcoming = matches.filter((m) => m.result === "pending").length
     
     // 计算胜率
     const playedMatches = wins + losses + draws
     const winRate = playedMatches > 0 ? (wins / playedMatches) * 100 : 0
     
     // 计算进球和失球
     const goalsFor = matches.reduce((sum, m) => sum + (m.score_for || 0), 0)
     const goalsAgainst = matches.reduce((sum, m) => sum + (m.score_against || 0), 0)
   
     return {
       total,
       wins,
       losses,
       draws,
       upcoming,
       winRate,
       goalsFor,
       goalsAgainst,
     }
   }
   ```

#### **训练管理模块 (`services/training.ts`)**
训练管理模块处理队伍训练活动相关的业务逻辑，包括：

1. **训练数据操作**
   - 获取训练课程列表
   - 获取特定训练详情
   - 创建新训练课程
   - 更新训练信息
   - 删除训练记录
   
   ```typescript
   // 训练类型定义
   export type TrainingSession = Database["public"]["Tables"]["training_sessions"]["Row"]
   export type TrainingAttendance = Database["public"]["Tables"]["training_attendance"]["Row"]
   
   export type TrainingSessionWithAttendance = TrainingSession & {
     attendance_count?: number
     total_members?: number
     attendance?: TrainingAttendance[]
   }
   
   // 获取训练列表
   export async function getTrainingSessions(options?: {
     limit?: number
     type?: TrainingType
     status?: TrainingStatus
     startDate?: Date
     endDate?: Date
   }): Promise<TrainingSessionWithAttendance[]> {
     const supabase = createServerClient()
   
     let query = supabase.from("training_sessions").select(`
         *,
         attendance:training_attendance(count)
       `)
   
     if (options?.type) {
       query = query.eq("type", options.type)
     }
   
     if (options?.status) {
       query = query.eq("status", options.status)
     }
   
     if (options?.startDate) {
       query = query.gte("start_time", options.startDate.toISOString())
     }
   
     if (options?.endDate) {
       query = query.lte("end_time", options.endDate.toISOString())
     }
   
     if (options?.limit) {
       query = query.limit(options.limit)
     }
   
     query = query.order("start_time", { ascending: false })
   
     const { data, error } = await query
   
     if (error) {
       console.error("Error fetching training sessions:", error)
       throw new Error(`Failed to fetch training sessions: ${error.message}`)
     }
   
     // 获取成员总数，用于计算出勤率
     const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true })
   
     return data.map((session) => ({
       ...session,
       total_members: totalMembers || 0,
       attendance_count: session.attendance?.[0]?.count || 0,
     }))
   }
   ```

2. **训练出勤管理**
   - 记录队员出勤情况
   - 更新出勤状态（出席、迟到、缺席、请假）
   - 计算整体出勤率
   
   ```typescript
   // 获取训练出勤记录
   export async function getTrainingAttendance(trainingId: string): Promise<TrainingAttendance[]> {
     const supabase = createServerClient()
   
     const { data, error } = await supabase
       .from("training_attendance")
       .select(`
         *,
         member:members(id, name, position, jersey_number)
       `)
       .eq("training_id", trainingId)
   
     if (error) {
       console.error(`Error fetching attendance for training ID ${trainingId}:`, error)
       throw new Error(`Failed to fetch training attendance: ${error.message}`)
     }
   
     return data
   }
   
   // 更新训练出勤状态
   export async function updateTrainingAttendance(
     trainingId: string,
     memberId: string,
     status: "present" | "absent" | "late" | "excused",
     notes?: string
   ): Promise<TrainingAttendance> {
     const supabase = createServerClient()
   
     // 检查出勤记录是否已存在
     const { data: existingRecord } = await supabase
       .from("training_attendance")
       .select()
       .eq("training_id", trainingId)
       .eq("member_id", memberId)
       .maybeSingle()
   
     if (existingRecord) {
       // 更新现有记录
       const { data, error } = await supabase
         .from("training_attendance")
         .update({
           status,
           notes,
           updated_at: new Date().toISOString(),
         })
         .eq("id", existingRecord.id)
         .select()
         .single()
   
       if (error) {
         console.error(`Error updating attendance for training ID ${trainingId}, member ID ${memberId}:`, error)
         throw new Error(`Failed to update training attendance: ${error.message}`)
       }
   
       return data
     } else {
       // 创建新记录
       const { data, error } = await supabase
         .from("training_attendance")
         .insert({
           training_id: trainingId,
           member_id: memberId,
           status,
           notes,
         })
         .select()
         .single()
   
       if (error) {
         console.error(`Error creating attendance for training ID ${trainingId}, member ID ${memberId}:`, error)
         throw new Error(`Failed to create training attendance: ${error.message}`)
       }
   
       return data
     }
   }
   ```

3. **训练统计与分析**
   - 计算训练完成率
   - 分析不同类型训练的分布
   - 产生训练统计报告
   
   ```typescript
   // 获取训练统计数据
   export async function getTrainingStatistics(): Promise<{
     total: number
     completed: number
     scheduled: number
     cancelled: number
     attendanceRate: number
   }> {
     const supabase = createServerClient()
   
     // 获取按状态分类的训练数量
     const { data: trainings, error: trainingsError } = await supabase.from("training_sessions").select("status")
   
     if (trainingsError) {
       console.error("Error fetching training statistics:", trainingsError)
       throw new Error(`Failed to fetch training statistics: ${trainingsError.message}`)
     }
   
     const total = trainings.length
     const completed = trainings.filter((t) => t.status === "completed").length
     const scheduled = trainings.filter((t) => t.status === "scheduled").length
     const cancelled = trainings.filter((t) => t.status === "cancelled").length
   
     // 计算已完成训练的出勤率
     const { data: attendance, error: attendanceError } = await supabase
       .from("training_attendance")
       .select(`
         training_id,
         status
       `)
       .in("status", ["present", "late"])
   
     if (attendanceError) {
       console.error("Error fetching attendance statistics:", attendanceError)
       throw new Error(`Failed to fetch attendance statistics: ${attendanceError.message}`)
     }
   
     // 获取成员总数
     const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true })
   
     // 计算出勤率
     const attendanceRate = completed > 0 && totalMembers ? (attendance.length / (completed * totalMembers)) * 100 : 0
   
     return {
       total,
       completed,
       scheduled,
       cancelled,
       attendanceRate,
     }
   }
   ```

#### **医疗记录管理模块 (`services/medical-records.ts`)**
医疗记录管理模块处理队员健康和伤病相关的业务逻辑，包括：

1. **医疗记录操作**
   - 获取医疗记录列表
   - 获取特定队员的医疗历史
   - 创建新的医疗记录
   - 更新伤病恢复进展
   - 记录治疗方案
   
   ```typescript
   // 医疗记录类型定义
   export type MedicalRecord = Database["public"]["Tables"]["medical_records"]["Row"]
   export type MedicalRecordInsert = Database["public"]["Tables"]["medical_records"]["Insert"]
   export type MedicalRecordUpdate = Database["public"]["Tables"]["medical_records"]["Update"]
   
   // 获取医疗记录
   export async function getMedicalRecords(options?: {
     memberId?: string
     status?: "active" | "recovered" | "pending"
     type?: "injury" | "illness" | "checkup"
     startDate?: Date
     endDate?: Date
   }): Promise<MedicalRecord[]> {
     const supabase = createServerClient()
   
     let query = supabase.from("medical_records").select(`
       *,
       member:members(id, name, position, jersey_number)
     `)
   
     if (options?.memberId) {
       query = query.eq("member_id", options.memberId)
     }
   
     if (options?.status) {
       query = query.eq("status", options.status)
     }
   
     if (options?.type) {
       query = query.eq("type", options.type)
     }
   
     if (options?.startDate) {
       query = query.gte("date", options.startDate.toISOString())
     }
   
     if (options?.endDate) {
       query = query.lte("date", options.endDate.toISOString())
     }
   
     query = query.order("date", { ascending: false })
   
     const { data, error } = await query
   
     if (error) {
       console.error("Error fetching medical records:", error)
       throw new Error(`Failed to fetch medical records: ${error.message}`)
     }
   
     return data
   }
   ```

2. **伤病追踪与预防**
   - 跟踪队员伤病恢复情况
   - 分析伤病模式和预防策略
   - 提供健康建议
   
   ```typescript
   // 创建医疗记录
   export async function createMedicalRecord(record: MedicalRecordInsert): Promise<MedicalRecord> {
     const supabase = createServerClient()
   
     const { data, error } = await supabase.from("medical_records").insert(record).select().single()
   
     if (error) {
       console.error("Error creating medical record:", error)
       throw new Error(`Failed to create medical record: ${error.message}`)
     }
   
     // 如果是伤病记录，更新队员状态为受伤
     if (record.type === "injury" && record.status === "active") {
       await supabase
         .from("members")
         .update({ status: "injured" })
         .eq("id", record.member_id)
     }
   
     return data
   }
   
   // 更新医疗记录
   export async function updateMedicalRecord(
     id: string,
     updates: MedicalRecordUpdate
   ): Promise<MedicalRecord> {
     const supabase = createServerClient()
   
     const { data, error } = await supabase
       .from("medical_records")
       .update(updates)
       .eq("id", id)
       .select()
       .single()
   
     if (error) {
       console.error(`Error updating medical record with ID ${id}:`, error)
       throw new Error(`Failed to update medical record: ${error.message}`)
     }
   
     // 如果伤病状态改为已恢复，更新队员状态为活跃
     if (updates.status === "recovered") {
       await supabase
         .from("members")
         .update({ status: "active" })
         .eq("id", data.member_id)
     }
   
     return data
   }
   ```

3. **医疗统计与分析**
   - 伤病类型统计
   - 平均恢复时间分析
   - 伤病频率和趋势报告
   
   ```typescript
   // 获取医疗统计数据
   export async function getMedicalStatistics(): Promise<{
     total: number
     active: number
     recovered: number
     injuryTypes: Record<string, number>
     averageRecoveryDays: number
   }> {
     const supabase = createServerClient()
   
     // 获取所有医疗记录
     const { data: records, error } = await supabase.from("medical_records").select("*")
   
     if (error) {
       console.error("Error fetching medical statistics:", error)
       throw new Error(`Failed to fetch medical statistics: ${error.message}`)
     }
   
     const total = records.length
     const active = records.filter((r) => r.status === "active").length
     const recovered = records.filter((r) => r.status === "recovered").length
   
     // 统计伤病类型
     const injuryTypes: Record<string, number> = {}
     records.forEach((record) => {
       if (record.injury_type) {
         injuryTypes[record.injury_type] = (injuryTypes[record.injury_type] || 0) + 1
       }
     })
   
     // 计算平均恢复时间（天）
     const recoveredRecords = records.filter(
       (r) => r.status === "recovered" && r.recovery_date && r.date
     )
     
     let totalRecoveryDays = 0
     recoveredRecords.forEach((record) => {
       const startDate = new Date(record.date)
       const endDate = new Date(record.recovery_date!)
       const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
       totalRecoveryDays += days
     })
     
     const averageRecoveryDays = 
       recoveredRecords.length > 0 ? totalRecoveryDays / recoveredRecords.length : 0
   
     return {
       total,
       active,
       recovered,
       injuryTypes,
       averageRecoveryDays,
     }
   }
   ```

### **业务规则定义**
- 业务规则通过 TypeScript 类型定义在 `types/` 文件夹中，例如 `database.ts` 和 `user.ts`。
- 规则包括用户权限、数据结构、字段验证等。
- 例如，`types/user.ts` 定义了用户的类型和相关字段。

#### **基础数据类型定义**

1. **用户类型定义 (`types/user.ts`)**
   ```typescript
   export type UserRole = "admin" | "coach" | "medical" | "player" | "parent"
   
   export interface User {
     id: string
     username: string
     password: string // 注意：实际应用中应该存储哈希值而非明文密码
     name: string
     email: string
     role: UserRole
     avatar?: string
     memberId?: string // 如果是球员，关联到会员ID
     lastLogin?: Date
     isActive: boolean
     createdAt: Date
   }
   
   export interface UserSession {
     id: string
     name: string
     email: string
     role: UserRole
     avatar?: string
     memberId?: string
   }
   ```

2. **数据库类型定义 (`types/database.ts`)**
   数据库类型定义使用 Supabase 的类型生成功能，包含了所有数据表的详细结构，例如：
   
   ```typescript
   export interface Database {
     public: {
       Tables: {
         users: {
           Row: {
             id: string
             username: string
             email: string
             full_name: string
             avatar_url: string
             role: string
             is_active: boolean
             created_at: string
             updated_at: string
           }
           Insert: {
             id: string
             username?: string
             email: string
             full_name?: string
             avatar_url?: string
             role?: string
             is_active?: boolean
             created_at?: string
             updated_at?: string
           }
           Update: {
             id?: string
             username?: string
             email?: string
             full_name?: string
             avatar_url?: string
             role?: string
             is_active?: boolean
             created_at?: string
             updated_at?: string
           }
         }
         members: {
           Row: {
             id: string
             name: string
             position: string | null
             date_of_birth: string | null
             gender: string | null
             jersey_number: number | null
             height: number | null
             weight: number | null
             phone: string | null
             email: string | null
             address: string | null
             emergency_contact: string | null
             emergency_phone: string | null
             join_date: string | null
             status: string
             created_at: string | null
             updated_at: string | null
           }
           // Insert 和 Update 定义
         }
         // 其他表定义：matches, match_lineup, match_events, 
         // training_sessions, training_attendance, medical_records 等
       }
     }
   }
   ```

#### **权限规则定义**

1. **角色权限映射**
   定义了不同角色所拥有的权限，实现了基于角色的访问控制（RBAC）：
   
   ```typescript
   // 在 contexts/auth-context.tsx 中定义
   const ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
     admin: {
       MANAGE_MEMBERS: true,
       MANAGE_TRAINING: true,
       MANAGE_MATCHES: true,
       MANAGE_MEDICAL: true,
       MANAGE_USERS: true,
       VIEW_REPORTS: true,
       MANAGE_SETTINGS: true,
       MANAGE_SKILLS: true,
       VIEW_MEMBERS: true,
       VIEW_TRAINING: true,
       VIEW_MATCHES: true,
       VIEW_MEDICAL: true,
       VIEW_SKILLS: true,
     },
     coach: {
       MANAGE_MEMBERS: true,
       MANAGE_TRAINING: true,
       MANAGE_MATCHES: true,
       VIEW_MEDICAL: true,
       VIEW_REPORTS: true,
       MANAGE_SKILLS: true,
       VIEW_MEMBERS: true,
       VIEW_TRAINING: true,
       VIEW_MATCHES: true,
       VIEW_SKILLS: true,
     },
     medical: {
       VIEW_MEMBERS: true,
       MANAGE_MEDICAL: true,
       VIEW_TRAINING: true,
       VIEW_MATCHES: true,
       VIEW_MEDICAL: true,
     },
     player: {
       VIEW_MEMBERS: true,
       VIEW_TRAINING: true,
       VIEW_MATCHES: true,
       VIEW_OWN_MEDICAL: true,
     },
     parent: {
       VIEW_CHILD_INFO: true,
     },
   }
   ```

2. **业务常量定义**
   定义了系统中使用的各种常量，如比赛类型、训练类型等：
   
   ```typescript
   // 比赛类型
   export type MatchType = "friendly" | "league" | "cup" | "tournament" | "other"
   
   // 比赛结果
   export type MatchResult = "win" | "loss" | "draw" | "pending"
   
   // 主客场状态
   export type HomeAway = "home" | "away" | "neutral"
   
   // 事件类型
   export type EventType =
     | "goal"
     | "assist"
     | "yellow_card"
     | "red_card"
     | "substitution_in"
     | "substitution_out"
     | "injury"
     | "other"
   
   // 训练类型
   export type TrainingType = "regular" | "fitness" | "tactical" | "recovery" | "other"
   
   // 训练状态
   export type TrainingStatus = "scheduled" | "completed" | "cancelled"
   
   // 出勤状态
   export type AttendanceStatus = "present" | "absent" | "late" | "excused"
   
   // 队员状态
   export type MemberStatus = "active" | "inactive" | "injured" | "suspended"
   ```

#### **数据验证规则**

1. **表单验证规则**
   使用 Zod 库定义数据验证规则，确保数据完整性：
   
   ```typescript
   // 会员表单验证
   const memberSchema = z.object({
     name: z.string().min(1, { message: "姓名不能为空" }),
     position: z.string().optional(),
     date_of_birth: z.string().optional(),
     gender: z.enum(["male", "female", "other"]).optional(),
     jersey_number: z.coerce.number().optional(),
     height: z.coerce.number().optional(),
     weight: z.coerce.number().optional(),
     phone: z.string().optional(),
     email: z.string().email({ message: "请输入有效的电子邮件地址" }).optional(),
     address: z.string().optional(),
     emergency_contact: z.string().optional(),
     emergency_phone: z.string().optional(),
     join_date: z.string().optional(),
     status: z.enum(["active", "inactive", "injured", "suspended"]).default("active"),
   })
   
   // 训练表单验证
   const trainingSchema = z.object({
     title: z.string().min(1, { message: "标题不能为空" }),
     description: z.string().optional(),
     start_time: z.string(),
     end_time: z.string(),
     location: z.string().optional(),
     type: z.enum(["regular", "fitness", "tactical", "recovery", "other"]).default("regular"),
     status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
   })
   
   // 比赛表单验证
   const matchSchema = z.object({
     opponent: z.string().min(1, { message: "对手名称不能为空" }),
     match_date: z.string(),
     location: z.string().optional(),
     match_type: z.enum(["friendly", "league", "cup", "tournament", "other"]).default("friendly"),
     home_away: z.enum(["home", "away", "neutral"]).default("home"),
     result: z.enum(["win", "loss", "draw", "pending"]).default("pending"),
     score_for: z.coerce.number().optional().nullable(),
     score_against: z.coerce.number().optional().nullable(),
     notes: z.string().optional(),
   })
   ```

### **业务逻辑测试**
- 测试代码尚未明确列出，但可以通过引入测试框架（如 Jest）对 `services/` 中的逻辑进行单元测试。
- 测试内容包括：
  - 数据库操作的正确性。
  - 业务规则的符合性。
  - 异常处理的健壮性。

#### **测试框架的选择**

1. **测试工具与框架**
   - **Jest**：主要测试框架，用于单元测试和集成测试
   - **React Testing Library**：用于测试 React 组件
   - **MSW (Mock Service Worker)**：用于模拟 API 请求
   - **Cypress**：用于端到端测试

2. **测试目录结构**
   ```
   /__tests__/
     /unit/
       /services/
         users.test.ts
         members.test.ts
         matches.test.ts
         training.test.ts
       /hooks/
         use-auth.test.ts
     /integration/
       /api/
         users-api.test.ts
       /workflows/
         create-member.test.ts
     /e2e/
       login.test.ts
       member-management.test.ts
   ```

#### **测试示例**

1. **用户服务单元测试**
   ```typescript
   // __tests__/unit/services/users.test.ts
   
   import { getUsers, updateUserStatus, createUser } from '@/services/users';
   import { createServerClient } from '@/lib/supabase';
   
   // 模拟 Supabase 客户端
   jest.mock('@/lib/supabase', () => ({
     createServerClient: jest.fn(),
     getSupabaseBrowserClient: jest.fn(),
   }));
   
   describe('User Service', () => {
     let mockSupabase: any;
     
     beforeEach(() => {
       // 重置模拟
       mockSupabase = {
         from: jest.fn().mockReturnThis(),
         select: jest.fn().mockReturnThis(),
         insert: jest.fn().mockReturnThis(),
         update: jest.fn().mockReturnThis(),
         eq: jest.fn().mockReturnThis(),
         single: jest.fn(),
         auth: {
           admin: {
             listUsers: jest.fn(),
             updateUserById: jest.fn(),
             createUser: jest.fn(),
           }
         }
       };
       
       (createServerClient as jest.Mock).mockReturnValue(mockSupabase);
     });
     
     describe('getUsers', () => {
       it('should fetch users successfully', async () => {
         // 模拟响应数据
         const mockAuthUsers = {
           data: {
             users: [
               { id: '1', email: 'user1@example.com', user_metadata: { role: 'admin' } }
             ]
           },
           error: null
         };
         
         const mockUserDetails = {
           data: [
             { id: '1', username: 'user1', full_name: 'User One' }
           ],
           error: null
         };
         
         mockSupabase.auth.admin.listUsers.mockResolvedValue(mockAuthUsers);
         mockSupabase.select.mockResolvedValue(mockUserDetails);
         
         // 执行测试
         const result = await getUsers();
         
         // 验证结果
         expect(result.length).toBe(1);
         expect(result[0].id).toBe('1');
         expect(result[0].email).toBe('user1@example.com');
         expect(result[0].username).toBe('user1');
         expect(result[0].name).toBe('User One');
       });
       
       it('should handle auth error correctly', async () => {
         // 模拟认证错误
         mockSupabase.auth.admin.listUsers.mockResolvedValue({
           data: null,
           error: new Error('Auth error')
         });
         
         // 执行测试并期望抛出异常
         await expect(getUsers()).rejects.toThrow('获取用户列表失败');
       });
     });
     
     // 更多测试用例...
   });
   ```

2. **比赛管理集成测试**
   ```typescript
   // __tests__/integration/api/matches-api.test.ts
   
   import { rest } from 'msw';
   import { setupServer } from 'msw/node';
   import { getMatches, createMatch, updateMatch } from '@/services/matches';
   
   // 设置模拟服务器
   const server = setupServer(
     // 模拟获取比赛列表的响应
     rest.get('*/rest/v1/matches', (req, res, ctx) => {
       return res(
         ctx.json({
           data: [
             {
               id: '1',
               opponent: 'Team A',
               match_date: '2023-05-20T14:00:00Z',
               match_type: 'friendly',
               result: 'win',
               score_for: 3,
               score_against: 1
             }
           ]
         })
       );
     }),
     
     // 模拟创建比赛的响应
     rest.post('*/rest/v1/matches', (req, res, ctx) => {
       return res(
         ctx.json({
           data: {
             id: '2',
             ...req.body,
             created_at: new Date().toISOString()
           }
         })
       );
     })
   );
   
   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   
   describe('Match API Integration', () => {
     it('should fetch matches correctly', async () => {
       const matches = await getMatches();
       expect(matches.length).toBe(1);
       expect(matches[0].id).toBe('1');
       expect(matches[0].opponent).toBe('Team A');
     });
     
     it('should create a match correctly', async () => {
       const newMatch = {
         opponent: 'Team B',
         match_date: '2023-06-15T15:00:00Z',
         match_type: 'league',
         home_away: 'away'
       };
       
       const result = await createMatch(newMatch, 'user-123');
       expect(result.id).toBe('2');
       expect(result.opponent).toBe('Team B');
       expect(result.match_type).toBe('league');
     });
     
     // 更多集成测试...
   });
   ```

3. **端到端测试**
   ```typescript
   // __tests__/e2e/member-management.test.ts (Cypress示例)
   
   describe('Member Management', () => {
     beforeEach(() => {
       // 登录为管理员
       cy.visit('/login');
       cy.get('input[name="email"]').type('admin@example.com');
       cy.get('input[name="password"]').type('password123');
       cy.get('button[type="submit"]').click();
       
       // 导航到会员管理页面
       cy.get('a[href="/dashboard/members"]').click();
     });
     
     it('should list members correctly', () => {
       cy.get('table').should('exist');
       cy.get('tbody tr').should('have.length.greaterThan', 0);
     });
     
     it('should add a new member', () => {
       // 点击添加会员按钮
       cy.get('a[href="/dashboard/members/new"]').click();
       
       // 填写表单
       cy.get('input[name="name"]').type('New Test Member');
       cy.get('input[name="position"]').type('Forward');
       cy.get('input[name="jersey_number"]').type('99');
       
       // 提交表单
       cy.get('button[type="submit"]').click();
       
       // 验证成功提示信息
       cy.contains('会员添加成功').should('be.visible');
       
       // 验证列表中是否显示新会员
       cy.get('tbody').should('contain', 'New Test Member');
     });
     
     it('should edit an existing member', () => {
       // 找到第一个会员并点击编辑
       cy.get('tbody tr:first').find('button[aria-label="Edit"]').click();
       
       // 修改信息
       cy.get('input[name="name"]').clear().type('Updated Member Name');
       
       // 保存更改
       cy.get('button[type="submit"]').click();
       
       // 验证成功提示信息
       cy.contains('会员更新成功').should('be.visible');
       
       // 验证列表中是否显示更新后的名称
       cy.get('tbody').should('contain', 'Updated Member Name');
     });
     
     // 更多端到端测试...
   });
   ```

### **业务模型优化（根据错误反馈修正）**
- 错误反馈通过日志记录和用户反馈收集。
- 优化流程：
  1. 分析错误日志。
  2. 修复代码中的逻辑错误。
  3. 更新相关测试用例。
  4. 部署修复后的代码。

#### **错误日志记录与分析**

1. **日志记录策略**
   - 在关键业务操作中记录详细的错误信息
   - 使用结构化日志格式，便于分析
   - 记录操作上下文和用户信息
   
   ```typescript
   // 错误日志记录示例
   try {
     const result = await performOperation(data);
     return result;
   } catch (error) {
     console.error("操作失败:", {
       operation: "createMember",
       userId: user.id,
       data: { ...data, sensitiveField: "[REDACTED]" },
       error: error instanceof Error 
         ? { message: error.message, stack: error.stack } 
         : String(error),
       timestamp: new Date().toISOString(),
     });
     throw new Error(`创建会员失败: ${error instanceof Error ? error.message : "未知错误"}`);
   }
   ```

2. **错误分类与优先级**
   对收集的错误进行分类并确定修复优先级：
   
   | 错误类型 | 描述 | 优先级 | 处理方法 |
   |---------|------|-------|---------|
   | 数据库连接错误 | 无法连接到Supabase服务 | 高 | 检查网络连接和API密钥 |
   | 身份验证错误 | 用户登录或会话处理问题 | 高 | 检查认证流程和会话管理 |
   | 数据验证错误 | 用户输入不符合要求 | 中 | 改进前端验证和错误提示 |
   | 权限错误 | 用户尝试访问无权限内容 | 高 | 检查权限逻辑和前端控制 |
   | 业务逻辑错误 | 操作流程或计算错误 | 中 | 修复业务逻辑代码 |
   | 性能问题 | 操作响应缓慢 | 低 | 优化查询和数据处理 |

#### **优化实施流程**

1. **错误分析与修复**
   - 收集并分析错误日志和用户反馈
   - 在开发环境中重现问题
   - 编写测试用例以验证错误
   - 实施修复并验证解决方案
   
   ```typescript
   // 修复前
   export async function updateMemberStatus(id: string, status: string) {
     const supabase = createServerClient();
     await supabase.from("members").update({ status }).eq("id", id);
     return { success: true };
   }
   
   // 修复后（增加错误处理和验证）
   export async function updateMemberStatus(id: string, status: MemberStatus) {
     // 验证状态值
     if (!["active", "inactive", "injured", "suspended"].includes(status)) {
       throw new Error("Invalid status value");
     }
     
     const supabase = createServerClient();
     const { error } = await supabase.from("members").update({ status }).eq("id", id);
     
     if (error) {
       console.error(`Error updating member status for ID ${id}:`, error);
       throw new Error(`Failed to update member status: ${error.message}`);
     }
     
     return { success: true };
   }
   ```

2. **性能优化**
   - 优化数据库查询
   - 实施数据缓存策略
   - 改进前端渲染性能
   
   ```typescript
   // 优化前（多次单独查询）
   async function getDashboardData() {
     const members = await getMembers();
     const matches = await getMatches();
     const trainings = await getTrainingSessions();
     return { members, matches, trainings };
   }
   
   // 优化后（并行查询）
   async function getDashboardData() {
     const [members, matches, trainings] = await Promise.all([
       getMembers(),
       getMatches(),
       getTrainingSessions()
     ]);
     return { members, matches, trainings };
   }
   ```

3. **代码重构**
   - 提取重复逻辑为通用函数
   - 改进错误处理机制
   - 增强类型安全
   
   ```typescript
   // 重构前（重复的错误处理逻辑）
   export async function getMembers() {
     const supabase = createServerClient();
     const { data, error } = await supabase.from("members").select("*");
     if (error) {
       console.error("Error fetching members:", error);
       throw new Error("Failed to fetch members");
     }
     return data;
   }
   
   export async function getMatches() {
     const supabase = createServerClient();
     const { data, error } = await supabase.from("matches").select("*");
     if (error) {
       console.error("Error fetching matches:", error);
       throw new Error("Failed to fetch matches");
     }
     return data;
   }
   
   // 重构后（使用通用查询函数）
   async function queryTable<T>(table: string, query: string = "*", errorMessage: string): Promise<T[]> {
     const supabase = createServerClient();
     const { data, error } = await supabase.from(table).select(query);
     if (error) {
       console.error(`Error querying ${table}:`, error);
       throw new Error(errorMessage || `Failed to query ${table}`);
     }
     return data as T[];
   }
   
   export async function getMembers() {
     return queryTable<Member>("members", "*", "Failed to fetch members");
   }
   
   export async function getMatches() {
     return queryTable<Match>("matches", "*", "Failed to fetch matches");
   }
   ```

4. **面向用户的改进**
   - 改进错误消息的可读性
   - 增加详细的用户指导
   - 实施渐进式功能推出
   
   ```typescript
   // 改进前
   if (error) throw new Error("Operation failed");
   
   // 改进后
   if (error) {
     // 面向用户的友好错误信息
     let userMessage = "操作无法完成，请稍后再试";
     
     // 基于错误类型提供具体指导
     if (error.code === "23505") {
       userMessage = "该电子邮件已被注册，请使用其他邮箱或尝试找回密码";
     } else if (error.code === "23503") {
       userMessage = "无法删除该记录，因为它与其他数据相关联";
     } else if (error.message.includes("network")) {
       userMessage = "网络连接问题，请检查您的互联网连接并重试";
     }
     
     throw new UserFacingError(userMessage, error);
   }
   ```

#### **持续优化流程**

1. **迭代改进周期**
   - 设定明确的优化目标和指标
   - 实施小规模、频繁的改进
   - 通过数据驱动决策
   
   ![优化迭代周期](https://example.com/optimization-cycle.png)
   
   迭代周期包括：
   - 收集反馈和指标
   - 分析问题和瓶颈
   - 设计解决方案
   - 实施改进
   - 评估效果
   - 循环迭代

2. **用户反馈收集机制**
   - 应用内反馈表单
   - 定期用户调查
   - 使用分析工具跟踪用户行为
   - 自动错误报告
   
   ```typescript
   // 用户反馈收集组件
   function FeedbackWidget() {
     const [feedback, setFeedback] = useState("");
     const [type, setType] = useState<"bug" | "suggestion" | "question">("suggestion");
     const { toast } = useToast();
     
     const submitFeedback = async () => {
       try {
         await saveFeedback({ type, content: feedback, userId: currentUser.id });
         toast({
           title: "反馈已提交",
           description: "感谢您的反馈，我们将尽快处理！",
           variant: "default",
         });
         setFeedback("");
       } catch (error) {
         toast({
           title: "提交失败",
           description: "反馈提交失败，请稍后再试",
           variant: "destructive",
         });
       }
     };
     
     return (
       <Card>
         <CardHeader>
           <CardTitle>您的反馈</CardTitle>
           <CardDescription>帮助我们改进产品</CardDescription>
         </CardHeader>
         <CardContent>
           {/* 反馈表单内容 */}
         </CardContent>
         <CardFooter>
           <Button onClick={submitFeedback}>提交反馈</Button>
         </CardFooter>
       </Card>
     );
   }
   ```

3. **性能监控与分析**
   - 监控关键操作的响应时间
   - 跟踪资源使用情况
   - 分析用户会话流程
   - 识别性能瓶颈

   ```typescript
   // 性能监控工具示例
   const performanceMonitor = {
     startTimer(operation: string) {
       return {
         start: performance.now(),
         operation
       };
     },
     
     endTimer(timer: { start: number, operation: string }) {
       const duration = performance.now() - timer.start;
       console.log(`Operation '${timer.operation}' completed in ${duration.toFixed(2)}ms`);
       
       // 如果操作时间超过阈值，记录为性能问题
       if (duration > 1000) {
         console.warn(`Performance issue: Operation '${timer.operation}' took ${duration.toFixed(2)}ms`);
         // 可以将性能数据发送到监控系统
       }
       
       return duration;
     },
     
     async trackOperation<T>(operation: string, fn: () => Promise<T>): Promise<T> {
       const timer = this.startTimer(operation);
       try {
         return await fn();
       } finally {
         this.endTimer(timer);
       }
     }
   };
   
   // 使用示例
   async function fetchDashboardData() {
     return performanceMonitor.trackOperation("fetchDashboardData", async () => {
       // 获取数据的代码
       return data;
     });
   }
   ```

---

## **2.2 视图模型开发（Developing the View Model）**

### **UI 界面实现**
视图层是应用的用户界面部分，主要由React组件构成，分为多个部分：

#### **UI组件库**
- 项目使用了一套自定义UI组件库，主要位于 `components/ui/` 目录
- 组件遵循设计系统原则，提供一致的用户体验
- 主要组件包括：
  ```
  components/ui/
    button.tsx       - 各种样式的按钮
    card.tsx         - 卡片容器
    table.tsx        - 数据表格
    tabs.tsx         - 选项卡切换
    dialog.tsx       - 对话框
    form.tsx         - 表单相关组件
    dropdown-menu.tsx - 下拉菜单
    badge.tsx        - 状态标签
    avatar.tsx       - 用户头像
    sidebar.tsx      - 侧边导航栏
  ```

#### **布局组件**
- 使用 Next.js 的布局系统组织页面结构
- 主要布局文件位于 `app/layout.tsx` 和 `app/dashboard/layout.tsx`
- 实现响应式设计，适应不同设备尺寸

```tsx
// app/dashboard/layout.tsx 布局示例
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  )
}
```

#### **功能组件**
根据业务功能划分，实现了多个专用组件：

1. **成员管理组件**
   - `member-table.tsx` - 表格形式展示队员列表
   - `member-grid.tsx` - 网格形式展示队员卡片
   - `member-quick-view.tsx` - 队员快速预览对话框
   - `member-performance.tsx` - 队员表现数据展示
   - `member-attendance.tsx` - 队员出勤记录展示

   ```tsx
   // member-quick-view.tsx 示例
   export function MemberQuickView({ member }: MemberQuickViewProps) {
     return (
       <div className="space-y-4 pt-4">
         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
           <div>
             <h3 className="text-xl font-bold">{member.name}</h3>
             <div className="flex flex-wrap items-center gap-2 mt-1">
               <Badge variant="secondary">{member.position}</Badge>
               <Badge variant={member.status === "Active" ? "default" : "destructive"}>
                 {member.status}
               </Badge>
             </div>
           </div>
           {/* 操作按钮 */}
         </div>
         {/* 成员详细信息 */}
       </div>
     )
   }
   ```

2. **比赛管理组件**
   - `match-list.tsx` - 比赛列表展示
   - `match-calendar.tsx` - 比赛日历视图
   - `match-quick-view.tsx` - 比赛快速预览
   - `match-lineup.tsx` - 比赛阵容管理
   - `match-events.tsx` - 比赛事件记录
   - `match-stats.tsx` - 比赛统计数据
   - `match-opponent-analysis.tsx` - 对手分析

   ```tsx
   // match-list.tsx 关键功能示例
   export function MatchList({ matches, type = "all", loading = false }: MatchListProps) {
     const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
     const [selectedMatch, setSelectedMatch] = useState<MatchWithDetails | null>(null)
     const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

     // 处理展开/折叠比赛详情
     const toggleExpandMatch = (id: string) => {
       setExpandedMatch(expandedMatch === id ? null : id)
     }

     // 显示快速预览对话框
     const handleViewMatch = (match: MatchWithDetails) => {
       setSelectedMatch(match)
       setIsQuickViewOpen(true)
     }

     // 渲染比赛列表...
   }
   ```

3. **训练管理组件**
   - `training-list.tsx` - 训练列表展示
   - `training-calendar.tsx` - 训练日历视图
   - `training-quick-view.tsx` - 训练快速预览
   - `training-attendance.tsx` - 训练出勤管理
   - `training-exercises.tsx` - 训练项目管理
   - `training-notes.tsx` - 训练笔记管理
   - `training-templates.tsx` - 训练模板管理

   ```tsx
   // training-attendance.tsx 示例
   export function TrainingAttendance({ trainingId }: TrainingAttendanceProps) {
     const [filter, setFilter] = useState("all")
     const [attendanceData, setAttendanceData] = useState([/* 初始数据 */])
     
     // 计算出勤率
     const presentCount = attendanceData.filter(m => m.status === "Present").length
     const lateCount = attendanceData.filter(m => m.status === "Late").length
     const absentCount = attendanceData.filter(m => m.status === "Absent").length
     const totalCount = attendanceData.length
     const attendanceRate = totalCount > 0 
       ? Math.round(((presentCount + lateCount) / totalCount) * 100) 
       : 0
     
     // 筛选数据
     const filteredData = filter === "all" 
       ? attendanceData 
       : attendanceData.filter(m => m.status === filter)
     
     // 更新队员出勤状态
     const updateStatus = (memberId: string, status: string) => {
       // 实现更新逻辑...
     }
     
     // 渲染出勤记录表格...
   }
   ```

4. **医疗记录组件**
   - `medical-records-list.tsx` - 医疗记录列表
   - `medical-records-grid.tsx` - 医疗记录网格视图
   - `medical-records-calendar.tsx` - 医疗记录日历视图
   - `medical-record-detail.tsx` - 医疗记录详情
   - `medical-stats.tsx` - 医疗统计数据

   ```tsx
   // medical-records-grid.tsx 关键部分
   export function MedicalRecordsGrid({ searchQuery, statusFilter }: MedicalRecordsGridProps) {
     const [isDetailOpen, setIsDetailOpen] = useState(false)
     const [selectedRecord, setSelectedRecord] = useState(null)
     
     // 根据查询条件筛选记录
     const filteredRecords = mockMedicalRecords.filter(record => {
       const matchesQuery = searchQuery === "" || 
         record.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         record.injuryType.toLowerCase().includes(searchQuery.toLowerCase())
       
       const matchesStatus = statusFilter === "all" || record.status === statusFilter
       
       return matchesQuery && matchesStatus
     })
     
     // 生成状态标签
     const getStatusBadge = (status: string) => {
       // 实现状态标签逻辑...
     }
     
     // 处理查看详情
     const handleViewDetail = (record: any) => {
       setSelectedRecord(record)
       setIsDetailOpen(true)
     }
     
     // 渲染网格视图和详情对话框...
   }
   ```

5. **通用组件**
   - `sidebar.tsx` - 应用侧边导航
   - `dashboard-stats.tsx` - 仪表盘统计卡片
   - `date-picker.tsx` - 日期选择器
   - `time-picker.tsx` - 时间选择器
   - `recent-activities.tsx` - 最近活动列表
   - `player-radar-chart.tsx` - 球员能力雷达图

   ```tsx
   // sidebar.tsx 关键部分
   export function Sidebar({ className }: SidebarProps) {
     const { user, hasPermission } = useAuth()
     const pathname = usePathname()
     
     // 检查当前路径是否匹配
     const isActive = (path: string) => {
       return pathname === path || pathname?.startsWith(`${path}/`)
     }
     
     return (
       <div className={cn("pb-12 border-r min-h-screen w-56", className)}>
         <div className="space-y-4 py-4">
           {/* 导航项 */}
           <div className="px-4 py-2">
             <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">体育团队管理系统</h2>
             <div className="space-y-1">
               {/* 按权限显示导航项 */}
               {/* ... */}
             </div>
           </div>
         </div>
       </div>
     )
   }
   ```

### **交互逻辑实现**

#### **状态管理**
项目使用 React 的状态管理和上下文API管理应用状态：

1. **局部状态**
   - 使用 `useState` 钩子管理组件内部状态
   - 例如表单数据、模态框状态、分页状态等

2. **上下文状态**
   - 通过 React Context 管理全局状态
   - 主要上下文定义在 `contexts/` 目录中
   
   ```tsx
   // contexts/auth-context.tsx
   export const AuthContext = createContext<AuthContextType | undefined>(undefined)
   
   export function AuthProvider({ children }: { children: ReactNode }) {
     const [user, setUser] = useState<UserSession | null>(null)
     const [loading, setLoading] = useState(true)
     
     // 登录逻辑
     const login = async (email: string, password: string) => {
       // 实现登录...
     }
     
     // 权限检查
     const hasPermission = (permission: string): boolean => {
       if (!user) return false
       const rolePermissions = ROLE_PERMISSIONS[user.role] || {}
       return !!rolePermissions[permission]
     }
     
     // 提供上下文值
     const value = {
       user,
       loading,
       login,
       logout,
       hasPermission
     }
     
     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
   }
   
   // 自定义钩子方便使用
   export const useAuth = () => {
     const context = useContext(AuthContext)
     if (context === undefined) {
       throw new Error("useAuth must be used within an AuthProvider")
     }
     return context
   }
   ```

#### **表单处理**
- 使用 `react-hook-form` 管理复杂表单
- 结合 `zod` 实现表单验证
- 自定义表单组件封装常用表单控件

```tsx
// 表单处理示例 (app/dashboard/medical/new/page.tsx)
export default function NewMedicalRecord() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 使用zod进行表单验证
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
    // 更多字段验证...
  })
  
  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      severity: "mild",
      estimatedRecovery: "1-2周",
      // 其他默认值...
    },
  })
  
  // 提交处理
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // 处理提交...
      toast({
        title: "医疗记录已创建",
        description: "新的医疗记录已成功创建。",
      })
      router.push("/dashboard/medical")
    } catch (error) {
      console.error("创建医疗记录失败:", error)
      toast({
        title: "创建失败",
        description: "创建医疗记录时发生错误。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // 渲染表单...
}
```

#### **路由导航**
- 使用 Next.js 的路由系统实现页面导航
- 通过 `Link` 组件实现客户端导航
- 使用 `useRouter` 钩子进行编程式导航

```tsx
// 路由导航示例
import Link from "next/link"
import { useRouter } from "next/navigation"

// 声明式导航
<Link href="/dashboard/members">
  <Button variant="outline">
    返回列表
  </Button>
</Link>

// 编程式导航
const router = useRouter()
const handleSubmit = async () => {
  // 处理表单提交...
  router.push("/dashboard/members")
}
```

#### **数据获取与展示**
- 通过调用 `services/` 层的函数获取数据
- 使用 `useEffect` 在组件挂载时获取初始数据
- 实现加载状态和错误处理

```tsx
// 数据获取示例 (app/dashboard/training/page.tsx)
export default function TrainingPage() {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSessionWithAttendance[]>([])
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
    attendanceRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // 并行获取数据
        const [trainingsData, statsData] = await Promise.all([
          fetchTrainingSessions(),
          fetchTrainingStatistics()
        ])
        
        setTrainingSessions(trainingsData)
        setStatistics(statsData)
      } catch (error) {
        console.error("加载训练数据失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载训练数据，请稍后再试。",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [toast])
  
  // 渲染组件...
}
```

### **视图与业务模型绑定方式**

项目中的视图组件与业务模型通过以下方式绑定：

1. **服务层调用**
   - 视图组件通过调用 `services/` 中的函数与业务模型交互
   - 例如，`member-table.tsx` 调用 `services/members.ts` 中的函数获取成员数据

   ```tsx
   // 视图组件中调用服务层函数示例
   import { getMembers, updateMemberStatus } from "@/services/members"
   
   export function MemberTable() {
     const [members, setMembers] = useState([])
     
     useEffect(() => {
       const loadMembers = async () => {
         const data = await getMembers()
         setMembers(data)
       }
       loadMembers()
     }, [])
     
     const handleStatusChange = async (id: string, status: string) => {
       await updateMemberStatus(id, status)
       // 刷新数据或更新本地状态
     }
     
     // 渲染表格...
   }
   ```

2. **服务器操作**
   - 使用 Next.js 的服务器操作（Server Actions）处理表单提交和数据修改
   - 创建位于页面模块内的 `actions.ts` 文件实现服务器端操作

   ```tsx
   // app/dashboard/members/actions.ts
   "use server"
   
   import { createMember, updateMember } from "@/services/members"
   import { revalidatePath } from "next/cache"
   
   export async function handleCreateMember(formData: FormData) {
     const name = formData.get("name") as string
     // 处理其他表单字段...
     
     const newMember = {
       name,
       // 其他字段...
     }
     
     try {
       await createMember(newMember)
       revalidatePath("/dashboard/members")
       return { success: true }
     } catch (error) {
       return { 
         success: false, 
         error: "创建队员失败，请稍后再试。" 
       }
     }
   }
   ```

3. **认证与权限控制**
   - 使用 `contexts/auth-context.tsx` 提供的 `hasPermission` 函数控制基于权限的视图渲染
   - 确保用户只能访问有权限的功能和数据

   ```tsx
   // 权限控制示例
   import { useAuth } from "@/contexts/auth-context"
   
   export function MemberActions({ memberId }: { memberId: string }) {
     const { hasPermission } = useAuth()
     
     return (
       <div className="flex gap-2">
         {hasPermission("VIEW_MEMBERS") && (
           <Button variant="outline" asChild>
             <Link href={`/dashboard/members/${memberId}`}>查看</Link>
           </Button>
         )}
         
         {hasPermission("MANAGE_MEMBERS") && (
           <>
             <Button variant="outline" asChild>
               <Link href={`/dashboard/members/${memberId}/edit`}>编辑</Link>
             </Button>
             <Button variant="destructive" onClick={handleDelete}>删除</Button>
           </>
         )}
       </div>
     )
   }
   ```

4. **数据转换与格式化**
   - 视图组件负责将业务数据转换为适合展示的格式
   - 处理日期格式化、状态展示和数据聚合等

   ```tsx
   // 数据格式化示例
   const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleDateString('zh-CN', {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
     })
   }
   
   const getStatusBadgeVariant = (status: string) => {
     switch (status) {
       case "active": return "default"
       case "injured": return "destructive"
       case "suspended": return "warning"
       default: return "outline"
     }
   }
   ```

### **响应式设计实现**

项目使用 Tailwind CSS 实现响应式布局，适应不同屏幕尺寸：

1. **断点系统**
   - 使用 Tailwind 提供的断点前缀（sm, md, lg, xl, 2xl）
   - 例如：`md:grid-cols-2 lg:grid-cols-3` 表示中等屏幕显示2列，大屏显示3列

   ```tsx
   <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
     {/* 卡片内容 */}
   </div>
   ```

2. **移动优先设计**
   - 默认样式针对移动设备
   - 使用媒体查询为更大屏幕提供增强样式

3. **可视组件适配**
   - 在移动设备上使用列表视图
   - 在桌面设备上提供更丰富的网格和日历视图
   - 使用自定义钩子检测设备类型

   ```tsx
   // hooks/use-mobile.tsx
   export function useIsMobile() {
     const [isMobile, setIsMobile] = useState(false)
     
     useEffect(() => {
       const checkIfMobile = () => {
         setIsMobile(window.innerWidth < 768)
       }
       
       checkIfMobile()
       window.addEventListener('resize', checkIfMobile)
       return () => window.removeEventListener('resize', checkIfMobile)
     }, [])
     
     return isMobile
   }
   ```

4. **侧边栏适配**
   - 桌面设备上显示固定侧边栏
   - 移动设备上使用可折叠菜单或抽屉导航

   ```tsx
   // 侧边栏响应式处理示例
   const { isMobile } = useSidebar()
   
   if (isMobile) {
     return (
       <Sheet open={openMobile} onOpenChange={setOpenMobile}>
         <SheetContent className="w-[--sidebar-width-mobile] p-0">
           <div className="flex h-full w-full flex-col">{children}</div>
         </SheetContent>
       </Sheet>
     )
   }
   
   return (
     // 桌面侧边栏渲染
   )
   ```

### **主题与样式系统**

项目采用了一套统一的样式系统：

1. **主题提供器**
   - 使用 `ThemeProvider` 提供全局主题支持
   - 实现深色模式和浅色模式切换功能

   ```tsx
   // components/theme-provider.tsx
   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
     
     // 主题切换逻辑...
     
     return (
       <ThemeProviderContext.Provider value={{ theme, setTheme }}>
         <ThemeScript theme={theme} />
         {children}
       </ThemeProviderContext.Provider>
     )
   }
   ```

2. **Tailwind CSS 配置**
   - 定制设计系统中的颜色、间距、字体等
   - 通过 `tailwind.config.ts` 配置主题变量

   ```typescript
   // tailwind.config.ts 关键配置
   export default {
     darkMode: ["class"],
     theme: {
       container: {
         center: true,
         padding: "2rem",
         screens: {
           "2xl": "1400px",
         },
       },
       extend: {
         colors: {
           border: "hsl(var(--border))",
           input: "hsl(var(--input))",
           // 其他主题颜色...
         },
         // 其他扩展...
       },
     },
     // 插件配置...
   }
   ```

3. **全局样式**
   - 基础样式定义在 `app/globals.css` 中
   - 使用 CSS 变量定义主题属性

   ```css
   /* app/globals.css 关键部分 */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
 
   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 222.2 84% 4.9%;
       --card: 0 0% 100%;
       --card-foreground: 222.2 84% 4.9%;
       /* 其他亮色主题变量... */
     }
   
     .dark {
       --background: 222.2 84% 4.9%;
       --foreground: 210 40% 98%;
       --card: 222.2 84% 4.9%;
       --card-foreground: 210 40% 98%;
       /* 其他暗色主题变量... */
     }
   }
   ```

4. **组件样式变体**
   - 使用 class-variance-authority (cva) 定义组件变体
   - 提供一致的组件变体系统

   ```tsx
   // components/ui/button.tsx 示例
   const buttonVariants = cva(
     "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
     {
       variants: {
         variant: {
           default: "bg-primary text-primary-foreground hover:bg-primary/90",
           destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
           outline: "border border-input hover:bg-accent hover:text-accent-foreground",
           secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
           ghost: "hover:bg-accent hover:text-accent-foreground",
           link: "underline-offset-4 hover:underline text-primary",
         },
         size: {
           default: "h-10 py-2 px-4",
           sm: "h-9 px-3 rounded-md",
           lg: "h-11 px-8 rounded-md",
           icon: "h-10 w-10",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     }
   )
   ```

### **用户体验优化**

项目实现了多种用户体验优化技术：

1. **加载状态处理**
   - 使用骨架屏提供加载状态的视觉反馈
   - 实现专用的加载组件（如 `app/dashboard/medical/loading.tsx`）

   ```tsx
   // 骨架屏示例
   export default function MedicalLoading() {
     return (
       <div className="space-y-6">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
           <div>
             <Skeleton className="h-8 w-[250px]" />
             <Skeleton className="mt-2 h-4 w-[350px]" />
           </div>
           <Skeleton className="h-10 w-[150px]" />
         </div>
         
         <div className="grid gap-4 md:grid-cols-4">
           {[1, 2, 3, 4].map((i) => (
             <Card key={i}>
               <CardHeader className="pb-2">
                 <Skeleton className="h-4 w-[120px]" />
               </CardHeader>
               <CardContent>
                 <Skeleton className="h-8 w-[60px]" />
               </CardContent>
             </Card>
           ))}
         </div>
         
         {/* 更多骨架元素... */}
       </div>
     )
   }
   ```

2. **反馈机制**
   - 使用 Toast 通知提供操作结果反馈
   - 通过颜色区分成功/错误状态

   ```tsx
   // Toast 通知示例
   import { useToast } from "@/components/ui/use-toast"
   
   export function DeleteButton({ id }: { id: string }) {
     const { toast } = useToast()
     
     const handleDelete = async () => {
       try {
         await deleteRecord(id)
         toast({
           title: "成功删除",
           description: "记录已被成功删除。",
         })
       } catch (error) {
         toast({
           title: "删除失败",
           description: "无法删除记录，请稍后再试。",
           variant: "destructive",
         })
       }
     }
     
     return <Button onClick={handleDelete}>删除</Button>
   }
   ```

3. **动态交互**
   - 实现平滑过渡效果增强交互体验
   - 使用动态内容展开/折叠提高信息密度

   ```tsx
   // 动态交互示例
   const [expanded, setExpanded] = useState(false)
   
   return (
     <div>
       <div className="flex justify-between">
         <h3>项目详情</h3>
         <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
           {expanded ? <ChevronUp /> : <ChevronDown />}
         </Button>
       </div>
       
       {expanded && (
         <div className="mt-4 space-y-2 animate-in fade-in-50 slide-in-from-top-5 duration-300">
           <p>详细内容...</p>
         </div>
       )}
     </div>
   )
   ```

4. **表单交互优化**
   - 实时表单验证提供即时反馈
   - 表单控件状态反馈（错误、成功、加载）
   - 多步骤表单流程（医疗记录创建）

   ```tsx
   // 表单交互优化示例
   <FormField
     control={form.control}
     name="injuryType"
     render={({ field }) => (
       <FormItem>
         <FormLabel>伤病类型</FormLabel>
         <FormControl>
           <Input placeholder="例如：踝关节扭伤" {...field} />
         </FormControl>
         <FormDescription>简要描述伤病类型</FormDescription>
         <FormMessage />
       </FormItem>
     )}
   />
   ```

### **用户反馈的优化调整**

基于用户反馈进行的UI和交互优化：

1. **易用性改进**
   - 添加清晰的视觉层次和信息分组
   - 优化表单布局，将相关字段分组
   - 提供上下文帮助信息

2. **性能优化**
   - 实现虚拟列表处理大量数据
   - 延迟加载非关键组件减少初始加载时间
   - 图片懒加载和优化

3. **错误处理优化**
   - 友好的错误展示，提供明确的恢复路径
   - 本地错误处理，避免全页面刷新
   - 离线模式支持和数据持久化

4. **访问性改进**
   - 遵循 WCAG 指南提高可访问性
   - 提供键盘导航和屏幕阅读器支持
   - 确保足够的颜色对比度和文本大小

## **2.3 内部文档**

### **代码文档**

#### **变量命名规范**
- 使用驼峰命名法（camelCase）命名变量。
- 组件文件名使用小写连字符（kebab-case），例如 `match-list.tsx`。
- 类型和接口使用 PascalCase，例如 `UserType`。

#### **代码缩进和格式**
- 使用 2 个空格进行代码缩进。
- 使用 Prettier 格式化代码，配置文件为 `.prettierrc`（如未配置，可添加）。

### **使用外部库和 API**

#### **记录所有使用的库**
- `react`：用于构建用户界面。
- `tailwindcss`：用于快速样式开发。
- `supabase`：用于后端服务和数据库操作。
- `@headlessui/react`：用于无样式的 UI 组件。
- `date-fns`：用于日期处理。

#### **说明自学引入的内容**
- Supabase 的使用需要熟悉其文档和 API。
- Tailwind CSS 的配置和自定义需要参考官方文档。

### **错误处理**

#### **异常捕获**
- 在 `services/` 中通过 `try-catch` 捕获 API 调用异常。
- 在组件中通过 `ErrorBoundary` 捕获渲染错误。

#### **数据校验**
- 使用 TypeScript 类型系统进行静态校验。
- 在 API 调用前对用户输入进行验证，例如表单验证。