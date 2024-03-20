import styles from '../../styles/home/BannerHome.module.scss'
import Image from 'next/image';

const BannerHome = () => {

    return (
        <div className={styles.BannerHome_container}>
            {/* <div className={styles.navbar}>
                <Link href={'/blogs/all'} className={styles.item}>Bài viết</Link>
                <Link href={'/short-video/foryou'} className={styles.item}>Video ngắn</Link>
                <Link href={'/search?promotion=true'} className={styles.item}>Khuyến mãi</Link>
            </div> */}


            <div className={styles.content} >
                <div className={styles.left} data-aos="fade-right"
                    data-aos-offset="-110" data-aos-once={false}
                    data-aos-easing="ease-in-sine" >
                    <Image
                        src={'/images/home/banner/iphone.webp'}
                        alt='Anh dien thoai'
                        width={200}
                        height={200}
                    />
                </div>
                <div className={styles.right} >
                    <div className={styles.wrap_content}>
                        <div className={styles.title}>
                            <i className="fa-brands fa-apple"></i>
                            <div className={styles.text}>iPhone 14 Pro</div>
                        </div>
                        <div className={styles.title2}>
                            <div className={styles.text}>Pro.Beyond. Pro.Beyond</div>
                        </div>
                        <div className={styles.price}>
                            <div className={styles.text}>Giá gốc từ</div>
                            <div className={styles.number}>21.990.000đ</div>
                        </div>
                        <div className={styles.note}>Đăng ký mua ngay kẻo lở</div>
                        <div className={styles.note}>Mở bán từ 7/5</div>
                    </div>
                </div>
            </div >



        </div >
    )
}

export default BannerHome;