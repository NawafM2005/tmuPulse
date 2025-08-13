"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { supabase } from "@/lib/supabaseClient"
import { User, Edit3, Save, X, Camera, Mail, Settings, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { Toaster } from "@/components/ui/sonner"
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Footer from "@/components/footer"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [allowDataSaving, setAllowDataSaving] = useState(true)



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
      setAllowDataSaving(session.user.user_metadata?.allow_data_saving !== false)
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
          setAllowDataSaving(session.user.user_metadata?.allow_data_saving !== false)
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
          profile_image_url: profileImageUrl,
          allow_data_saving: allowDataSaving
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
          profile_image_url: profileImageUrl,
          allow_data_saving: allowDataSaving
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

  const handleDataSavingChange = async (value: boolean) => {
    if (!user) return
    
    setAllowDataSaving(value)
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: username,
          profile_image_url: profileImageUrl,
          allow_data_saving: value
        }
      })
      
      if (error) {
        console.error('Error updating data saving preference:', error)
        toast.error("Failed to update preference. Please try again.")
        // Revert the state if there was an error
        setAllowDataSaving(!value)
      } else {
        toast.success(`Data saving ${value ? 'enabled' : 'disabled'}!`)
        // Update the local user state with the new data
        if (data.user) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Error saving data preference:', error)
      toast.error("Failed to save preference. Please try again.")
      // Revert the state if there was an error
      setAllowDataSaving(!value)
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

  const handleDeleteAccount = async () => {
    if (!user) return

    try {
      setDeleteLoading(true)
      
      // Get the current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.access_token) {
        toast.error("Authentication error. Please try logging in again.")
        return
      }

      // Call your delete endpoint
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }
      
      // Sign out and redirect
      await supabase.auth.signOut()
      toast.success("Account deleted successfully")
      router.push('/')
      
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error("Failed to delete account. Please try again.")
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
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

                {/* Permission to save data*/}
                <div className="pt-6 border-t border-border/20">
                  <Label className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
                    <CheckCircle className={`h-4 w-4 ${allowDataSaving ? 'text-green-500' : 'text-gray-400'}`} />
                    Data Saving Preferences
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Allow TMU Pulse to save your academic progress and course selections for a personalized experience.
                  </p>
                  
                  {/* Toggle Switch */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-background/50 to-background/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${allowDataSaving ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Data Saving</span>
                        <p className="text-xs text-muted-foreground">
                          {allowDataSaving ? 'Your progress will be saved' : 'Operating in private mode'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Custom Toggle Switch */}
                    <button
                      onClick={() => handleDataSavingChange(!allowDataSaving)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full hover:cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 hover:scale-105 ${
                        allowDataSaving
                          ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/25'
                          : 'bg-gray-300 dark:bg-gray-600 shadow-inner'
                      }`}
                      role="switch"
                      aria-checked={allowDataSaving}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-lg ${
                          allowDataSaving 
                            ? 'translate-x-6 shadow-green-200' 
                            : 'translate-x-1 shadow-gray-400'
                        }`}
                      />
                    </button>
                  </div>
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
                        <Image
                          src={profileImageUrl}
                          alt="Profile"
                          width={128}
                          height={128}
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

                  {/* Delete Account Section */}
                  <div className="pt-6 flex flex-col items-center">      
                    {!showDeleteConfirm ? (
                      <Button
                        onClick={() => setShowDeleteConfirm(true)}
                        variant="outline"
                        className="w-full h-12 rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all duration-300 hover:cursor-pointer hover:bg-red-400 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    ) : (
                      <div className="space-y-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                        <p className="text-sm text-destructive font-medium text-red-500 animate-pulse">
                          ⚠️ This action cannot be undone. This will permanently delete your account and all associated data.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={handleDeleteAccount}
                            className="flex-1 h-10 bg-red-400 text-white hover:bg-destructive/90 text-destructive-foreground hover:cursor-pointer hover:opacity-80"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
                          </Button>
                          <Button
                            onClick={() => setShowDeleteConfirm(false)}
                            variant="outline"
                            className="flex-1 h-10 hover:cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </main>
  )
}