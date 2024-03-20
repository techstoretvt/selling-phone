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
                <h3>Điều khoản dịch vụ</h3>
                <b>1. Giới thiệu</b>
                <div>Chào mừng quý khách hàng đến với website chúng tôi.</div>
                <div>Khi quý khách hàng truy cập vào trang website của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước. Và khi quý khách tiếp tục sử dụng trang web, sau khi các thay đổi về Điều khoản này được đăng tải, có nghĩa là quý khách chấp nhận với những thay đổi đó.</div>
                <div>Quý khách hàng vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.</div>
                <b>2. Hướng dẫn sử dụng website</b>
                <div>Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực hiện các giao dịch mua bán hàng hóa theo quy định hiện hành của pháp luật Việt Nam.</div>
                <div>Trong suốt quá trình đăng ký, quý khách đồng ý nhận email quảng cáo từ website. Nếu không muốn tiếp tục nhận mail, quý khách có thể từ chối bằng cách nhấp vào đường link ở dưới cùng trong mọi email quảng cáo.</div>
                <b>3. Thanh toán an toàn và tiện lợi</b>
                <div>Người mua có thể tham khảo các phương thức thanh toán sau đây và lựa chọn áp dụng phương thức phù hợp:</div>
                <div>Cách 1: Thanh toán trực tiếp (người mua nhận hàng tại địa chỉ người bán)</div>
                <div>Cách 2: Thanh toán sau (COD – giao hàng và thu tiền tận nơi)</div>
                <div>Cách 3: Thanh toán online qua thẻ tín dụng, chuyển khoản</div>


            </div>
            <FooterHome />
        </>
    )
}

export default Example