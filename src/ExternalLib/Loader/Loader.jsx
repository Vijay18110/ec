import React from 'react'
import { Commet } from 'react-loading-indicators'
import styles from './Loader.module.css'
const Loader = () => {
  return (
    <div className={styles.Loaderoverlay} >
      <Commet color="#8a934f" size="large" text="RAV Download" textColor="" />
    </div>
  )
}
export default Loader