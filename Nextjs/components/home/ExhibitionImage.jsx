import Link from "next/link"

import styles from '../../styles/home/ExhibitionImage.module.scss'
const ExhibitionImage = () => {

    return (
        <div className={styles['ExhibitionImage-container']} >
            <div className={styles['ExhibitionImage-content']}>
                <div className={styles.left} data-aos="fade-down-right" data-aos-offset="300" >
                    <Link href={'/search?keyword=điện thoại&brand=samsung'} className={styles.img1 + ' ' + 'light-effect light-effect-flash'}></Link>
                    <Link href={'/search?keyword=điện thoại&brand=apple'} className={styles.img2 + ' ' + 'light-effect light-effect-flash'}></Link>
                </div>
                <div className={styles.center} data-aos="zoom-in" data-aos-duration="3000" >
                    {/* <h2>Welcome to the website</h2> */}
                    {/* <p>
                        Thanks for your visit, have a nice day.
                    </p> */}
                </div>
                <div className={styles.right} data-aos="fade-down-left" data-aos-offset="300" >
                    <Link href={'/search?keyword=laptop&brand=acus'} className={styles.img1 + ' ' + 'light-effect light-effect-flash'}></Link>
                    <Link href={'/search?keyword=điện thoại&brand=xiaomi'} className={styles.img2 + ' ' + 'light-effect light-effect-flash'}></Link>
                </div>
            </div>
        </div>
    )
}

export default ExhibitionImage