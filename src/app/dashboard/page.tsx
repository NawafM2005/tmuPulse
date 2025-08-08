"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabaseClient"
import { User, Edit3, Save, X, Camera, Mail, Settings, BookOpen, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Footer from "@/components/footer"
import { usePlannerData } from "@/hooks/usePlannerData"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Get planner data for statistics
  const { plannerData, isLoading: plannerLoading } = usePlannerData()

  // Calculate course statistics from planner data
  const courseStats = useMemo(() => {
    const totalCoursesInProgram = 40 // Fixed total for all programs (1-credit system)
    
    if (!plannerData.selectedCourses) {
      return {
        totalCourses: totalCoursesInProgram,
        completedCourses: 0,
        totalCredits: totalCoursesInProgram,
        completedCredits: 0,
        completionPercentage: 0
      }
    }

    // Count completed courses from the completed courses list
    const completedCourseCodes = new Set(plannerData.completedCourses || [])
    const completedCourses = completedCourseCodes.size
    const completedCredits = completedCourses // 1 credit per course

    const completionPercentage = totalCoursesInProgram > 0 ? Math.round((completedCourses / totalCoursesInProgram) * 100) : 0

    return {
      totalCourses: totalCoursesInProgram,
      completedCourses,
      totalCredits: totalCoursesInProgram,
      completedCredits,
      completionPercentage
    }
  }, [plannerData.selectedCourses, plannerData.completedCourses])

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUser(session.user)
      // Load saved profile data from user metadata
      setUsername(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User')
      setProfileImageUrl(session.user.user_metadata?.profile_image_url || '')
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          router.push('/login')
        } else {
          setUser(session.user)
          // Load saved profile data from user metadata
          setUsername(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User')
          setProfileImageUrl(session.user.user_metadata?.profile_image_url || '')
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSaveUsername = async () => {
    if (!user) return
    
    try {
      // Save username and profile image to user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: username,
          profile_image_url: profileImageUrl
        }
      })
      
      if (error) {
        console.error('Error updating profile:', error)
        toast.error("Failed to update profile. Please try again.")
      } else {
        console.log('Profile updated successfully')
        toast.success("Profile updated successfully!")
        // Update the local user state with the new data
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error("An unexpected error occurred. Please try again.")
    }
    
    setIsEditing(false)
  }

  const handleSaveProfileImage = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: username,
          profile_image_url: profileImageUrl
        }
      })
      
      if (error) {
        console.error('Error updating profile image:', error)
        toast.error("Failed to update profile image. Please try again.")
      } else {
        toast.success("Profile image updated!")
        // Update the local user state with the new data
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Error saving profile image:', error)
      toast.error("Failed to save profile image. Please try again.")
    }
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />
      <Toaster />
      
      {/* Header Section */}
      <div className="pt-30 pb-8 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Manage your profile and academic settings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 lg:px-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Section - User Settings */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/60 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
                </div>

                {/* Username Section */}
                <div className="space-y-4 mb-6">
                  <Label htmlFor="username" className="text-base font-semibold text-foreground">
                    Display Name
                  </Label>
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="flex-1 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20"
                          placeholder="Enter display name"
                        />
                        <Button
                          onClick={handleSaveUsername}
                          size="sm"
                          className="h-12 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer transform"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          size="sm"
                          className="h-12 px-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-300 transition-all duration-300 hover:scale-105 hover:cursor-pointer transform"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 h-12 px-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border border-border/50 flex items-center text-foreground font-medium shadow-sm backdrop-blur-sm">
                          @{username}
                        </div>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                          className="h-12 px-4 rounded-xl hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-md transform"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Email Section */}
                <div className="space-y-4 mb-6">
                  <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="h-12 px-4 rounded-xl bg-muted/50 border border-border/50 flex items-center text-muted-foreground font-mono">
                    {user?.email}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Profile Image URL Section */}
                <div className="space-y-4">
                  <Label htmlFor="profileImage" className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Profile Image URL
                  </Label>
                  <Input
                    id="profileImage"
                    value={profileImageUrl}
                    onChange={(e) => setProfileImageUrl(e.target.value)}
                    onBlur={handleSaveProfileImage}
                    className="h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 hover:border-primary/30 hover:cursor-text"
                    placeholder="https://example.com/your-image.jpg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a URL to display your custom profile image.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Profile Display */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm border border-border/60 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Profile Preview</h2>
                </div>

                {/* Profile Card */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                  {/* Profile Image */}
                  <div className="flex justify-center mb-4">
                    {profileImageUrl ? (
                      <div className="relative group">
                        <img
                          src={profileImageUrl}
                          alt="Profile"
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      </div>
                    ) : null}
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-3xl md:text-4xl font-bold shadow-lg ${profileImageUrl ? 'hidden' : ''}`}>
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>

                  {/* User Info */}
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {username}
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm md:text-base mb-4">
                    {user?.email}
                  </p>
                  
                  {/* Status */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Active Student</span>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-background/50 rounded-xl p-4 text-center border border-border/30">
                    <div className="flex items-center justify-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {plannerLoading ? "..." : `${courseStats.completedCourses}/${courseStats.totalCourses}`}
                    </div>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 text-center border border-border/30">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-purple-500 mb-1">
                      {plannerLoading ? "..." : `${courseStats.completionPercentage}%`}
                    </div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>

                {/* Progress Details */}
                {!plannerLoading && courseStats.totalCourses > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Academic Progress
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits Completed</span>
                        <span className="font-medium text-foreground">
                          {courseStats.completedCredits} / {courseStats.totalCredits}
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${courseStats.completionPercentage}%` }}
                        />
                      </div>
                      {plannerData.selectedProgram && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Program</span>
                          <span className="font-medium text-foreground">
                            {plannerData.selectedProgram}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Call to Action for New Users */}
                {!plannerLoading && !plannerData.selectedProgram && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20 text-center">
                    <h4 className="font-semibold text-foreground mb-2">Get Started!</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start planning your degree to see your progress here.
                    </p>
                    <Link href="/planner">
                      <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-xl transition-all duration-300 hover:scale-105 hover:cursor-pointer">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Open Degree Planner
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  )
}