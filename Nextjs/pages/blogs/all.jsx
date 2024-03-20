import Head from "next/head";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import styles from "../../styles/blogs/allBlog.module.scss";
import { getListBlogs } from "../../services/appService";
import { useState } from "react";
import { useEffect } from "react";
import { Pagination } from "antd";
import { useRouter } from "next/router";
import Fancybox from "../../components/product/Fancybox";
import {
  shareBlog,
  toggleLikeBlog,
  saveBlogCollection,
} from "../../services/userService";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import LayoutBlogProduct from "../../components/blogs/layout_blogShare_product";
import LayoutBlogDefault from "../../components/blogs/layout_blogShare_default";
import Link from "next/link";
import { checkWord } from "../../services/common";
import Image from "next/image";
import LoadingBar from "react-top-loading-bar";
import { nameWeb } from "../../utils/constants";

const maxCount = 10;

const linkVideoDrive = process.env.RACT_APP_LNK_VIDEO_DRIVE;

const renderContent_ShareBlog = (item) => {
  let typeBlogShare =
    item["blogs-blogShares-parent"]["blogs-blogShares-child"]?.typeBlog;
  let blogShare =
    item["blogs-blogShares-parent"]["blogs-blogShares-child"] || "";

  if (typeBlogShare === "product") {
    return <LayoutBlogProduct id={blogShare.id} idRoot={item.id} />;
  } else if (typeBlogShare === "default") {
    return <LayoutBlogDefault id={blogShare.id} idRoot={item.id} />;
  } else if (!typeBlogShare) {
    return <LayoutBlogDefault id={""} idRoot={item.id} />;
  }
};

const AllBlog = () => {
  const router = useRouter();
  const accessToken = useSelector((state) => state.user.accessToken);
  const { page } = router.query;
  const [listBlog, setListBlog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countPage, setCountPage] = useState("");
  const [arrIdLikeBlog, setArrIdLikeBlog] = useState([]);
  const [listIdBlogCollection, setListIdBlogCollection] = useState([]);
  const [progress, setProgress] = useState(90);

  useEffect(() => {
    handleGetListBlog();
  }, [page]);

  useEffect(() => {
    setCurrentPage(+page);
  }, [page]);

  const handleGetListBlog = async () => {
    const accToken = localStorage.getItem("accessToken");
    // if (!accToken) {
    //   return;
    // }
    let res = await getListBlogs({
      page: +page || 1,
      maxCount,
      accessToken: accToken,
    });
    console.log(res);
    if (res && res.errCode === 0) {
      setListBlog(res.data);
      setCountPage(res.countPage);
      setArrIdLikeBlog(res.arrIdBlogLike);
      setListIdBlogCollection(res.listIdBlogCollection);
      setProgress(100);
    }
  };

  const renderAvatarUser = (item) => {
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

  const handleChangePage = (page, pageSize) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page);
    router.push(`/blogs/all?${searchParams}`);
    setCountPage(page);
  };

  const handleShareBlog = async (item) => {
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

  const handleLikeBlog = async (idBlog) => {
    if (!accessToken) {
      toast.warning("Đăng nhập để like bài viết");
      return;
    }
    let data = {
      accessToken,
      idBlog,
    };

    let res = await toggleLikeBlog(data);
    if (res && res.errCode === 0) {
      handleGetListBlog();
    } else {
      toast.error(res?.errMessage || "Error");
    }
  };

  const checkLikeBlog = (idBlog) => {
    let check = false;
    arrIdLikeBlog.forEach((item) => {
      if (item.idBlog === idBlog) check = true;
    });
    return check;
  };

  const handleSaveBlogCollection = async (idBlog) => {
    if (!accessToken) {
      toast.warning("Đăng nhập để like bài viết");
      return;
    }

    let res = await saveBlogCollection({
      accessToken,
      idBlog,
    });

    if (res && res.errCode === 0) {
      handleGetListBlog();
    }
  };

  const checkExitsCollection = (idBlog) => {
    let kq = false;
    listIdBlogCollection.forEach((item) => {
      if (item.idBlog === idBlog) kq = true;
    });
    return kq;
  };

  function formatNumber(num) {
    if (num >= 1000 && num < 1000000) {
      return (num / 1000).toFixed(1) + "k";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "m";
    } else {
      return num?.toString();
    }
  }

  return (
    <>
      <Head>
        <title>Bài viết | {nameWeb}</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <HeaderBottom hideSearch={false} />
      <div className={styles.allBlog_container}>
        <Fancybox
          options={{
            infinite: true,
            hideScrollbar: true,
            Toolbar: {
              display: [
                { id: "prev", position: "center" },
                { id: "counter", position: "center" },
                { id: "next", position: "center" },
                "zoom",
                "slideshow",
                "fullscreen",
                "download",
                "thumbs",
                "close",
              ],
            },
          }}
        >
          <div className={styles.allblog_content}>
            <div className={styles.header}>
              <h2>Bài viết phổ biến</h2>
              <p>
                Tổng hợp các bài viết chia sẻ về kinh nghiệm mua sắm và sản
                phẩm.
              </p>
            </div>
            <div className={styles.list_blogs}>
              {listBlog.length > 0 &&
                listBlog.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={styles.wrap_blog}
                      style={{ backgroundColor: item.backgroundColor }}
                    >
                      <div className={styles.left}>
                        <div className={styles.header}>
                          <div className={styles.left}>
                            <Link
                              href={`/blogs/blog-user/${item.User?.id}`}
                              className={styles.avatar}
                              style={renderAvatarUser(item.User)}
                            ></Link>
                          </div>
                          <div className={styles.right}>
                            <Link
                              href={`/blogs/blog-user/${item.User?.id}`}
                              className={styles.name}
                            >
                              {item.User?.firstName + " " + item.User?.lastName}
                            </Link>
                            <div className={styles.typeUser}>
                              {item.User?.idTypeUser === "1" ||
                                (item.User?.idTypeUser === "2" &&
                                  "Quản trị viên")}
                              {item.User?.idTypeUser === "3" && "Người dùng"}
                            </div>
                          </div>
                        </div>
                        <div className={styles.content}>
                          <input
                            id={"radio_content" + item.id}
                            type="radio"
                            hidden
                            className={styles.radio}
                          />

                          {item.typeBlog === "default" ? (
                            <div
                              className={styles.wrap_content}
                              dangerouslySetInnerHTML={{ __html: item.title }}
                            ></div>
                          ) : (
                            <div
                              className={styles.wrap_content}
                              dangerouslySetInnerHTML={{
                                __html: item.textShare?.replaceAll(
                                  "\n",
                                  "<br/>"
                                ),
                              }}
                            ></div>
                          )}
                          <div className={styles.sign}>Thanks.</div>
                          {/* <Link href={`/blogs/detail-blog/${item.id}`}
                                          className={styles.more}
                                       >Xem thêm</Link> */}
                        </div>
                      </div>
                      <div className={styles.right}>
                        <div className={styles.media}>
                          {item.typeBlog === "default" && (
                            <>
                              <div className={styles.wrap_video}>
                                {item?.videoBlog &&
                                  item?.videoBlog?.idDrive === "" && (
                                    <iframe
                                      src={item?.videoBlog?.video}
                                      title="Nếu Em Không Về Mùa Thu Với Anh Thật Dài Remix TikTok - Nếu Em Không Về Remix"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    ></iframe>
                                  )}
                                {item?.videoBlog &&
                                  item?.videoBlog?.idDrive !== "" && (
                                    <video
                                      src={
                                        linkVideoDrive +
                                        item?.videoBlog?.idDrive
                                      }
                                      controls
                                    ></video>
                                  )}
                              </div>
                              <div className={styles.list_images}>
                                {item?.imageBlogs?.length > 0 &&
                                  item?.imageBlogs?.map((img, index) => {
                                    return (
                                      <Image
                                        key={index}
                                        className={styles.img}
                                        // style={{ backgroundImage: `url(${img.image})` }}
                                        src={img.image}
                                        alt="sfsd"
                                        width={600}
                                        height={400}
                                        data-fancybox={`gallery` + item.id}
                                        data-src={img.image}
                                        data-thumb={img.image}
                                        data-width={10000}
                                        data-height={10000}
                                      ></Image>
                                    );
                                  })}
                              </div>
                            </>
                          )}
                          {item.typeBlog === "product" && (
                            <div className={styles.shareProduct_container}>
                              <div className={styles.list_image}>
                                <Image
                                  className={styles.left}
                                  // style={{ backgroundImage: `url(${item['blogs-blogShares-parent']?.product['imageProduct-product'][0]?.imagebase6})` }}
                                  src={
                                    item["blogs-blogShares-parent"]?.product[
                                      "imageProduct-product"
                                    ][0]?.imagebase6
                                  }
                                  alt="sfsdf"
                                  width={600}
                                  height={400}
                                  data-fancybox={`gallery` + item.id}
                                  data-src={
                                    item["blogs-blogShares-parent"]?.product[
                                      "imageProduct-product"
                                    ][0]?.imagebase6
                                  }
                                  data-thumb={
                                    item["blogs-blogShares-parent"]?.product[
                                      "imageProduct-product"
                                    ][0]?.imagebase6
                                  }
                                  data-width={10000}
                                  data-height={10000}
                                ></Image>
                                <div className={styles.right}>
                                  {item["blogs-blogShares-parent"]?.product[
                                    "imageProduct-product"
                                  ]?.map((img, index) => {
                                    if (index !== 0)
                                      return (
                                        <Image
                                          key={img.id}
                                          // style={{ backgroundImage: `url(${img.imagebase6})` }}
                                          src={img.imagebase6}
                                          alt="sfsdf"
                                          width={600}
                                          height={400}
                                          className={styles.img}
                                          data-fancybox={`gallery` + item.id}
                                          data-src={img.imagebase6}
                                          data-thumb={img.imagebase6}
                                          data-width={10000}
                                          data-height={10000}
                                        ></Image>
                                      );
                                  })}
                                </div>

                                {item["blogs-blogShares-parent"]?.product[
                                  "imageProduct-product"
                                ]?.length >= 5 && (
                                  <div className={styles.more_image}>
                                    {item["blogs-blogShares-parent"]?.product[
                                      "imageProduct-product"
                                    ]?.length - 5}
                                  </div>
                                )}
                              </div>
                              <div className={styles.content}>
                                <Link
                                  href={`/product/${item["blogs-blogShares-parent"]?.product?.id}?name=${item["blogs-blogShares-parent"]?.product?.nameProduct}`}
                                  className={styles.nameProduct}
                                >
                                  {
                                    item["blogs-blogShares-parent"]?.product
                                      ?.nameProduct
                                  }
                                </Link>
                              </div>
                            </div>
                          )}
                          {item.typeBlog === "shareBlog" && (
                            <div className={styles.shareBlog_container}>
                              {renderContent_ShareBlog(item)}
                            </div>
                          )}
                        </div>
                        <div className={styles.btnSave}>
                          {checkExitsCollection(item.id) ? (
                            <i
                              className="fa-solid fa-bookmark"
                              onClick={() => handleSaveBlogCollection(item.id)}
                            ></i>
                          ) : (
                            <i
                              className="fa-regular fa-bookmark"
                              onClick={() => handleSaveBlogCollection(item.id)}
                            ></i>
                          )}
                        </div>
                        <div className={styles.statistical}>
                          <div className={styles.left}>
                            <div className={styles.icon}>
                              <label className={styles["container"]}>
                                <input
                                  type="checkbox"
                                  checked={checkLikeBlog(item.id)}
                                  onChange={() => handleLikeBlog(item.id)}
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
                            <div className={styles.text}>
                              {formatNumber(item.amountLike)}
                            </div>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.left}>
                              {formatNumber(item.amountComment) + " bình luận"}
                            </div>
                            <div className={styles.right}>
                              {formatNumber(item.amountShare) + " chia sẻ"}
                            </div>
                          </div>
                        </div>
                        <div className={styles.btns}>
                          <div className={styles.btnSee}>
                            <button>
                              <span>
                                <Link
                                  href={`/blogs/detail-blog/${item.id}`}
                                  style={{ fontSize: "1.2rem" }}
                                >
                                  Xem chi tiết
                                </Link>
                              </span>
                              <i></i>
                            </button>
                          </div>
                          <div className={styles.btnShare}>
                            <button
                              onClick={() => handleShareBlog(item)}
                              style={{ fontSize: "1.2rem" }}
                            >
                              Chia sẻ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className={styles.patination}>
              <Pagination
                // defaultCurrent={page || 1}
                current={currentPage || 1}
                total={countPage}
                showTitle={false}
                showSizeChanger={false}
                onChange={handleChangePage}
              />
            </div>
          </div>
        </Fancybox>
      </div>
      <div className={"bg-home"}>
        <div className={"area"}>
          <ul className={"circles"}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
      <FooterHome />
    </>
  );
};

export default AllBlog;
