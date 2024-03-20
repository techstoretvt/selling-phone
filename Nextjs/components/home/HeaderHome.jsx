import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import HeaderTop from "./HeaderTop";
import HeaderBottom from "./HeaderBottom";
import { useMediaQuery } from "react-responsive";
import styles from "../../styles/home/HeaderHome.module.scss";

// import actionTypes from '../../store/actions/actionTypes'

// import { getLogin } from '../../store/actions/userAction'
// import { getListCartUser, GetUserLogin, GetUserLoginRefreshToken } from '../../services/userService'

// import { useDispatch, useSelector } from "react-redux";

var currenScrollY;
if (typeof window !== "undefined") {
  currenScrollY = window.scrollY;
} else {
  // console.log('ko co');
}

const HeaderHome = (props) => {
  const [IsShowHeader, setIsShowHeader] = useState(false);
  const isScreen500 = useMediaQuery({ query: "(max-width: 800px)" });

  let preScrollY = useRef(currenScrollY);

  //effect scoll header
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    var vitri = window.scrollY;

    if (vitri < 200) {
      setIsShowHeader(false);
      preScrollY.current = vitri;
    } else {
      if (vitri >= preScrollY.current) {
        setIsShowHeader(false);
        // if (vitri < preScrollY.current) {
        //     if (IsShowHeader) {
        //         setIsShowHeader(true);
        //     }
        // }
        preScrollY.current = vitri;
      } else {
        setIsShowHeader(true);
        preScrollY.current = vitri;
        // setTimeout(() => {
        // }, 500);
      }
    }
  };

  return (
    <>
      <Head>
        {/* <link rel="stylesheet" href="/css/home/HeaderHome.css" /> */}
      </Head>
      <div className={styles.wrap_headerHome}>
        <div
          className={
            IsShowHeader === true && !isScreen500
              ? styles["header-home"] + " " + styles["active"]
              : styles["header-home"]
          }
        >
          {props.isTop && <HeaderTop />}
          <HeaderBottom {...props} />
        </div>
      </div>
    </>
  );
};
export default React.memo(HeaderHome);
