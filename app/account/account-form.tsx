'use client'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      // alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
      router.push("/")

    }
    
  }

  return (
    <div className="form-widget flex flex-col justify-center text-white">
      <div className='w-full space-x-2 space-y-2 items-center flex justify-between'>
        <label htmlFor="email">Email</label>
        <input className='rounded-md p-2 text-black' id="email" type="text" value={user?.email} disabled />
      </div>
      <div className='w-full space-x-2 space-y-2 items-center flex justify-between'>
        <label htmlFor="fullName">Full Name</label>
        <input className='rounded-md p-2 text-black'
          id="fullName"
          type="text"
          value={fullname || ''}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div className='w-full space-x-2 space-y-2 items-center flex justify-between'>
        <label htmlFor="username">Username</label>
        <input className='rounded-md p-2 text-black'
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='w-full space-x-2 space-y-2 items-center flex justify-between'>
        <label htmlFor="website">Website</label>
        <input className='rounded-md p-2 text-black'
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className='flex flex-col justify-center items-center mt-10 space-y-5'>      
        <div className=''>
              <button
                className='bg-gradient-to-r from-black to-blue-300 rounded-md p-2 w-20'
                onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                disabled={loading}
              >
                {loading ? 'Loading ...' : 'Update'}
              </button>
            </div>

            <div>
              <form action="/auth/signout" method="post">
                <button className='bg-gradient-to-r from-black to-blue-300 rounded-md p-2 w-20' type="submit">
                  Sign out
                </button>
              </form>
            </div>
      </div>

    </div>
  )
}