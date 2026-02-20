import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useTasks(filters = {}) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ========================
  // FETCH TASKS
  // ========================
  const fetchTasks = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          categories(id, name),
          task_tags(id, tag_name)
        `)
        .order('created_at', { ascending: false })

      if (filters.status)
        query = query.eq('status', filters.status)

      if (filters.category_id)
        query = query.eq('category_id', filters.category_id)

      if (filters.search)
        query = query.ilike('title', `%${filters.search}%`)

      if (filters.overdue) {
        query = query
          .lt('due_date', new Date().toISOString())
          .neq('status', 'completed')
      }

      const { data, error } = await query
      if (error) throw error

      setTasks(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [
    user,
    filters.status,
    filters.category_id,
    filters.search,
    filters.overdue,
  ])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // ========================
  // CREATE TASK (FIXED VERSION)
  // ========================
  const createTask = async ({ tags = [], ...taskData }) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    // ดึง user จาก session จริง ป้องกัน state ยังไม่ sync
    const {
      data: { user: currentUser },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !currentUser) {
      throw new Error('Unable to get authenticated user')
    }

    // Insert task
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        user_id: currentUser.id,
      })
      .select()
      .single()

    if (error) throw error

    // Insert tags (ถ้ามี)
    if (tags.length > 0) {
      const tagRows = tags.map((tag_name) => ({
        task_id: task.id,
        tag_name,
        user_id: currentUser.id, // สำคัญถ้า task_tags เปิด RLS
      }))

      const { error: tagError } = await supabase
        .from('task_tags')
        .insert(tagRows)

      if (tagError) throw tagError
    }

    await fetchTasks()
    return task
  }

  // ========================
  // UPDATE TASK
  // ========================
  const updateTask = async (id, { tags, ...updates }) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    if (tags !== undefined) {
      await supabase.from('task_tags').delete().eq('task_id', id)

      if (tags.length > 0) {
        const tagRows = tags.map((tag_name) => ({
          task_id: id,
          tag_name,
          user_id: user.id,
        }))

        const { error: tagError } = await supabase
          .from('task_tags')
          .insert(tagRows)

        if (tagError) throw tagError
      }
    }

    await fetchTasks()
  }

  // ========================
  // UPDATE STATUS
  // ========================
  const updateStatus = async (id, status) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    )
  }

  // ========================
  // DELETE TASK
  // ========================
  const deleteTask = async (id) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error

    setTasks((prev) =>
      prev.filter((t) => t.id !== id)
    )
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  }
}