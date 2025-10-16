import React from 'react'
import styles from './Navbar.module.css'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <>
    <div className={styles.class_header_sticky}>
    <div className="container">
     <div className="row">
       <div className="col-lg-12">
       <nav>
            <ul>
                <li className={styles.class_has_dropdown}>
                    <Link href="#">Categories</Link>
                    <ul className={styles.class_submenu}>
                        <li><Link href="ProductList">Grains, Rice & Pulses</Link></li>
                        <li><Link href="ProductList">Grains, Rice & Pulses</Link></li>
                        <li><Link href="ProductList">Grains, Rice & Pulses</Link></li>
                        <li><Link href="ProductList">Grains, Rice & Pulses</Link></li>
                        <li><Link href="ProductList">Grains, Rice & Pulses</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
       </div>
     </div>
    </div>
</div>
    </>
  )
}

export default Navbar