import Head from "next/head"
import styles from '../../styles/portal/portal.module.scss'
import HeaderBottom from '../../components/home/HeaderBottom'
import FooterHome from '../../components/home/FooterHome'


const Example = () => {

    return (
        <>
            <Head>
                <title>Ví dụ</title>
            </Head>
            <HeaderBottom />
            <div className={styles.Portal_container}>
                <h3>Giới thiệu</h3>
                <p>Trang giới thiệu giúp khách hàng hiểu rõ hơn về cửa hàng của bạn. Hãy cung cấp thông tin cụ thể về việc kinh doanh, về cửa hàng, thông tin liên hệ. Điều này sẽ giúp khách hàng cảm thấy tin tưởng khi mua hàng trên website của bạn.

                    Một vài gợi ý cho nội dung trang Giới thiệu:</p>


                <ul>
                    <li>Bạn là ai</li>
                    <li>Giá trị kinh doanh của bạn là gì</li>
                    <li>Địa chỉ cửa hàng</li>
                    <li>Bạn đã kinh doanh trong ngành hàng này bao lâu rồi</li>
                    <li>Bạn kinh doanh ngành hàng online được bao lâu</li>
                    <li>Đội ngũ của bạn gồm những ai</li>
                    <li>Thông tin liên hệ</li>
                    <li>Liên kết đến các trang mạng xã hội (Twitter, Facebook)</li>
                </ul>
                <p>Bạn có thể chỉnh sửa hoặc xoá bài viết này tại đây hoặc thêm những bài viết mới trong phần quản lý Trang nội dung.</p>

            </div>
            <FooterHome />
        </>
    )
}

export default Example