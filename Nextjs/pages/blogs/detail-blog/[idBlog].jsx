import HeaderBottom from "../../../components/home/HeaderBottom";
import FooterHome from "../../../components/home/FooterHome";
import styles from "../../../styles/blogs/detail_blog.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  toggleLikeBlog,
  createNewCommentBlog,
  deleteCommentBlogById,
  updateCommentBlogById,
  shareBlog,
  createNewReportBlog,
} from "../../../services/userService";
import {
  getBlogById,
  getCommentBlogByIdBlog,
  increateViewBlogById,
} from "../../../services/appService";
import {
  saveBlogCollection,
  checkLikeBlogById,
  checkSaveBlogById,
} from "../../../services/userService";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import BlogDefault from "../../../components/blogs/detail-blog/blog_default";
import BlogProduct from "../../../components/blogs/detail-blog/blog_product";
import BlogShareDefault from "../../../components/blogs/detail-blog/blog_share_default";
import BlogShareProduct from "../../../components/blogs/detail-blog/blog_share_product";
import classNames from "classnames";
import LoadingBar from "react-top-loading-bar";
import { Pagination, Popconfirm } from "antd";
import { useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  checkWord,
  formatNumber,
  decode_token,
} from "../../../services/common";
import Background from "../../../components/background";
import { nameWeb } from "../../../utils/constants";

export async function getStaticProps(context) {
  try {
    let listBlogRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-blog-by-id?idBlog=${context.params.idBlog}`
    );
    listBlogRes = await listBlogRes.json();

    let listCommentBlogRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-comment-blog-by-id-blog?idBlog=${context.params.idBlog}&page=1`
    );
    listCommentBlogRes = await listCommentBlogRes.json();

    return {
      props: {
        listBlogData: listBlogRes?.data ?? "",
        listCommentBlogData: listCommentBlogRes?.data ?? [],
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log("err from blog user in static: ", e);
    return {
      props: { data: "" },
    };
  }
}

export async function getStaticPaths() {
  // Tạo ra một mảng các đối tượng path
  const paths = [
    {
      params: { idBlog: "8908f926-42e6-4f27-977a-f12544c2279b" },
    },
  ];

  // Trả về mảng path đã tạo
  return { paths, fallback: true };
}

const DetailBlog = ({ listBlogData, listCommentBlogData }) => {
  const router = useRouter();
  const { idBlog } = router.query;
  const accessToken = useSelector((state) => state.user.accessToken);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [contentComment, setContentComment] = useState("");
  const [blog, setBlog] = useState(listBlogData);
  const [listComment, setListComment] = useState(listCommentBlogData);
  const [currentIdUser, setCurrentIdUser] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [progress, setProgress] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [countPage, setCountPage] = useState(0);
  const [checkLikeBlog, setCheckLikeBlog] = useState(false);
  const [checkCollection, setCheckCollection] = useState(false);
  const increateViewBlog = useRef();
  const [domloaded, setDomloaded] = useState(false);

  useEffect(() => {
    // getBlog()
    handleCheckLikeBlog();
    handleCheckSaveBlog();

    if (accessToken) {
      let decoded = decode_token(accessToken);
      if (decoded !== 0) setCurrentIdUser(decoded.id);
    }
    getListCommentBlog("1");
  }, [idBlog]);

  useEffect(() => {
    if (idBlog) {
      increateViewBlog.current = setTimeout(() => {
        console.log("increate view blog");
        increateViewBlogById({ idBlog });
      }, 10000);
    }

    return () => {
      console.log("clear handle increate view blog");
      clearTimeout(increateViewBlog.current);
    };
  }, [idBlog]);

  useEffect(() => {
    if (domloaded) getListCommentBlog(currentPage);
    setDomloaded(true);
  }, [currentPage, idBlog]);

  const getListCommentBlog = async (page) => {
    if (!idBlog) return;
    let res = await getCommentBlogByIdBlog({
      idBlog,
      // accessToken,
      page,
    });
    if (res && res.errCode === 0) {
      setListComment(res.data);
      // setCurrentIdUser(res.idUser || '')
      let size = (Math.floor((res.count - 1) / 20) + 1) * 10;
      setCountPage(size);

      // if (accessToken) {
      //     let decoded = decode_token(accessToken)
      //     if (decoded !== 0)
      //         setCurrentIdUser(decoded.id)
      // }
    }
  };

  const getBlog = async () => {
    if (!idBlog) return;
    let res = await getBlogById({
      idBlog,
    });
    // console.log(res);
    if (res && res.errCode === 0) {
      if (res.data) {
        setBlog(res.data);
        // setCheckLikeBlog(res.checkLike)
        // setCheckCollection(res.checkCollection)

        setProgress(100);
      } else router.push("/home");
    } else if (res && res.errCode === 2) {
      router.push("/home");
    }
  };

  const handleCheckLikeBlog = async () => {
    if (!accessToken || !idBlog) return;

    let res = await checkLikeBlogById({
      accessToken,
      idBlog,
    });
    if (res?.errCode === 0) setCheckLikeBlog(res.data);
  };

  const handleCheckSaveBlog = async () => {
    if (!accessToken || !idBlog) return;

    let res = await checkSaveBlogById({
      accessToken,
      idBlog,
    });
    if (res?.errCode === 0) setCheckCollection(res.data);
  };

  const handleLikeBlog = async () => {
    if (!accessToken) {
      toast.warning("Đăng nhập để thực hiện tính năng này!");
      return;
    }
    let data = {
      accessToken,
      idBlog,
    };
    setCheckLikeBlog(!checkLikeBlog);

    let res = await toggleLikeBlog(data);
    if (res && res.errCode === 0) {
      console.log("blog", blog);
      if (res.errMessage === "Like") {
        setCheckLikeBlog(true);
        let arrTam = { ...blog };
        arrTam.amountLike += 1;
        setBlog(arrTam);
      } else {
        setCheckLikeBlog(false);
        let arrTam = { ...blog };
        arrTam.amountLike -= 1;
        setBlog(arrTam);
      }

      handleCheckLikeBlog();
      getBlog();
    } else {
      toast.error(res?.errMessage || "Error");
    }
  };

  const handleComment = async () => {
    if (!contentComment) {
      setLoadingComment(false);
      return;
    }
    if (!accessToken) {
      toast.warning("Vui lòng đăng nhập để thực hiện tính năng này!");
      setLoadingComment(false);
      return;
    }

    if (!checkWord(contentComment)) {
      toast.warning("Nội dung có chứa các từ bị cấm trên hệ thống!");
      setLoadingComment(false);
      return;
    }

    if (loadingComment) return;
    setLoadingComment(true);

    let data = {
      accessToken,
      idBlog,
      content: contentComment,
    };
    setProgress(90);
    let res = await createNewCommentBlog(data);
    if (res && res.errCode === 0) {
      setCurrentPage(1);
      setContentComment("");
      getListCommentBlog(1);
      setLoadingComment(false);
      setProgress(100);
      getBlog();
    } else {
      toast.error(res?.errMessage || "Error");
      setLoadingComment(false);
      setProgress(100);
    }
  };

  const renderAvatarUser = (item) => {
    if (!item) return {};
    if (item.avatarUpdate) {
      return {
        backgroundImage: `url(${item.avatarUpdate})`,
      };
    }
    if (item.typeAccount === "web") {
      if (item.avatar) {
        return {
          backgroundImage: `url(${item.avatar})`,
        };
      } else {
        return {};
      }
    }

    if (item.typeAccount === "google") {
      return {
        backgroundImage: `url(${item.avatarGoogle})`,
      };
    }
    if (item.typeAccount === "facebook") {
      return {
        backgroundImage: `url(${item.avatarFacebook})`,
      };
    }

    if (item.typeAccount === "github") {
      return {
        backgroundImage: `url(${item.avatarGithub})`,
      };
    }
  };

  const handleDeleteComment = async (idComment) => {
    if (!accessToken) {
      toast.warning("Bạn không được phép thực hiện tính năng này!");
      return;
    }
    let res = await deleteCommentBlogById({
      accessToken,
      idComment,
    });
    setProgress(90);
    if (res && res.errCode === 0) {
      getListCommentBlog(currentPage);
      setProgress(100);
      getBlog();
    } else {
      toast.error(res?.errMessage || "Error");
      setLoadingComment(false);
      setProgress(100);
    }
  };

  const handleEditComment = async (idComment, contentOld) => {
    Swal.fire({
      title: "Chỉnh sửa",
      input: "textarea",
      width: 600,
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Nội dung bình luận...",
      },
      inputValue: contentOld,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      text: "Điều chỉnh nội dung của bình luận",
      size: "medium",
      preConfirm: async (value) => {
        if (!value) {
          toast.warning("Không được bỏ trống nội dung!");
          return false;
        } else {
          setProgress(90);
          let res = await updateCommentBlogById({
            accessToken,
            idComment,
            content: value,
          });
          if (res && res.errCode === 0) {
            getListCommentBlog(currentPage);
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

  const handleChangePage = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleShareBlog = async (item) => {
    if (!accessToken) {
      toast.warning("Đăng nhập để thực hiện tính năng này!");
      return;
    }

    Swal.fire({
      title: "Chia sẻ bài viết",
      input: "textarea",
      width: 600,
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Nội dung chia sẻ..",
        style: "color: #fff",
      },
      color: "#fff",
      showCancelButton: true,
      confirmButtonText: "Chia sẻ",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      background: "#222",

      preConfirm: async (value) => {
        if (!value) {
          toast.warning("Vui lòng nhập nội dung chia sẻ!");
          return false;
        } else if (!checkWord(value)) {
          toast.warning("Nội dung có chứa 1 số từ bị cấm trên hệ thống!");
          return false;
        } else {
          let id =
            item.typeBlog === "default" || item.typeBlog === "product"
              ? item.id
              : item["blogs-blogShares-parent"]["blogs-blogShares-child"]?.id;

          if (!id) {
            return {
              err: false,
              mess: "Không thể chia sẻ bài viết này!",
              type: "warning",
            };
          }

          let data = {
            accessToken,
            content: value,
            idBlog: id,
          };

          let res = await shareBlog(data);
          if (res && res.errCode === 0) {
            return {
              err: true,
            };
          } else {
            return {
              err: false,
              mess: res?.errMessage || "Đã xảy ra sự cố ngoài ý muốn!",
            };
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.dismiss) return;
      if (result.value?.err) {
        Swal.fire({
          icon: "success",
          title: `Chia sẻ thành công.`,
        });
      } else if (!result.value?.err) {
        Swal.fire({
          icon: result.value?.type || "error",
          title: result.value?.mess || "Đã xảy ra sự cố ngoài ý muốn!",
        });
      }
    });
  };

  const onSelectEmoji = (value) => {
    setContentComment(contentComment + value.native);
  };

  const handleSaveBlogCollection = async () => {
    if (!accessToken) {
      toast.warning("Vui lòng đăng nhập để thực hiện!");
      return;
    }

    let res = await saveBlogCollection({
      accessToken,
      idBlog,
    });
    if (res && res.errCode === 0) {
      handleCheckSaveBlog();
    }
  };

  const handleReportBlog = async (idBlog) => {
    Swal.fire({
      title: "Báo cáo bài viết",
      input: "textarea",
      width: 600,
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Nhập thông tin vấn đề..",
        style: "color: #fff",
      },
      color: "#fff",
      showCancelButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
      text: "Báo cáo với quản trị viên",
      background: "#222",
      preConfirm: async (value) => {
        if (!value) {
          toast.warning("Vui lòng nhập nội dung cho báo cáo này!");
          return false;
        } else if (!checkWord(value)) {
          toast.warning("Nội dung chứa các từ ngữ bị cấm trên hệ thống!");
          return false;
        } else {
          let res = await createNewReportBlog({
            accessToken,
            content: value,
            idBlog,
          });
          if (res && res.errCode === 0) {
            return {
              err: true,
            };
          } else {
            return {
              err: false,
              mess: res?.errMessage || "Đã xảy ra sự cố ngoài ý muốn!",
            };
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.dismiss) return;
      if (result.value?.err) {
        Swal.fire({
          icon: "success",
          title: `Đã gửi báo cáo tới quản trị viên.`,
        });
      } else if (!result.value?.err) {
        Swal.fire({
          icon: "error",
          title: result.value?.mess || "Đã xảy ra sự cố ngoài ý muốn!",
        });
      }
    });
  };

  return (
    <>
      <Head>
        <title>Chi tiết bài viết | {nameWeb}</title>
      </Head>
      <HeaderBottom hideSearch={false} />
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles.detailBlog_container}>
        <div className={styles.detailBlog_content}>
          <div className={styles.btnSaveCollection}>
            {checkCollection ? (
              <i
                className="fa-solid fa-bookmark"
                onClick={() => handleSaveBlogCollection()}
              ></i>
            ) : (
              <i
                className="fa-regular fa-bookmark"
                onClick={() => handleSaveBlogCollection()}
              ></i>
            )}
          </div>
          <div
            className={styles.content_blog}
            style={{ backgroundColor: blog?.backgroundColor }}
          >
            {blog?.typeBlog === "default" && <BlogDefault blog={blog} />}
            {blog?.typeBlog === "product" && <BlogProduct blog={blog} />}
            {blog?.typeBlog === "shareBlog" &&
              blog["blogs-blogShares-parent"]["blogs-blogShares-child"]
                ?.typeBlog === "default" && <BlogShareDefault blog={blog} />}
            {blog?.typeBlog === "shareBlog" &&
              blog["blogs-blogShares-parent"]["blogs-blogShares-child"]
                ?.typeBlog === "product" && <BlogShareProduct blog={blog} />}
            {blog?.typeBlog === "shareBlog" &&
              !blog["blogs-blogShares-parent"]["blogs-blogShares-child"] && (
                <BlogShareDefault blog={blog} />
              )}
          </div>
          <div className={styles.btns_blog}>
            <div className={styles.left}>
              <div className={styles.icon}>
                <label className={styles["container"]}>
                  <input
                    type="checkbox"
                    checked={checkLikeBlog}
                    onChange={handleLikeBlog}
                  />
                  <div className={styles["checkmark"]}>
                    <svg fill="none" viewBox="0 0 24 24">
                      <path
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="1.3"
                        stroke="#FFFFFF"
                        d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20"
                      ></path>
                    </svg>
                  </div>
                </label>
              </div>
              <div className={styles.data}>
                {formatNumber(blog?.amountLike)}
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.data}>
                {formatNumber(blog?.amountComment) + " bình luận"}
              </div>

              <div className={styles.button}>
                <button onClick={() => handleShareBlog(blog)}>Chia sẻ</button>
              </div>
              <div
                className={styles.report}
                style={{ cursor: "pointer" }}
                onClick={() => handleReportBlog(blog?.id)}
              >
                <i className="fa-solid fa-bug"></i>
              </div>
            </div>
          </div>
          <div className={styles.wrap_comment}>
            <div className={styles.add_comment}>
              <div
                className={styles.left}
                style={renderAvatarUser(currentUser)}
              ></div>
              <div className={styles.right}>
                <div className={styles.textarea}>
                  <div className={styles.top}>
                    <textarea
                      value={contentComment}
                      onChange={(e) => setContentComment(e.target.value)}
                      placeholder="Nội dung bình luận..."
                      maxLength={500}
                    ></textarea>
                    <button className={styles.toggleEmoji}>
                      <i className="fa-regular fa-face-smile"></i>
                    </button>
                    <button className={styles.emoij}>
                      <Picker data={data} onEmojiSelect={onSelectEmoji} />
                    </button>
                  </div>

                  <div className={styles.numberText}>
                    {contentComment.length + "/500"}
                  </div>
                </div>

                <div className={styles.button}>
                  <button onClick={handleComment}>OK</button>
                </div>
              </div>
            </div>
            <div className={styles.list_comment}>
              <div className={styles.wrap_list}>
                {listComment?.length > 0 &&
                  listComment.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={classNames(styles.comment, {
                          [styles.active]: currentIdUser === item?.User?.id,
                        })}
                      >
                        <div
                          className={styles.left}
                          style={renderAvatarUser(item.User)}
                        ></div>
                        <div className={styles.right}>
                          <div className={styles.wrap}>
                            <div className={styles.nameUser}>
                              {item?.User?.firstName +
                                " " +
                                item?.User?.lastName}
                            </div>
                            <div
                              className={styles.content}
                              dangerouslySetInnerHTML={{
                                __html: item?.content?.replaceAll(
                                  "\n",
                                  "<br/>"
                                ),
                              }}
                            ></div>
                          </div>
                          {currentIdUser === item?.User?.id && (
                            <button className={styles.btn}>
                              <i className="fa-solid fa-ellipsis"></i>
                              <div className={styles.menuBtns}>
                                <div
                                  onClick={() =>
                                    handleEditComment(item.id, item.content)
                                  }
                                >
                                  Chỉnh sửa
                                </div>

                                <Popconfirm
                                  title="Xóa bình luận này"
                                  description="Bạn có chắc muốn xóa bình luận này?"
                                  okText="Xóa"
                                  cancelText="Không"
                                  onConfirm={() => handleDeleteComment(item.id)}
                                >
                                  <div>Xóa</div>
                                </Popconfirm>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
              {countPage >= 20 && (
                <div className={styles.pagtination}>
                  <Pagination
                    current={currentPage || 1}
                    total={countPage}
                    showTitle={false}
                    showSizeChanger={false}
                    onChange={handleChangePage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Background />
      <FooterHome />
    </>
  );
};

export default DetailBlog;
