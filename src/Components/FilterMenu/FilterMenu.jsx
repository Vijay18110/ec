import React from 'react'
import styles from './FilterMenu.module.css'
const FilterMenu = () => {
  return (
    <>
      <div className={styles.shopgridsidebararea}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className={styles.filterselectarea}>
                <div className={styles.singleselectfilter}>
                  <strong>Filter</strong>
                </div>
                <div className={styles.singleselect}>
                  <select className={styles.niceselect} id="fruit">
                    <option value="">All Categories</option>
                    <option value="apple">Apple</option>
                    <option value="banana">Banana</option>
                    <option value="mango">Mango</option>
                  </select>
                </div>
                <div className={styles.singleselect}>
                  <select className={styles.niceselect} id="fruit">
                    <option value="">All Brands</option>
                    <option value="apple">Apple</option>
                    <option value="banana">Banana</option>
                    <option value="mango">Mango</option>
                  </select>
                </div>
                <div className={styles.singleselect}>
                  <select className={styles.niceselect} id="fruit">
                    <option value="">All Size</option>
                    <option value="apple">Apple</option>
                    <option value="banana">Banana</option>
                    <option value="mango">Mango</option>
                  </select>
                </div>
                <div className={styles.singleselect}>
                  <select className={styles.niceselect} id="fruit">
                    <option value="">All Weight</option>
                    <option value="apple">Apple</option>
                    <option value="banana">Banana</option>
                    <option value="mango">Mango</option>
                  </select>
                </div>
                <div className={`${styles.singleselect} ${styles.sortby}`}>
                  <select className={styles.niceselect} id="fruit">
                    <option value="">Sort By</option>
                    <option value="apple">Apple</option>
                    <option value="banana">Banana</option>
                    <option value="mango">Mango</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>   
    </>
  )
}

export default FilterMenu