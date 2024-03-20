import Link from 'next/link'

import styles from '../../styles/home/ExhibitionImage3.module.scss'
const ExhibitionImage3 = () => {

    return (
        <div className={styles['ExhibitionImage3-container']} >
            <div className={styles['ExhibitionImage3-content']}>
                <Link href={'/search?keyword=tủ lạnh'} className={styles['ExhibitionImage3-img'] + ' ' + styles['img-1'] + ' ' + 'light-effect light-effect-flash'} data-aos="fade-right" data-aos-offset="300">

                </Link>
                <Link href={'/search?keyword=tủ lạnh'} className={styles['ExhibitionImage3-img'] + ' ' + styles['img-2'] + ' ' + 'light-effect light-effect-flash'} data-aos="fade-left" data-aos-offset="300">

                </Link>
            </div>
        </div>
    )
}
export default ExhibitionImage3