import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Sidebar from '../../components/layout/Sidebar'
import PageTransition from '../../components/layout/PageTransition'
import ConfirmModal from '../../components/ui/ConfirmModal'
import { useAuth } from '../../hooks/useAuth'
import { updateProfile, updatePassword, deleteAccount } from '../../api/user.api'

const TABS = ['Profile', 'Security', 'Notifications', 'Danger Zone']

const NOTIFICATION_SETTINGS = [
  { key: 'reportUpdates', label: 'Report Status Updates', desc: 'Get notified when your report status changes' },
  { key: 'newPrograms', label: 'New Programs', desc: 'Alerts for new programs matching your skills' },
  { key: 'bountyPaid', label: 'Bounty Payments', desc: 'Payment confirmations and receipts' },
  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of activity and new opportunities' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [notifs, setNotifs] = useState({ reportUpdates: true, newPrograms: true, bountyPaid: true, weeklyDigest: false })
  const { user, logout } = useAuth()
  const qc = useQueryClient()

  const { register: registerProfile, handleSubmit: handleProfile } = useForm({
    defaultValues: { name: user?.name, college: user?.college, bio: user?.bio },
  })

  const { register: registerPwd, handleSubmit: handlePwd } = useForm()

  const { mutate: saveProfile, isPending: savingProfile } = useMutation({
    mutationFn: (data) => updateProfile(data),
    onSuccess: () => { toast.success('Profile updated'); qc.invalidateQueries(['me']) },
    onError: () => toast.error('Update failed'),
  })

  const { mutate: savePwd, isPending: savingPwd } = useMutation({
    mutationFn: (data) => updatePassword(data),
    onSuccess: () => toast.success('Password updated'),
    onError: () => toast.error('Password update failed'),
  })

  const handleDelete = async () => {
    try {
      await deleteAccount()
      logout()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 md:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] pointer-events-none" />
        <PageTransition>
          <h1 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface uppercase mb-2">
            <span className="text-primary">Settings</span>
          </h1>
          <p className="text-on-surface-variant font-mono text-xs mb-8 uppercase tracking-widest">Operator configuration</p>

          {/* Tabs */}
          <div className="flex border-b border-white/5 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            {/* Profile Tab */}
            {activeTab === 'Profile' && (
              <form onSubmit={handleProfile(saveProfile)} className="space-y-5">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 bg-surface-container-high flex items-center justify-center font-headline font-bold text-2xl text-on-surface-variant">
                      {user?.name?.[0] || '?'}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface text-sm">photo_camera</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-on-surface font-bold">{user?.name}</p>
                    <p className="font-mono text-[10px] text-on-surface-variant">Click to upload avatar</p>
                  </div>
                </div>
                {[
                  { label: 'Display Name', key: 'name', placeholder: 'John ZeroDay' },
                  { label: 'College / Organization', key: 'college', placeholder: 'MIT' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">{label}</label>
                    <input type="text" className="input-field" placeholder={placeholder} {...registerProfile(key)} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">Bio</label>
                  <textarea rows={3} className="input-field resize-none" placeholder="Security researcher..." {...registerProfile('bio')} />
                </div>
                <button type="submit" disabled={savingProfile} className="px-8 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-60">
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'Security' && (
              <div className="space-y-6">
                <form onSubmit={handlePwd(savePwd)} className="space-y-5">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Change Password</h3>
                  {[
                    { label: 'Current Cipher', key: 'currentPassword' },
                    { label: 'New Cipher', key: 'newPassword' },
                    { label: 'Confirm New Cipher', key: 'confirmPassword' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1.5">{label}</label>
                      <input type="password" className="input-field" placeholder="••••••••" {...registerPwd(key)} />
                    </div>
                  ))}
                  <button type="submit" disabled={savingPwd} className="px-8 py-2.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all disabled:opacity-60">
                    {savingPwd ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center justify-between p-4 bg-surface-container-high">
                    <div>
                      <p className="font-mono text-sm font-bold text-on-surface">Two-Factor Authentication</p>
                      <p className="font-mono text-[10px] text-on-surface-variant">Add an extra layer of security</p>
                    </div>
                    <span className="px-2 py-0.5 bg-outline-variant/20 text-outline-variant font-mono text-[9px] uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'Notifications' && (
              <div className="space-y-4">
                {NOTIFICATION_SETTINGS.map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-5 bg-surface-container-high">
                    <div>
                      <p className="font-mono text-sm font-bold text-on-surface">{label}</p>
                      <p className="font-mono text-[10px] text-on-surface-variant mt-0.5">{desc}</p>
                    </div>
                    <label className="relative cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={notifs[key]}
                        onChange={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                      />
                      <div className="w-10 h-5 bg-surface-container-highest peer-checked:bg-primary transition-colors relative rounded-none after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-on-surface peer-checked:after:translate-x-5 after:transition-transform after:bg-on-primary peer-checked:after:bg-on-primary" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'Danger Zone' && (
              <div className="space-y-6">
                <div className="p-6 border border-error/20 bg-error-container/5">
                  <h3 className="font-headline font-bold text-lg text-error mb-2">Delete Account</h3>
                  <p className="font-mono text-xs text-on-surface-variant mb-6">
                    Permanently delete your operator account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2.5 bg-error-container text-on-error-container hover:bg-error font-mono text-xs uppercase tracking-widest font-bold transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </PageTransition>

        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Account"
          description="This will permanently delete your account, all reports, and earnings history. This cannot be undone."
          confirmLabel="Delete Forever"
        />
      </main>
    </div>
  )
}
