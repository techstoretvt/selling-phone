import Head from "next/head";
import Link from "next/link";
import HeaderBottom from "../../home/HeaderBottom";
import styles from "../../../styles/user/account/LayoutAccount.module.scss";
import { Menu } from "antd";
import { useRouter } from "next/router";
import FooterHome from "../../../components/home/FooterHome";
import { useState } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkLogin } from "../../../services/common";
import Background from "../../background";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem(
    "Tài khoản của tôi",
    "account",
    <i className="fa-regular fa-user" style={{ color: "blue" }}></i>,
    [
      getItem(
        <Link href={"/user/account/profile?sub=profile"}>Hồ sơ</Link>,
        "profile"
      ),
      getItem(<Link href={"/user/purchase"}>Đơn mua</Link>, "purchase"),
      getItem(<Link href={"/cart"}>Giỏ hàng</Link>, "cart"),
      getItem(
        <Link href="/user/account/address?sub=address">Địa chỉ</Link>,
        "address"
      ),

      getItem(
        <Link href="/user/account/changepass?sub=changepass">
          Đổi mật khẩu
        </Link>,
        "changepass"
      ),
    ]
  ),
  // getItem(
  //   <Link href={"/user/purchase"}>Đơn mua</Link>,
  //   "donmua",
  //   <i
  //     className="fa-solid fa-clipboard-list"
  //     style={{ color: "rgb(149,177,237)" }}
  //   ></i>
  // ),
  getItem(
    "Bài viết",
    "blog",
    <i className="fa-solid fa-book" style={{ color: "orange" }}></i>,
    [
      getItem(<Link href="/blogs/new">Tạo bài viết</Link>, "createBlog"),
      getItem(<Link href="/blogs/blog-user">Bài viết của tôi</Link>, "blog"),
      getItem(
        <Link href="/blogs/save-blog">Bài viết đã lưu</Link>,
        "save_blog"
      ),
    ]
  ),
  getItem(
    "Video",
    "video",
    <i className="fa-solid fa-video" style={{ color: "orangered" }}></i>,
    [
      getItem(
        <Link href="/short-video/new">Tạo video mới</Link>,
        "createVideo"
      ),
      getItem(<Link href="/short-video/user">Video của tôi</Link>, "myVideo"),
    ]
  ),
  getItem(
    "Thông báo",
    "notify",
    <i className="fa-regular fa-bell" style={{ color: "red" }}></i>,
    [
      getItem(
        <Link href="/user/notifycations/order">Cập nhật đơn hàng</Link>,
        "donhang"
      ),
      getItem(
        <Link href="/user/notifycations/system">Hệ thống</Link>,
        "system"
      ),
      getItem(
        <Link href="/user/notifycations/promotion">Khuyến mãi</Link>,
        "promotion"
      ),
      getItem(
        <Link href="/user/notifycations/short-video">
          Thông báo Short video
        </Link>,
        "short_video"
      ),
      getItem(
        <Link href="/user/notifycations/blog">Thông báo Bài viết</Link>,
        "blog_notify"
      ),
    ]
  ),
];
const LayoutAccount = ({ children, sub, defaultOpen }) => {
  const router = useRouter();
  const [showMenuMobile, setShowMenuMobile] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin(accessToken, refreshToken, dispatch).then((res) => {
      if (!res) {
        router.push("/home");
      }
    });
  }, []);

  const renderAvatar = () => {
    if (!currentUser) return;
    if (currentUser.avatarUpdate) {
      return { backgroundImage: `url(${currentUser.avatarUpdate})` };
    }
    if (currentUser?.typeAccount === "google") {
      return { backgroundImage: `url(${currentUser.avatarGoogle})` };
    }
    if (currentUser?.typeAccount === "facebook") {
      return { backgroundImage: `url(${currentUser.avatarFacebook})` };
    }
    if (currentUser?.typeAccount === "github") {
      return { backgroundImage: `url(${currentUser.avatarGithub})` };
    }
    if (
      currentUser?.typeAccount === "web" &&
      currentUser?.avatar !== null &&
      currentUser?.avatar !== ""
    ) {
      return { backgroundImage: `url(${currentUser.avatar})` };
    }
    // return {}
  };

  const handleOnclickMenu = (e) => {
    console.log(e.key);
    // return
    switch (
      e.key
      // case 'profile':
      //     router.push(`/user/account/profile?sub=profile`)
      //     break
      // case 'address':
      //     router.push(`/user/account/address?sub=address`)
      //     break
      // case 'changepass':
      //     router.push(`/user/account/changepass?sub=changepass`)
      //     break
      // case 'blog':
      //     router.push(`/blogs/blog-user`)
      //     break
      // case 'createBlog':
      //     router.push(`/blogs/new`)
      //     break
    ) {
    }
  };

  return (
    <>
      <Head>
        <title>Tài khoản</title>
      </Head>
      <HeaderBottom />
      <div className={styles.account_container}>
        <div className={styles.account_content}>
          <div
            className={classNames(styles.left, {
              [styles.active]: showMenuMobile,
            })}
          >
            <div className={styles.Wrap_avatar}>
              <div className={styles.left} style={renderAvatar()}></div>
              <div className={styles.right}>
                <div className={styles.name}>
                  {currentUser &&
                    currentUser.firstName + " " + currentUser.lastName}
                </div>
                <Link
                  href={"/user/account/profile?sub=profile"}
                  className={styles.edit}
                >
                  <i className="fa-solid fa-pencil"></i>
                  <div>Sửa hồ sơ</div>
                </Link>
              </div>
            </div>
            <div className={styles.navbar}>
              {sub && (
                <Menu
                  onClick={handleOnclickMenu}
                  style={{
                    width: "100%",
                    backgroundColor: "#0b0b0b",
                    color: "#fff",
                  }}
                  defaultSelectedKeys={[`${sub}`]}
                  defaultOpenKeys={[defaultOpen ?? "account"]}
                  mode="inline"
                  items={items}
                />
              )}
            </div>
            <div
              className={styles.icon_close_mobile}
              onClick={() => setShowMenuMobile(false)}
            >
              <i className="fa-solid fa-angles-right"></i>
            </div>
          </div>
          <div className={styles.right}>{children}</div>
          <div className={styles.iconMenuMobile}>
            <i
              className="fa-solid fa-bars"
              onClick={() => setShowMenuMobile(true)}
            ></i>
          </div>
        </div>
      </div>
      <Background />
      <FooterHome />
    </>
  );
};
export default LayoutAccount;
