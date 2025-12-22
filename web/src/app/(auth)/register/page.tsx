import React from 'react'
import RegisterForm from './components/client/RegisterForm'
import { handlerRegister } from './api/route'

export default async function page() {
  return (
    <div style={{height: "100dvh"}}>
      <RegisterForm onSubmit={handlerRegister} />
    </div>
  )
}
