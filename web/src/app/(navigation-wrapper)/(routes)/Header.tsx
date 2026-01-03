"use server"
import React from 'react'
import styles from './header.module.css'
import { AlarmSmoke } from 'lucide-react'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'

export default async function Header() {
  const headerStore = await headers();
  const isValidUser = headerStore.get("x-user-valid")==="true";

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <AlarmSmoke size={30} />
        <h3>Casino</h3>
      </div>
      {
        isValidUser?
          <div>
            Profile
          </div>
        :
          <div>
            <Link className={styles.button} color="success" href='/login'>Sign In</Link>
            <Link className={styles.button} style={{marginLeft: 10}} color="success" href='/register'>Sign Up</Link>
          </div>
        
      }
    </div>
  )
}
