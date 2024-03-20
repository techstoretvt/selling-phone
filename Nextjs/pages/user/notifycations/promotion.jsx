import Head from "next/head"
import LayoutAccount from '../../../components/user/account/layoutAccount'
import styles from '../../../styles/user/notifycations/order.module.scss'
import Layout_notify from '../../../components/user/notify/layout_notify'
import { useSelector } from "react-redux"
import { Pagination } from 'antd';
import { useEffect, useState } from "react"
import { getListNotifyByPage } from '../../../services/userService'

const Notify_order = () => {
    const accessToken = useSelector(state => state.user.accessToken)
    const [currentPage, setCurrentPage] = useState(1)
    const [listNotify, setListNotify] = useState([])
    const [countPage, setCountPage] = useState(10)

    useEffect(() => {
        getListNotify()
    }, [currentPage])

    const getListNotify = async () => {
        setListNotify([])
        setCountPage(10)
        let res = await getListNotifyByPage({
            accessToken,
            page: currentPage,
            type: 'promotion'
        })

        console.log(res);
        if (res?.errCode === 0) {
            setListNotify(res.data)
            let count = (Math.floor((res.count - 1) / 20) + 1) * 10
            setCountPage(count)
        }
    }

    const handleChangePage = (page, value) => {
        setCurrentPage(page)
    }
    return (
        <>
            <Head>
                <title>Thông báo</title>
            </Head>
            <LayoutAccount sub={'promotion'} defaultOpen={'notify'}>
                <div className={styles.Notify_order_container}>
                    <Layout_notify listNotify={listNotify} />
                    <div className={styles.pagination} style={{
                        backgroundColor: '#fff',
                        width: 'fit-content',
                        margin: '30px auto 0',
                        borderRadius: '4px'
                    }}>
                        {
                            countPage >= 20 &&
                            <Pagination
                                current={currentPage}
                                total={countPage}
                                showTitle={false}
                                showSizeChanger={false}
                                onChange={handleChangePage}
                            />
                        }
                    </div>
                </div>
            </LayoutAccount>
        </>
    )
}

export default Notify_order