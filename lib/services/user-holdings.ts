export interface UserHolding {
  id: number,
  userId: string,
  createdAt: Date,
  code: string,
  type: string
}
/// 查列表
export const getList: () => Promise<UserHolding[]> = async () => {
  return fetch('/api/actions/holdings').then(async response => {
    const { data, error } = await response.json()
    if (error) throw error

    console.log('in client?')
    return (data || []).map((holding: any) => ({
      id: holding.id,
      userId: holding.user_id,
      createdAt: new Date(holding.created_at),
      code: holding.code,
      type: holding.type,
    }))
  })
}
// 增

// 删

// 查一条

// 改
