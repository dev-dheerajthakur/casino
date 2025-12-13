import React from 'react'
import Header from '../Header'
import Carousel from './components/Carousel'
import styles from './page.module.css'
import FilterSection from './components/FilterSection'
import Games from './components/Games'

export default function page() {
  return (
    <div className={styles.container}>
      <Header />
      <Carousel />
      <FilterSection />
      <Games />
    </div>
  )
}
