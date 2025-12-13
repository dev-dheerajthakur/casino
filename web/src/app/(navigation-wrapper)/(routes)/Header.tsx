"use client"
import React from 'react'
import styles from './header.module.css'
import { AlarmSmoke } from 'lucide-react'
import { Button, Link } from '@mui/material'

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <AlarmSmoke size={30} />
        <h3>Casino</h3>
      </div>
      <div>
        <Button className={styles.button} variant="outlined" color="success" href='/login'>Sign In</Button>
        <Button className={styles.button} style={{marginLeft: 10}} variant="contained" color="success" href='/register'>Sign Up</Button>
      </div>
    </div>
  )
}
