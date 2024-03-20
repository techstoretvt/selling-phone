import Link from 'next/link';

import styles from '../../styles/home/TopSearch.module.scss'
import Image from 'next/image';

const TopSearch = () => {
    return (
        <div className={styles['TopSearch-container']}>
            <div className={styles['TopSearch-content']}>
                <div className={styles['TopSearch-left']}>
                    <div className={styles['wrap']}>
                        <div className={styles['title']}>
                            Xu hướng tìm kiếm
                        </div>
                        <Link href={'/search?promotion=true'} className={styles['btn']}>
                            <div className={styles['btn-name']}>
                                Khuyến mãi
                            </div>
                            <div className={styles['btn-bg']}>

                            </div>
                        </Link>
                    </div>
                </div>
                <div data-aos="fade-left" className={styles['TopSearch-right']}>
                    <Link href={'/search?keyword=điện thoại'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/dienthoai.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Điện thoại
                        </div>
                    </Link>
                    <Link href={'/search?keyword=tai nghe'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/tainghe.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Tai nghe
                        </div>
                    </Link>
                    <Link href={'/search?keyword=chuột máy tính'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/chuot.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Chuột
                        </div>
                    </Link>
                    <Link href={'/search?keyword=bàn phím'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/banphim.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Bàn phím
                        </div>
                    </Link>
                    <Link href={'/search?keyword=đồng hồ'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/dongho.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Đồng hồ
                        </div>
                    </Link>
                    <Link href={'/search?keyword=loa'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/loa.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Loa
                        </div>
                    </Link>
                    <Link href={'/search?keyword=màn hình máy tính'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/manhinh.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Màn hình máy tính
                        </div>
                    </Link>
                    <Link href={'/search?keyword=sạc dự phòng'} className={styles['TopSearch-item']}>
                        <Image
                            src={'/images/home/top-search/pin.webp'}
                            width={200}
                            height={200}
                            alt=''
                            className={styles['image']}
                        />
                        <div className={styles['title']}>
                            Pin dự phòng
                        </div>
                    </Link>


                </div>
            </div>
        </div>
    )
}
export default TopSearch;