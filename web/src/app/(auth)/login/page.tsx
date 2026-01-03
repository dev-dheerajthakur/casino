import React from 'react'
import LoginForm from './components/client/LoginForm'
import { handleLoging } from './api/route'

export default function page() {
  return (
    <div>
      <LoginForm onSubmit={handleLoging} />
    </div>
  )
}
