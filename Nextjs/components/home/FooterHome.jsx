import Link from 'next/link';

import styles from '../../styles/home/FooterHome.module.scss';
import classNames from 'classnames';
import { nameWeb, addressContact, copyBy } from '../../utils/constants';

const FooterHome = ({ unShow }) => {
    return (
        <div
            className={classNames(styles['FooterHome-containet'], {
                unShow: unShow,
            })}
        >
            <div className={styles['FooterHome-content']}>
                <div className={styles['FooterHome-top']}></div>
                <div className={styles['FooterHome-center']}>
                    <div className={styles['item'] + ' ' + styles['about']}>
                        <div className={styles['title']}>Về {nameWeb}</div>
                        <div className={styles['text']}>
                            Với các giải pháp công nghệ tốt nhất, {nameWeb} là
                            tất cả những gì bạn cần để xây dựng thương hiệu
                            online, thành công trong bán lẻ và marketing đột
                            phá.
                        </div>
                        <div className={styles['icons']}>
                            <div className={styles['icon']}>
                                <Link
                                    href={
                                        'https://www.facebook.com/tranv.thoai.7'
                                    }
                                    target="_blank"
                                >
                                    <i className="fa-brands fa-facebook-f"></i>
                                </Link>
                            </div>
                            <div className={styles['icon']}>
                                <Link
                                    href={'https://twitter.com/vanthoai2565'}
                                    target="_blank"
                                >
                                    <i className="fa-brands fa-twitter"></i>
                                </Link>
                            </div>
                            <div className={styles['icon']}>
                                <Link
                                    href={
                                        'https://www.instagram.com/tranv.thoai.7/'
                                    }
                                    target="_blank"
                                >
                                    <i className="fa-brands fa-instagram"></i>
                                </Link>
                            </div>
                            <div className={styles['icon']}>
                                <Link
                                    href={
                                        'https://www.youtube.com/channel/UCkZnl8TbflRwT5qaBBtthmA'
                                    }
                                    target="_blank"
                                >
                                    <i className="fa-brands fa-youtube"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={styles['item'] + ' ' + styles['contact']}>
                        <div className={styles['title']}>Thông tin liên hệ</div>
                        <div className={styles['address']}>
                            <i className="fa-solid fa-location-dot"></i>
                            <Link
                                href={'/portal/contact'}
                                style={{ display: 'inline-block' }}
                            >
                                {addressContact}
                            </Link>
                        </div>
                        <div className={styles['phongnumber']}>
                            <i className="fa-solid fa-phone"></i>
                            1900.000.XXX
                        </div>
                        <div className={styles['email']}>
                            <i className="fa-solid fa-envelope"></i>
                            {nameWeb}2565@gmail.com
                        </div>
                    </div>
                    <div className={styles['item'] + ' ' + styles['support']}>
                        <div className={styles['title']}>Hỗ trợ khách hàng</div>
                        <ul>
                            <li>
                                <Link href={'/home'}>Tìm kiếm</Link>
                            </li>
                            <li>
                                <Link href={'/home'}>Giới thiệu</Link>
                            </li>
                            <li>
                                <Link href={'/home'}>Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link href={'/home'}>Chính sách bảo mật</Link>
                            </li>
                            <li>
                                <Link href={'/home'}>Điều khoản dịch vụ</Link>
                            </li>
                            <li>
                                <Link href={'/portal/contact'}>Liên hệ</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles['item'] + ' ' + styles['link']}>
                        <div className={styles['title']}>Liên kết</div>
                        <ul>
                            <li>
                                <Link href={'/home'}>Sản phẩm khuyến mãi</Link>
                            </li>
                            <li>
                                <Link
                                    href={
                                        'https://webrtc-react-five.vercel.app'
                                    }
                                >
                                    WebRTC
                                </Link>
                            </li>
                            <li>
                                <Link href={'/app'}>Download App</Link>
                            </li>
                            <li>
                                <Link href={'/ai'}>AI nhận dạng</Link>
                            </li>
                            <li>
                                <Link href={'/blogs/all'}>Bài viết</Link>
                            </li>
                            <li>
                                <Link href={'/short-video/foryou'}>
                                    Video ngắn
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles['item'] + ' ' + styles['link']}>
                        <div className={styles['title']}>Chính sách</div>
                        <ul>
                            <li>
                                <Link href={'/home'}>Chính sách đổi trả</Link>
                            </li>
                            <li>
                                <Link href={'/home'}>Chính sách bán hàng</Link>
                            </li>
                            <li>
                                <Link href={'/home'}>Chính sách giao hàng</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles['FooterHome-bottom']}>
                    Copyright © 2022 {nameWeb}.{' '}
                    <Link href={'/home'}>Powered by {copyBy}</Link>
                </div>
            </div>
        </div>
    );
};
export default FooterHome;
