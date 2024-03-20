import Head from "next/head";
import styles from "../../styles/portal/portal.module.scss";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import Link from "next/link";
import Image from "next/image";

const Example = () => {
  return (
    <>
      <Head>
        <title>Giới thiệu</title>
      </Head>
      <HeaderBottom />
      <div className={styles.Portal_container}>
        <h2>Giới thiệu</h2>
        <p>
          Trang giới thiệu giúp khách hàng hiểu rõ hơn về cửa hàng của bạn. Hãy
          cung cấp thông tin cụ thể về việc kinh doanh, về cửa hàng, thông tin
          liên hệ. Điều này sẽ giúp khách hàng cảm thấy tin tưởng khi mua hàng
          trên website của bạn. Một vài gợi ý cho nội dung trang Giới thiệu:
        </p>

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
        <p>
          Bạn có thể chỉnh sửa hoặc xoá bài viết này tại
          <Link href={"/home"} className={styles.thea}>
            {" "}
            đây{" "}
          </Link>
          hoặc thêm những bài viết mới trong phần quản lý Trang nội dung.
        </p>

        <img
          src="https://d1iv5z3ivlqga1.cloudfront.net/wp-content/uploads/2021/01/30163712/cac-the-html-co-ban-5.jpg"
          alt="dfsdf"
          className={styles.anh_1}
        />
      </div>
      <FooterHome />
    </>
  );
};

export default Example;
