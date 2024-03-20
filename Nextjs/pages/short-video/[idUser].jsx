import Head from "next/head";
import styles from "../../styles/short-video/VideoUser_Id.module.scss";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import { Pagination } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getListVideoByIdUser,
  getUserById,
  deleteShortVideoById,
} from "../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import {
  formatNumber,
  renderAvatarUser,
  renderAvatarUser_url,
  decode_token,
} from "../../services/common";
import Fancybox from "../../components/product/Fancybox";
import actionTypes from "../../store/actions/actionTypes";
import Image from "next/image";
import LazyLoad from "react-lazyload";
import AllShortVideo from "./foryou";
import LoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";
import Link from "next/link";
import { Empty } from "antd";
var io = require("socket.io-client");
// import { useMediaQuery } from 'react-responsive';

let socket;

const VideoUser = () => {
  const router = useRouter();
  const { page, idUser, nav, ft, preview = false } = router.query;
  const accessToken = useSelector((state) => state.user.accessToken);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [listVideos, setListVideos] = useState([]);
  const [countPage, setCountPage] = useState(0);
  const [totalLike, setToTalLike] = useState(0);
  const [indexVideo, setIndexVideo] = useState("");
  const [domloaded, setDomloaded] = useState(false);
  const [progress, setProgress] = useState(100);
  const [loading, setLoading] = useState(true);
  // const isScreen600 = useMediaQuery({ query: '(max-width: 600px)' });

  useEffect(() => {
    if (idUser === "user" && !accessToken) router.push("/home");
  }, [idUser]);

  useEffect(() => {
    if (idUser === "user") {
      const getListVideo = async () => {
        const accToken = localStorage.getItem("accessToken");
        let res = await getListVideoByIdUser({
          accessToken: accToken,
          nav: nav || "video",
          ft: ft || "new",
          page: page || "1",
        });
        if (res?.errCode === 0) {
          let countPage = Math.floor((res.countPage - 1) / 50 + 1) * 10;
          // console.log(countPage);
          setCountPage(countPage);
          setListVideos(res.data);
          setToTalLike(res.countLike);
        }
      };
      getListVideo();
    }

    // function goBack(event) {
    //    return
    //    if (!preview) {
    //       if (!isScreen600) return
    //       event.preventDefault()
    //       // alert('vao')
    //       let searchParams = new URLSearchParams(window.location.search);
    //       searchParams.set('preview', false)
    //       router.replace(`/short-video/${idUser}?${searchParams}`, undefined, {
    //          scroll: false
    //       })
    //       setIndexVideo('')
    //    }
    // }
    // window?.addEventListener('popstate', goBack);

    return () => {
      // window?.removeEventListener('popstate', goBack)
    };
  }, [idUser, page, nav, ft, accessToken]);

  useEffect(() => {
    const getUser = async () => {
      if (idUser !== "user") {
        let res = await getUserById({
          idUser,
        });
        if (res?.errCode === 0) {
          dispatch({
            type: actionTypes.GET_LOGIN_SUCCESS,
            data: res.data,
          });
        } else if (res?.errCode === 2) {
          router.push("/home");
        }
      }
    };
    getUser();

    if (accessToken && idUser === "user") {
      let decoded = decode_token(accessToken);

      socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
        reconnect: true,
      });
      socket?.on(
        `refresh-short-video-user-${decoded?.id}`,
        async function (data) {
          if (data.status === false) {
            Swal.fire({
              icon: "error",
              title: "Oh no!",
              text: "Tải video thất bại!",
            });
          }
          if (idUser === "user") {
            const accToken = localStorage.getItem("accessToken");
            let res2 = await getListVideoByIdUser({
              accessToken: accToken,
              nav: nav || "video",
              ft: ft || "new",
              page: page || "1",
            });
            if (res2?.errCode === 0) {
              let countPage = Math.floor((res2.countPage - 1) / 50 + 1) * 10;
              // console.log(countPage);
              setCountPage(countPage);
              setListVideos(res2.data);
              setToTalLike(res2.countLike);
            }
          }
        }
      );
    }

    return () => {
      if (accessToken) {
        socket?.disconnect();
      }
    };
  }, [idUser]);

  useEffect(() => {
    // if (nav || page || ft) {
    //    if (!domloaded)
    //       if (nav && nav !== 'video' || ft && ft !== 'new' || page && page !== 1) {
    //          handleGetListVideo()
    //       }
    //    setDomloaded(true)
    // }

    handleGetListVideo();
    // if (domloaded) {
    // }
    // setDomloaded(true)
  }, [page, nav, ft]);

  const handleGetListVideo = async () => {
    if (idUser === "user") {
      setLoading(true);
      const accToken = localStorage.getItem("accessToken");
      let res = await getListVideoByIdUser({
        accessToken: accToken,
        nav: nav || "video",
        ft: ft || "new",
        page: page || "1",
      });
      setListVideos([]);
      console.log("nav", nav, "ft", ft);
      if (res?.errCode === 0) {
        let countPage = Math.floor((res.countPage - 1) / 50 + 1) * 10;
        // console.log(countPage);
        setCountPage(countPage);
        setListVideos(res.data);
        setToTalLike(res.countLike);
        setLoading(false);
      }
      // else {
      //    setLoading(false)
      // }
    } else {
      setListVideos([]);
      setProgress(90);
      setLoading(true);
      let res = await getListVideoByIdUser({
        idUser,
        nav: nav || "video",
        ft: ft || "new",
        page: page || "1",
      });
      if (res?.errCode === 0) {
        let countPage = Math.floor((res.countPage - 1) / 50 + 1) * 10;
        // console.log(countPage);
        setCountPage(countPage);
        setListVideos(res.data);
        setToTalLike(res.countLike);
        setProgress(100);
        setLoading(false);
      }
      // else {
      //    setLoading(false)
      // }
    }
  };

  const handleChangePage = (page, pageSize) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page);
    router.replace(`/short-video/${idUser}?${searchParams}`);
    // handleGetListVideo()
  };

  const handleChangeNav = (navValue) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("nav", navValue);
    searchParams.set("ft", "new");
    router.replace(`/short-video/${idUser}?${searchParams}`, undefined, {
      scroll: false,
    });

    // handleGetListVideo()
  };

  const handleChangeFt = (value) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("ft", value);
    router.replace(`/short-video/${idUser}?${searchParams}`, undefined, {
      scroll: false,
    });
    // handleGetListVideo()
  };

  const handleClickVideo = (index) => {
    // setShowModal(true)
    setIndexVideo(index);

    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("preview", true);
    router.push(`/short-video/${idUser}?${searchParams}`, undefined, {
      scroll: false,
    });
  };

  const handleCloseModal = () => {
    // setShowModal(false)
    setIndexVideo("");

    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("preview", false);
    router.push(`/short-video/${idUser}?${searchParams}`, undefined, {
      scroll: false,
    });
  };

  const handleEditVideo = (idVideo) => {
    router.push(`/short-video/edit?id=${idVideo}`);
  };

  const handleDeleteVideo = async (idVideo) => {
    if (!accessToken) return;

    let res = await deleteShortVideoById({
      accessToken,
      idShortVideo: idVideo,
    });

    if (res?.errCode === 0) {
      if (idUser === "user") {
        const accToken = localStorage.getItem("accessToken");
        let res2 = await getListVideoByIdUser({
          accessToken: accToken,
          nav: nav || "video",
          ft: ft || "new",
          page: page || "1",
        });
        if (res2?.errCode === 0) {
          let countPage = Math.floor((res2.countPage - 1) / 50 + 1) * 10;
          // console.log(countPage);
          setCountPage(countPage);
          setListVideos(res2.data);
          setToTalLike(res2.countLike);
        }
      } else {
        let res2 = await getListVideoByIdUser({
          idUser,
          nav: nav || "video",
          ft: ft || "new",
          page: page || "1",
        });
        if (res2?.errCode === 0) {
          let countPage = Math.floor((res2.countPage - 1) / 50 + 1) * 10;
          // console.log(countPage);
          setCountPage(countPage);
          setListVideos(res2.data);
          setToTalLike(res2.countLike);
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>
          {idUser === "user" ? "Video của tôi" : "Video người dùng"}
        </title>
        {preview === "true" && (
          <style>
            {`
               html {
                  overflow-y: hidden;
               }
               .scroll-to-top  {
                  display:none;
               }
            `}
          </style>
        )}
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <HeaderBottom hideSearch={false} short_video={true} />
      <div className={styles.VideoUser_container}>
        <div className={styles.VideoUser_content}>
          <div className={styles.header}>
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
              <div
                className={styles.avatar}
                style={renderAvatarUser(currentUser)}
                data-fancybox="gallery"
                data-src={renderAvatarUser_url(currentUser)}
                data-width={10000}
                data-height={10000}
                // data-thumb={item.imagebase64}
              ></div>
            </Fancybox>
            <div className={styles.content}>
              <div className={styles.name}>
                {currentUser?.firstName + " " + currentUser.lastName}
              </div>
              <div className={styles.like}>
                {formatNumber(totalLike)} lượt thích video
              </div>
            </div>
            {idUser === "user" && (
              <Link href={"/short-video/new"} className={styles.btnAdd}>
                <button> Thêm video</button>
              </Link>
            )}
          </div>
          <div className={styles.navbar}>
            <div
              className={classNames(styles.item, {
                [styles.active]: nav === "video" || !nav,
              })}
              onClick={() => handleChangeNav("video")}
            >
              Video
            </div>
            <div
              className={classNames(styles.item, {
                [styles.active]: nav === "save",
              })}
              onClick={() => handleChangeNav("save")}
            >
              Đã lưu
            </div>
            <div
              className={classNames(styles.item, {
                [styles.active]: nav === "like",
              })}
              onClick={() => handleChangeNav("like")}
            >
              Yêu thích
            </div>
          </div>
          <div className={styles.list_video_container}>
            <div className={styles.header}>
              {!nav || nav === "video"
                ? "Video"
                : nav === "save"
                ? "Đã lưu"
                : "Yêu thích"}
            </div>
            <div className={styles.fillter}>
              <div
                className={classNames(styles.item, {
                  [styles.active]: ft === "new" || !ft,
                })}
                onClick={() => handleChangeFt("new")}
              >
                Mới nhất
              </div>
              <div
                className={classNames(styles.item, {
                  [styles.active]: ft === "old",
                })}
                onClick={() => handleChangeFt("old")}
              >
                Cũ nhất
              </div>
            </div>
            <div className={styles.list_video_content}>
              {listVideos?.length > 0 &&
                listVideos?.map((item, index) => {
                  if (
                    item.loadImage === "false" ||
                    item.loadVideo === "false"
                  ) {
                    return (
                      <div
                        key={item.id}
                        className={styles.video_item + " " + styles.loading}
                      >
                        <div
                          className={styles["loader"] + " " + styles["JS_on"]}
                        >
                          <span className={styles["binary"]}></span>
                          <span className={styles["binary"]}></span>
                          <span className={styles["getting-there"]}>
                            Đang tải video
                          </span>
                        </div>
                        <div
                          className={styles.btnRemove}
                          onClick={() => handleDeleteVideo(item.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className={styles.video_item}>
                      <LazyLoad>
                        <Image
                          src={item.urlImage}
                          alt="Your Image Alt Text"
                          width={600}
                          height={200}
                          onClick={() => handleClickVideo(index)}
                        />
                      </LazyLoad>
                      {idUser === "user" && (
                        <button className={styles.btns}>
                          <i className="fa-solid fa-ellipsis"></i>

                          <div className={styles.options}>
                            <div
                              className={styles.item + " " + styles.delete}
                              onClick={() => handleDeleteVideo(item.id)}
                            >
                              <i className="fa-solid fa-trash"></i>
                              <div className={styles.text}>Xóa video</div>
                            </div>
                            <div
                              className={styles.item + " " + styles.edit}
                              onClick={() => handleEditVideo(item.id)}
                            >
                              <i className="fa-solid fa-pencil"></i>
                              <div className={styles.text}>Chỉnh sửa video</div>
                            </div>
                          </div>
                        </button>
                      )}
                      <div className={styles.like}>
                        <i className="fa-solid fa-thumbs-up"></i>
                        <div className={styles.number}>
                          {formatNumber(item.countLike)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              {listVideos?.length === 0 && !loading && (
                <div className={styles.notFount}>
                  <Empty
                    style={{ marginTop: "30px" }}
                    description={
                      <div style={{ color: "#fff" }}>Chưa có video nào</div>
                    }
                  />
                </div>
              )}
            </div>
          </div>
          {countPage > 10 && (
            <div className={styles.pagination}>
              <Pagination
                defaultCurrent={page || 1}
                // current={page}
                total={countPage}
                showTitle={false}
                showSizeChanger={false}
                onChange={handleChangePage}
              />
            </div>
          )}
        </div>
        {indexVideo !== "" && preview === "true" && (
          <div className={classNames(styles.layout_preview_video)}>
            <div className={styles.btnClose} onClick={() => handleCloseModal()}>
              <i className="fa-solid fa-xmark fa-beat"></i>
            </div>

            <AllShortVideo
              hideHeader={true}
              idMutedData={true}
              listVideoData={listVideos}
              indexVideo={indexVideo}
            />
          </div>
        )}
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

export default VideoUser;
