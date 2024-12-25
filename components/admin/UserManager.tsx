'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
/* import { toast } from "@/components/ui/use-toast" */

export default function UserManager() {
  const t = useTranslations('UserManager')
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (!response.ok) throw new Error('Failed to create user')
      await fetchUsers()
      setNewUser({
        username: '',
        email: '',
        password: '',
        role: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
      })
      toast({
        title: "Success",
        description: "User created successfully.",
      })
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')
      await fetchUsers()
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t('manageUsers')}</h2>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <Input
          type="text"
          placeholder={t('username')}
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder={t('email')}
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <Input
          type="password"
          placeholder={t('password')}
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <Select
          value={newUser.role}
          onValueChange={(value) => setNewUser({ ...newUser, role: value })}
          required
        >
          <option value="">{t('selectRole')}</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Select>
        <Input
          type="text"
          placeholder={t('firstName')}
          value={newUser.firstName}
          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
        />
        <Input
          type="text"
          placeholder={t('lastName')}
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />
        <Input
          type="tel"
          placeholder={t('phoneNumber')}
          value={newUser.phoneNumber}
          onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
        />
        <Button type="submit">{t('addUser')}</Button>
      </form>
      <ul className="space-y-2">
        {users.map((user: any) => (
          <li key={user._id} className="flex justify-between items-center">
            <span>{user.username} - {user.email} - {user.role}</span>
            <Button variant="destructive" onClick={() => handleDeleteUser(user._id)}>{t('delete')}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

