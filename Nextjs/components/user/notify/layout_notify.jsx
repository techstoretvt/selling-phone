import Image from 'next/image'
import styles from '../../../styles/user/notifycations/layout_notify.module.scss'
import Link from 'next/link'
import { Pagination } from 'antd';
import { Empty } from 'antd';

const Layout_notify = ({ listNotify }) => {

    return (
        <>
            <div className={styles.Layout_notify_container}>
                <div className={styles.list_notify}>
                    {
                        listNotify?.length > 0 ?
                            listNotify?.map((item, index) => {
                                return (
                                    <Link key={index} href={item.redirect_to} className={styles.item_notify}>
                                        <div className={styles.left}>
                                            <Image
                                                src={item.urlImage || '/images/logo/logo-icon.webp'}
                                                alt='sdfhjsdf'
                                                width={200}
                                                height={200}
                                            />
                                        </div>
                                        <div className={styles.right}>
                                            <div className={styles.title}>{item.title}</div>
                                            <div className={styles.content}>{item.content}</div>
                                        </div>
                                    </Link>
                                )
                            }) :
                            <Empty
                                style={{ marginTop: '50px' }}
                                description={<span style={{ color: '#fff' }}>Chưa có thông báo</span>}
                            />
                    }
                </div>
                {/* <div className={styles.pagination}>
                    <Pagination
                        current={1}
                        total={100}
                        showTitle={false}
                        showSizeChanger={false}
                    // onChange={handleChangePage}
                    />
                </div> */}
            </div>
        </>
    )
}

export default Layout_notify