import Link from "next/link";

import styles from "../../styles/login/HeaderLogin.module.scss";

const HeaderLogin = () => {
  return (
    <div className={styles["HeaderLogin-container"]}>
      <div className={styles["HeaderLogin-content"]}>
        <Link href={"/home"} className={styles["HeaderLogin-logo"]}></Link>
      </div>
    </div>
  );
};

export default HeaderLogin;
