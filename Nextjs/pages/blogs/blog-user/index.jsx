import Head from "next/head";
import HeaderBottom from "../../../components/home/HeaderBottom";
import FooterHome from "../../../components/home/FooterHome";
import styles from "../../../styles/blogs/blogUser.module.scss";
import {
  getBlogUserByPage,
  deleteBlogUserById,
  editContentBlogUserById,
} from "../../../services/userService";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import BlogDefault from "../../../components/blogs/blog-user/blog_default";
import BlogProduct from "../../../components/blogs/blog-user/blog_product";
import BlogShareDefault from "../../../components/blogs/blog-user/blog_share_default";
import BlogShareProduct from "../../../components/blogs/blog-user/blog_share_product";
import { Pagination } from "antd";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import LoadingBar from "react-top-loading-bar";
import { checkWord, checkLogin } from "../../../services/common";
import { Empty } from "antd";
var io = require("socket.io-client");
import jwt_decode from "jwt-decode";
let socket;
import Background from "../../../components/background";
import Link from "next/link";
import { nameWeb } from "../../../utils/constants";

const BtnMoreBlog = ({ id }) => {
  return (
    <Link href={`/blogs/detail-blog/${id}`} className={styles.BtnMoreBlog}>
      <button className={styles["cta"]}>
        <span className={styles["span"]}>Xem bài viết</span>
        <span className={styles["second"]}>
          <svg
            width="50px"
            height="20px"
            viewBox="0 0 66 43"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              id="arrow"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <path
                className={styles["one"]}
                d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
              <path
                className={styles["two"]}
                d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
              <path
                className={styles["three"]}
                d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
            </g>
          </svg>
        </span>
      </button>
    </Link>
  );
};

const BlogUser = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { page } = router.query;
  const [listBlog, setListBlog] = useState([]);
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const [countPage, setCountPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListBlog();
  }, [page, accessToken]);

  useEffect(() => {
    //  check login
    checkLogin(accessToken, refreshToken, dispatch).then((res) => {
      if (!res) {
        router.push("/home");
      }
    });
  }, [accessToken, refreshToken, dispatch, router]);

  useEffect(() => {
    // connect socket
    if (accessToken) {
      // console.log('vao');
      let decode = jwt_decode(accessToken);

      socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
        reconnect: true,
      });
      socket.on(`refresh-data-blog-user-${decode?.id}`, function (data) {
        getListBlog();
      });
    }

    return () => {
      // console.log('disconnect');
      if (accessToken) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (page) setCurrentPage(+page);
  }, [page]);

  const getListBlog = async () => {
    // if (!page) return
    setProgress(90);
    setLoading(true);
    let res = await getBlogUserByPage({
      accessToken,
      page: page || "1",
    });
    console.log(res.data);
    if (res && res.errCode === 0) {
      setListBlog(res.data);
      let count = (Math.floor((res.count - 1) / 10) + 1) * 10;
      setCountPage(count);
      setProgress(100);
    }
    setLoading(false);
  };

  const handleChangePage = (page, pageSize) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page);
    router.push(`/blogs/blog-user?${searchParams}`);
    setCurrentPage(page);
  };

  const handleDeleteBlog = async (idBlog, idBlogShare) => {
    if (!idBlog) return;

    Swal.fire({
      title: "Bạn có muốn xóa bài viết này?",
      showDenyButton: true,
      confirmButtonText: "Hủy",
      denyButtonText: `Xóa`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("hủy");
      } else if (result.isDenied) {
        console.log("xóa");
        setProgress(90);
        let res = await deleteBlogUserById({
          accessToken,
          idBlog,
          idBlogShare,
        });
        console.log(res);
        if (res && res.errCode === 0) {
          getListBlog();
          setProgress(100);
        } else {
          setProgress(100);
          toast.error(res?.errMessage || "Có lỗi xảy ra!");
        }
      }
    });
  };

  const editContentBlog = async (idBlog, contentOld) => {
    Swal.fire({
      title: "Chỉnh sửa",
      input: "textarea",
      width: 600,
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Nội dung bài viết...",
        style: "color: #fff",
      },
      color: "#fff",
      inputValue: contentOld,
      showCancelButton: true,
      confirmButtonText: "Chia sẻ",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      text: "Điều chỉnh nội dung của bài viết",
      size: "medium",
      background: "#222",
      preConfirm: async (value) => {
        if (!value) {
          toast.warning("Vui lòng nhập nội dung chia sẻ!");
          return false;
        } else if (!checkWord(value)) {
          toast.warning("Nội dung có chứa 1 số từ bị cấm trên hệ thống!");
          return false;
        } else {
          setProgress(90);
          let res = await editContentBlogUserById({
            accessToken,
            idBlog,
            content: value,
          });
          if (res && res.errCode === 0) {
            getListBlog();
            setProgress(100);
          } else {
            setProgress(100);
            toast.error(res?.errMessage || "Có lỗi xảy ra!");
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <>
      <Head>
        <title>Bài viết của tôi | {nameWeb}</title>
      </Head>
      <HeaderBottom hideSearch={false} />
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles.BlogUser_container}>
        <div className={styles.header}>
          <div className={styles.left}>
            <h2>Bài viết của tôi</h2>
            <p>Danh sách bài viết đã tạo</p>
          </div>
          <div className={styles.right}>
            <div className={styles.btn}>
              <div className={styles["btn-container"]}>
                <button
                  type="submit"
                  name="space-button"
                  id={styles["space-btn"]}
                  onClick={() => router.push("/blogs/new")}
                >
                  <span>Tạo bài viết</span>
                  <span className={styles["moon"]}>
                    <span className={styles["moon1"]}></span>
                  </span>
                  <span className={styles["planet"]}></span>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "119.273px",
                      top: "18.0747px",
                      animationDelay: "3.37051s",
                      transform: "scale(1.1)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "22.2022px",
                      top: "10.69534px",
                      animationDelay: "4.9s",
                      transform: "scale(2.22)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "14.754px",
                      top: "25.2924px",
                      animationDelay: "0.05s",
                      transform: "scale(0.1)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "95.948px",
                      top: "54.8942px",
                      animationDelay: "3.1s",
                      transform: "scale(1.87)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "184.622px",
                      top: "20.0923px",
                      animationDelay: "2.8s",
                      transform: "scale(1.77)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "142.1px",
                      top: "22.3542px",
                      animationDelay: "2.73988s",
                      transform: "scale(1.62715)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "145.079px",
                      top: "6.97553px",
                      animationDelay: "0.0408754s",
                      transform: "scale(0.468075)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "42.2308px",
                      top: "9.78383px",
                      animationDelay: "4.58407s",
                      transform: "scale(0.0422065)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "91.2734px",
                      top: "14.0408px",
                      animationDelay: "2.05927s",
                      transform: "scale(0.11997)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "35.6985px",
                      top: "52.6403px",
                      animationDelay: "3.07343s",
                      transform: "scale(0.672992)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "76.4191px",
                      top: "48.453px",
                      animationDelay: "2.35679s",
                      transform: "scale(2.001)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "154.027px",
                      top: "45.9848px",
                      animationDelay: "3.723s",
                      transform: "scale(1.4118)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "110.241px",
                      top: "20.2684px",
                      animationDelay: "2.94906s",
                      transform: "scale(1.2193)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "12.602px",
                      top: "19.8836px",
                      animationDelay: "4.072s",
                      transform: "scale(1.49026)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "30.0911px",
                      top: "37.9746px",
                      animationDelay: "1.02002s",
                      transform: "scale(1.41008)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "62.3096px",
                      top: "9.64604px",
                      animationDelay: "3.9445s",
                      transform: "scale(0.231214)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "44.7189px",
                      top: "32.4307px",
                      animationDelay: "4.78921s",
                      transform: "scale(0.359408)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "191.866px",
                      top: "27.151px",
                      animationDelay: "1.34451s",
                      transform: "scale(1.13484)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "47.6744px",
                      top: "3.00604px",
                      animationDelay: "1.04567s",
                      transform: "scale(0.682023)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "98.6225px",
                      top: "49.6115px",
                      animationDelay: "2.41384s",
                      transform: "scale(1.96254)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "57.4785px",
                      top: "29.6588px",
                      animationDelay: "3.3569s",
                      transform: "scale(1.53118)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "13.2213px",
                      top: "24.538px",
                      animationDelay: "1.69582s",
                      transform: "scale(1.6236)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "56.9067px",
                      top: "51.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "139.8361px",
                      top: "45.3876px",
                      animationDelay: "1.28648s",
                      transform: "scale(0.566118)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 40.9067px",
                      top: "21.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 30.9067px",
                      top: "26.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 30.9067px",
                      top: "16.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 20.9067px",
                      top: "10.904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 40.9067px",
                      top: "8.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "80.9067px",
                      top: "8.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "100.9067px",
                      top: "6.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      left: "130.9067px",
                      top: "8.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(0.749788)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 80.9067px",
                      top: "5.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(1.9999998)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 45.9067px",
                      top: "35.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(1.999998)",
                    }}
                  ></div>
                  <div
                    className={styles["star"]}
                    style={{
                      right: " 85.9067px",
                      top: "44.9904px",
                      animationDelay: "4.74375s",
                      transform: "scale(1.99998998)",
                    }}
                  ></div>
                </button>
              </div>
            </div>
            <Link href={"/blogs/all"} className={styles.more}>
              Xem các bài viết mới
            </Link>
            <Link href={"/blogs/save-blog"} className={styles.more}>
              Bài viết đã lưu
            </Link>
          </div>
        </div>
        <div className={styles.BlogUser_content}>
          {listBlog?.length > 0 ? (
            <>
              <div className={styles.list_blog}>
                {listBlog?.length > 0 &&
                  listBlog?.map((item) => {
                    if (item.typeBlog === "default")
                      return (
                        <div
                          key={item.id}
                          className={styles.blog}
                          style={{ backgroundColor: item.backgroundColor }}
                        >
                          {item.editImage !== "true" &&
                          item.editVideo !== "true" ? (
                            <>
                              <BlogDefault
                                blog={item}
                                handleDeleteBlog={handleDeleteBlog}
                                getListBlog={getListBlog}
                              />
                              <BtnMoreBlog id={item.id} />
                            </>
                          ) : (
                            <div className={styles.layoutEdit}>
                              <div className={styles["loader"]}>
                                <span className={styles["loader-text"]}>
                                  Đang xử lý
                                </span>
                                <span className={styles["load"]}></span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    if (item.typeBlog === "product")
                      return (
                        <div
                          key={item.id}
                          className={styles.blog}
                          style={{ backgroundColor: item.backgroundColor }}
                        >
                          <BlogProduct
                            blog={item}
                            handleDeleteBlog={handleDeleteBlog}
                            editContentBlog={editContentBlog}
                          />
                          <BtnMoreBlog id={item.id} />
                        </div>
                      );
                    if (item.typeBlog === "shareBlog") {
                      if (
                        item["blogs-blogShares-parent"][
                          "blogs-blogShares-child"
                        ]?.typeBlog === "default"
                      )
                        return (
                          <div
                            key={item.id}
                            className={styles.blog}
                            style={{ backgroundColor: item.backgroundColor }}
                          >
                            <BlogShareDefault
                              blog={item}
                              handleDeleteBlog={handleDeleteBlog}
                              editContentBlog={editContentBlog}
                            />
                            <BtnMoreBlog id={item.id} />
                          </div>
                        );
                      else {
                        return (
                          <div
                            key={item.id}
                            className={styles.blog}
                            style={{ backgroundColor: item.backgroundColor }}
                          >
                            <BlogShareProduct
                              blog={item}
                              handleDeleteBlog={handleDeleteBlog}
                              editContentBlog={editContentBlog}
                            />
                            <BtnMoreBlog id={item.id} />
                          </div>
                        );
                      }
                    }
                  })}

                {countPage > 20 && (
                  <div className={styles.pagination}>
                    <Pagination
                      current={currentPage || 1}
                      value={currentPage}
                      total={countPage}
                      showTitle={false}
                      showSizeChanger={false}
                      onChange={handleChangePage}
                    />
                  </div>
                )}
              </div>
              <div className={styles.right}>
                <div className={styles["pyramid-loader"]}>
                  <div className={styles["wrapper"]}>
                    <span
                      className={styles["side"] + " " + styles["side1"]}
                    ></span>
                    <span
                      className={styles["side"] + " " + styles["side2"]}
                    ></span>
                    <span
                      className={styles["side"] + " " + styles["side3"]}
                    ></span>
                    <span
                      className={styles["side"] + " " + styles["side4"]}
                    ></span>
                    <span className={styles["shadow"]}></span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noData}>
              {!loading && (
                <Empty
                  description={
                    <div style={{ color: "#fff" }}>Không có bài viết nào</div>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
      <Background />
      <FooterHome />
    </>
  );
};

export default BlogUser;
