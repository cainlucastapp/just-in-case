// client/src/pages/AccountPage.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeleteAccountDialog } from '../components/account/DeleteAccountDialog'
import { PasswordForm } from '../components/account/PasswordForm'
import { ProfileForm } from '../components/account/ProfileForm'
import { useAuth } from '../context/auth-context'
import { changePassword, deleteAccount, updateProfile } from '../services/auth'
import '../styles/account.css'

export function AccountPage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)

  // save profile
  async function handleSaveProfile(values) {
    const updated = await updateProfile(values)
    updateUser(updated)
  }

  // change password
  async function handleChangePassword(values) {
    await changePassword(values)
  }

  // delete account
  async function handleDelete(currentPassword) {
    await deleteAccount(currentPassword)
    logout()
    navigate('/')
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Account</h1>
          <p>Update your profile or password.</p>
        </div>
      </div>

      <div className="account-form-card card">
        <h2>Profile</h2>
        <ProfileForm initialValues={user} onSubmit={handleSaveProfile} />
      </div>

      <div className="account-form-card card">
        <h2>Change Password</h2>
        <PasswordForm onSubmit={handleChangePassword} />
      </div>

      <div className="danger-zone card">
        <h2>Danger Zone</h2>
        <p>Permanently delete your account, along with every case and item you own.</p>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => setIsDeleting(true)}
        >
          Delete Account
        </button>
      </div>

      {isDeleting && (
        <DeleteAccountDialog
          onConfirm={handleDelete}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}
