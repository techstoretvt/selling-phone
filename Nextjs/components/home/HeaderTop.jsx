import Head from "next/head";
import Link from "next/link";

import styles from "../../styles/home/HeaderTop.module.scss";

const HeaderTop = () => {
  return (
    <>
      <Head>
        {/* <link href='/css/home/HeaderTop.css' rel='stylesheet' /> */}
      </Head>
      <div className={styles["header-top-container"]}>
        <div className={styles["header-top-content"]}>
          <div className={styles["left"]}>
            Hotline:{" "}
            <b>
              <a href="tel:+945910084">0945910084</a>
            </b>{" "}
            (8h - 12h, 13h30 - 17h)
          </div>
          <div className={styles["right"]}>
            <Link href="/a">
              <span></span>
              Hệ thống cửa hàng
            </Link>
            <Link href="/home">Cài đặt</Link>
            <Link href="/home">Liên hệ</Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default HeaderTop;
