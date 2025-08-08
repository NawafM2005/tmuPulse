"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'sonner'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface PlannerData {
  selectedProgram: string | null
  selectedStream: string | null
  selectedCourses: { [key: string]: any[] } // semester -> courses
  completedCourses: string[]
  totalCredits: number
  remainingCredits: number
}

interface SavedPlan {
  id: string
  program_id: string
  plan_data: PlannerData
  last_updated: string
}

export function usePlannerData() {
  const [plannerData, setPlannerData] = useState<PlannerData>({
    selectedProgram: null,
    selectedStream: null,
    selectedCourses: {},
    completedCourses: [],
    totalCredits: 0,
    remainingCredits: 40
  })
  
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load user and their saved plans
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadUserPlan(session.user.id)
        }
      } catch (error) {
        console.error('Error initializing planner data:', error)
        toast.error('Failed to load your planner data')
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserPlan(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          // Clear data on logout
          setPlannerData({
            selectedProgram: null,
            selectedStream: null,
            selectedCourses: {},
            completedCourses: [],
            totalCredits: 0,
            remainingCredits: 40
          })
          setLastSaved(null)
          setHasUnsavedChanges(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Load user's saved plan from database
  const loadUserPlan = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_degree_plans')
        .select('*')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false })
        .limit(1)
        .single()

      if (data && !error) {
        setPlannerData(data.plan_data)
        setLastSaved(new Date(data.last_updated))
        setHasUnsavedChanges(false)
      } else if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - that's fine for new users
        console.error('Error loading user plan:', error)
        toast.error('Failed to load your saved plan')
      }
    } catch (error) {
      console.error('Error in loadUserPlan:', error)
      toast.error('Failed to load your saved plan')
    }
  }

  // Save plan data
  const savePlan = useCallback(async (newData: Partial<PlannerData>, autoSave = false) => {
    const updatedData = { ...plannerData, ...newData }
    
    // Calculate credits
    const totalCredits = calculateTotalCredits(updatedData.selectedCourses)
    const remainingCredits = Math.max(0, 40 - totalCredits) // Assume 40 credit degree

    const finalData = {
      ...updatedData,
      totalCredits,
      remainingCredits
    }

    setPlannerData(finalData)
    setHasUnsavedChanges(true)

    // Save to database if user is logged in and has selected a program
    if (user && finalData.selectedProgram) {
      if (!autoSave) {
        // Manual save
        await saveToDatabase(finalData)
      } else {
        // Auto-save with debounce
        debouncedSave(finalData)
      }
    } else if (!user) {
      toast.error('Please log in to save your plan')
    }

    return finalData
  }, [plannerData, user])

  // Save to database
  const saveToDatabase = async (data: PlannerData) => {
    if (!user || !data.selectedProgram) {
      if (!user) {
        toast.error('Please log in to save your plan')
      }
      return
    }

    setIsSaving(true)
    try {
      // First check if a record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('user_degree_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('program_id', data.selectedProgram)
        .single()

      let error = null

      if (existingRecord && !checkError) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_degree_plans')
          .update({
            plan_data: data,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('program_id', data.selectedProgram)
        
        error = updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_degree_plans')
          .insert({
            user_id: user.id,
            program_id: data.selectedProgram,
            plan_data: data,
            last_updated: new Date().toISOString()
          })
        
        error = insertError
      }

      if (error) {
        console.error('Error saving to database:', error)
        toast.error('Failed to save your plan to the database')
      } else {
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        toast.success('Plan saved successfully!')
      }
    } catch (error) {
      console.error('Database save error:', error)
      toast.error('Failed to save your plan')
    } finally {
      setIsSaving(false)
    }
  }

  // Debounced auto-save
  const debouncedSave = useCallback(
    debounce((data: PlannerData) => {
      saveToDatabase(data)
    }, 2000), // Save 2 seconds after last change
    [user]
  )

  // Calculate total credits from selected courses
  const calculateTotalCredits = (selectedCourses: { [key: string]: any[] }) => {
    let total = 0
    Object.values(selectedCourses).forEach(courses => {
      courses.forEach(course => {
        total += course.credits || 1 // Default to 1 credit if not specified
      })
    })
    return total
  }

  return {
    plannerData,
    savePlan,
    isLoading,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    user,
    saveToDatabase: () => saveToDatabase(plannerData)
  }
}

// Debounce utility
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
