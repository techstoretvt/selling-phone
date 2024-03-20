import Link from "next/link";
import styles from "../styles/404.module.scss";
import Head from "next/head";

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>NOT FOUND</title>
      </Head>
      <div className={styles.NotFoundPage_container}>
        <div className={styles.NotFoundPage_content}>
          <header className={styles["top-header"]}></header>

          <div>
            <div className={styles["starsec"]}></div>
            <div className={styles["starthird"]}></div>
            <div className={styles["starfourth"]}></div>
            <div className={styles["starfifth"]}></div>
          </div>

          <div className={styles["lamp__wrap"]}>
            <div className={styles["lamp"]}>
              <div className={styles["cable"]}></div>
              <div className={styles["cover"]}></div>
              <div className={styles["in-cover"]}>
                <div className={styles["bulb"]}></div>
              </div>
              <div className={styles["light"]}></div>
            </div>
          </div>
          <section className={styles["error"]}>
            <div className={styles["error__content"]}>
              <div className={styles["error__message message"]}>
                <h1 className={styles["message__title"]}>Page Not Found</h1>
                <p className={styles["message__text"]}>
                  We`re sorry, the page you were looking for isn`t found here.
                  The link you followed may either be broken or no longer
                  exists. Please try again, or take a look at our.
                </p>
              </div>
              <div className={styles["error__nav e-nav"]}>
                <Link href="/home" className={styles["e-nav__link"]}></Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
