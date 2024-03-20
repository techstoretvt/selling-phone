import classNames from "classnames";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import HeaderBottom from "../../components/home/HeaderBottom";
import styles from "../../styles/short-video/foryou.module.scss";
import {
  getListShortVideo,
  getListCommentShortVideoById,
  getListProductHashTagShortVideo,
} from "../../services/appService";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  createCommentShortVideo,
  deleteCommentShortVideoById,
  editCommentShortVideoById,
  toggleLikeShortVideo,
  checkUserLikeShortVideo,
  toggleSaveCollectionShortVideo,
  checkSaveCollectionShortVideo,
  createNewReportVideo,
} from "../../services/userService";
import Swal from "sweetalert2";
import Link from "next/link";
import { formatNumber } from "../../services/common";
import ShareButton from "./sharreFacebook";
import { toast } from "react-toastify";
import CartProduct from "../../components/home/CardProduct";
import ModalPreviewProduct from "../../components/home/ModalPreviewProduct";
import { useMediaQuery } from "react-responsive";
import actionTypes from "../../store/actions/actionTypes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LoadingBar from "react-top-loading-bar";
import { checkWord } from "../../services/common";
import { nameWeb } from "../../utils/constants";

// export async function getServerSideProps() {
//    return { props: { data: 'sfsd' } }
// }

const ListCart = ({ idShortVideo }) => {
  const [listProduct, setListProduct] = useState([]);
  const [isShowModalPreview, setIsShowModalPreview] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");

  useEffect(() => {
    getListProduct();
  }, [idShortVideo]);

  const getListProduct = async () => {
    if (!idShortVideo) return;
    let res = await getListProductHashTagShortVideo({
      idShortVideo,
    });
    // console.log(res);
    if (res?.errCode === 0) {
      setListProduct(res.data.hashTagVideos);
    } else {
      setListProduct([]);
    }
  };

  const closeModalPreview = () => {
    setIsShowModalPreview(false);
  };

  const handleOpenModalPreview = (product) => {
    setIsShowModalPreview(true);
    setCurrentProduct(product);
  };

  return (
    <div className={styles.listCart}>
      {listProduct.length !== 0 &&
        listProduct?.map((item, index) => {
          return (
            <div key={item.id} className={styles.item}>
              <CartProduct
                product={item.product}
                handleOpenModalPreview={handleOpenModalPreview}
              />
            </div>
          );
        })}

      <ModalPreviewProduct
        closeModal={closeModalPreview}
        isOpen={isShowModalPreview}
        product={currentProduct}
      />
    </div>
  );
};

const ListComments = ({
  accessToken,
  idShortVideo,
  idAuhor,
  changCountComment,
}) => {
  const [listComment, setListComment] = useState([]);
  const [idUser, setIdUser] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [offset, setOffset] = useState(0);
  const [valueComment, setValueComment] = useState("");
  const textareaEl = useRef();
  const textareaEdit = useRef();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openEmojiEdit, setOpenEmojiEdit] = useState(false);
  const [isLoadingCm, setIsLoadingCm] = useState(false);
  const [currentIdComment, setCurrentIdComment] = useState("");
  const [currentIndexComment, setCurrentIndexComment] = useState("");
  const [contentEdit, setContentEdit] = useState("");
  const [countComment, setCountComment] = useState(0);
  const [isFocusTextarea, setIsFocusTextarea] = useState(false);

  useEffect(() => {
    setListComment([]);
    setOffset(0);
    getListComment();
    setCurrentIdComment("");
    setContentEdit("");
    setIdUser("");
    setCurrentUser("");
    setCurrentIndexComment("");
  }, [idShortVideo]);

  useEffect(() => {
    if (currentIdComment) {
      textareaEdit.current.focus();
      textareaEdit.current.selectionStart = textareaEdit.current.value.length;
      // textareaEdit.current.scrollIntoView();
    }
  }, [currentIdComment]);

  const getListComment = async (offset = 0) => {
    const accToken = localStorage.getItem("accessToken");

    if (accToken && idShortVideo) {
      let res = await getListCommentShortVideoById({
        accessToken: accToken,
        idShortVideo,
        offset,
      });
      // console.log(res);
      if (res?.errCode === 0) {
        if (res.idUser) setIdUser(res.idUser);
        if (offset === 0) setListComment(res.data);
        else {
          let arr = listComment.concat(res.data);
          setListComment(arr);
        }
        setCountComment(res.count);
        if (res.User) setCurrentUser(res.User);
      }
    }
  };

  const onchaneValueComment = (e) => {
    if (e.target.value.length > 150) return;
    setValueComment(e.target.value);
  };

  const handleCreateComment = async (e) => {
    e.stopPropagation();
    // console.log(e);
    if (!e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      console.log("create");
      setOpenEmoji(false);

      if (isLoadingCm || !valueComment) return;
      let res = await createCommentShortVideo({
        accessToken,
        idShortVideo,
        content: valueComment,
      });
      setIsLoadingCm(true);
      if (res?.errCode === 0) {
        setValueComment("");
        setIsLoadingCm(false);
        textareaEl.current.blur();

        let date = new Date().getTime();
        let newComment = {
          User: currentUser,
          content: valueComment,
          id: res.idCmt,
        };
        let arr = [...listComment];
        arr.unshift(newComment);
        setListComment(arr);
        changCountComment(1);
        // getListComment(offset)
      } else {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: res?.errMessage || "Đã có lỗi xảy ra!",
        });
        setIsLoadingCm(false);
      }
    }
  };

  const handleClickEmoij = (isFocus) => {
    console.log(isFocus);
    if (isFocusTextarea) {
      textareaEl.current.focus();
    }
    setOpenEmoji(!openEmoji);
  };

  const onSelectEmoji = (value) => {
    textareaEl.current.focus();
    setValueComment((pre) => pre + value.native);
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

  const handleDeleteCommentShortVideo = async (idCommemtShortVideo, index) => {
    let res = await deleteCommentShortVideoById({
      accessToken,
      idCommemtShortVideo,
    });
    if (res?.errCode === 0) {
      let arr = [...listComment];
      arr.splice(index, 1);
      setCountComment(countComment - 1);
      setListComment(arr);
      changCountComment(-1);
    } else {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: res?.errMessage || "Đã có lỗi xảy ra!",
      });
    }
  };

  const handleOnClickEdit = (id, content, index) => {
    setCurrentIdComment(id);
    setContentEdit(content);
    setCurrentIndexComment(index);
  };

  const handleEditComment = async (e) => {
    e.stopPropagation();

    if (!e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      setOpenEmojiEdit(false);

      if (!contentEdit) return;
      let res = await editCommentShortVideoById({
        accessToken,
        idShortVideo,
        idCommemtShortVideo: currentIdComment,
        content: contentEdit,
      });
      if (res?.errCode === 0) {
        setContentEdit("");
        setCurrentIdComment("");
        setContentEdit("");
        setCurrentIndexComment("");

        let arr = [...listComment];
        arr[currentIndexComment].content = contentEdit;

        setListComment(arr);
      } else {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: res?.errMessage || "Đã có lỗi xảy ra!",
        });
      }
    }
  };

  const handleChangeEditCommemt = (value) => {
    if (value.length <= 150) {
      setContentEdit(value);
    }
  };

  const handleClickEmoijEdit = () => {
    textareaEdit.current.focus();
    setOpenEmojiEdit(!openEmojiEdit);
  };

  const onSelectEmojiEdit = (value) => {
    if (contentEdit.length <= 150) {
      textareaEdit.current.focus();
      setContentEdit((pre) => pre + value.native);
    }
  };

  return (
    <>
      <div className={styles.list_comments}>
        {listComment?.map((item, index) => {
          return (
            <div key={item.id} className={styles.item_comment}>
              <div
                className={styles.avatar}
                style={renderAvatarUser(item?.User)}
              ></div>
              <div className={styles.content}>
                <div className={styles.author}>
                  {item?.User?.id === idAuhor && "Tác giả"}
                </div>
                <div className={styles.nameUser}>
                  {item?.User?.firstName + " " + item?.User?.lastName}
                </div>
                {currentIdComment === item.id ? (
                  <div className={styles.input}>
                    <div
                      className={styles.text}
                      dangerouslySetInnerHTML={{
                        __html: contentEdit.replaceAll("\n", "<br/>"),
                      }}
                    ></div>
                    <textarea
                      value={contentEdit}
                      ref={textareaEdit}
                      onChange={(e) => handleChangeEditCommemt(e.target.value)}
                      onKeyDown={handleEditComment}
                      // autoFocus
                    ></textarea>
                    <div className={styles.footer}>
                      <div className={styles.left}>
                        {150 - contentEdit.length + "/150"}
                      </div>
                      <div
                        className={classNames(styles.right, {
                          [styles.active]: openEmojiEdit,
                        })}
                      >
                        <div className={styles.icon}>
                          <Picker
                            data={data}
                            onEmojiSelect={onSelectEmojiEdit}
                          />
                        </div>
                        <i
                          className="fa-regular fa-face-smile"
                          onClick={handleClickEmoijEdit}
                        ></i>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={styles.text}
                    dangerouslySetInnerHTML={{
                      __html: item?.content?.replaceAll("\n", "<br/>"),
                    }}
                  ></div>
                )}
              </div>
              {item?.User?.id === idUser && !currentIdComment && (
                <button className={styles.btn}>
                  <i className="fa-solid fa-ellipsis"></i>
                  <div className={styles.options}>
                    <div
                      className={styles.option}
                      onClick={() =>
                        handleOnClickEdit(item.id, item.content, index)
                      }
                    >
                      Chỉnh sửa
                    </div>
                    <div
                      className={styles.option}
                      onClick={() =>
                        handleDeleteCommentShortVideo(item.id, index)
                      }
                    >
                      Xóa
                    </div>
                  </div>
                </button>
              )}
              {currentIdComment === item.id && (
                <div
                  className={styles.btnHuy}
                  onClick={() => {
                    setCurrentIdComment("");
                    setContentEdit("");
                    setOpenEmojiEdit(false);
                    setCurrentIndexComment("");
                  }}
                >
                  Hủy
                </div>
              )}
            </div>
          );
        })}
        {countComment - listComment.length > 20 && (
          <div
            className={styles.MoreComment}
            onClick={() => getListComment(listComment.length)}
          >
            Xem thêm 20 bình luận
          </div>
        )}
        {countComment - listComment.length < 20 &&
          countComment - listComment.length > 0 && (
            <div
              className={styles.MoreComment}
              onClick={() => getListComment(listComment.length)}
            >
              Xem thêm {countComment - listComment.length} bình luận
            </div>
          )}
      </div>
      {idUser && (
        <div
          className={classNames(styles.addComment, {
            [styles.emoji]: openEmoji,
          })}
        >
          <div
            className={styles.left}
            style={renderAvatarUser(currentUser)}
          ></div>
          <div className={styles.right}>
            <textarea
              ref={textareaEl}
              value={valueComment}
              onChange={onchaneValueComment}
              onKeyDown={handleCreateComment}
              placeholder="Viết bình luận..."
              onFocus={() =>
                setTimeout(() => {
                  setIsFocusTextarea(true);
                }, 1000)
              }
              // onBlur={() => {
              //     setOpenEmoji(false);
              //     setTimeout(() => {
              //         setIsFocusTextarea(false)
              //     }, 1000)
              // }
              // }
            ></textarea>
            <div className={styles.count}>
              {150 - valueComment.length + "/150"}
            </div>
            <div
              className={classNames(styles.icon, {
                [styles.active]: openEmoji,
              })}
            >
              {openEmoji && (
                <div className={styles.emoji}>
                  <Picker data={data} onEmojiSelect={onSelectEmoji} />
                </div>
              )}
              <i
                className="fa-regular fa-face-smile"
                onClick={() => handleClickEmoij(isFocusTextarea)}
              ></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AllShortVideo = ({
  listVideoData = [],
  indexVideo = 0,
  hideHeader = false,
  idMutedData = false,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { _isv, urlImage } = router.query;
  const [domLoaded, setDomLoaded] = useState(false);
  const isScreen860 = useMediaQuery({ query: "(max-width: 860px)" });
  const isScreen670 = useMediaQuery({ query: "(max-width: 670px)" });
  const isScreen500 = useMediaQuery({ query: "(max-width: 500px)" });
  const isScreenY1000 = useMediaQuery({ query: "(min-height: 1000px)" });
  const accessToken = useSelector((state) => state.user.accessToken);
  const showSuggessVideo = useSelector((state) => state.app.showSuggessVideo);
  const firstVideo = useRef();
  const listVideoRef = useRef();
  const [isPlay, setIsPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(idMutedData);
  const [currentVideo, setCurrentVideo] = useState(indexVideo);
  const [isWheel, setIsWheel] = useState(false);
  const [showComment, setShowComment] = useState(true);
  const [listVideo, setListVideo] = useState(listVideoData);
  const [listIdVideo, setListIdVideo] = useState([]);
  const [isAddVideo, setIsAddVideo] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [firstTime, setFirstTime] = useState(false);
  const [isShowCart, setIsShowCart] = useState(false);
  const [isShowSuggess, setIsShowSuggess] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // setCurrentVideo(indexVideo)
    // setIsMuted(idMutedData)
    if (listVideoData.length > 0) setListVideo(listVideoData);
  }, [listVideoData, indexVideo]);

  useEffect(() => {
    if (listVideo.length > 0 && !firstTime) {
      if (!listVideoRef?.current) return;

      const items = [
        ...listVideoRef?.current?.querySelectorAll(`div.${styles.wrap_video}`),
      ];
      let video = items[currentVideo].querySelector(
        `div.${styles.video} video`
      );
      video.muted = !isMuted;

      video.play();
      // firstVideo.current.play();

      items[currentVideo].scrollIntoView({
        behavior: "auto",
      });

      // load video next
      function handleloadvideonext() {
        let videoNext = items[currentVideo + 1]?.querySelector(
          `div.${styles.video} video`
        );
        videoNext?.load();
        video.removeEventListener("loadedmetadata", handleloadvideonext);
      }
      video.addEventListener("loadedmetadata", handleloadvideonext);

      // load video next
      if (listVideoData.length > 0) {
        function handleloadvideoprev() {
          let videoNext = items[currentVideo - 1]?.querySelector(
            `div.${styles.video} video`
          );
          videoNext?.load();
          video.removeEventListener("loadedmetadata", handleloadvideoprev);
        }
        video.addEventListener("loadedmetadata", handleloadvideoprev);
      }

      setFirstTime(true);
      //set show comment mobile
      if (isScreenY1000 && !isScreen670) {
        setShowComment(false);
      } else {
        setShowComment(!isScreen860);
      }
    }

    if (domLoaded) {
      let date = new Date().getTime();

      if (showSuggessVideo < date) setIsShowSuggess(true);
    }
  }, [listVideo.length, domLoaded]);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    checkLike();
    checkSave();
  }, [currentVideo, listIdVideo]);

  useEffect(() => {
    getListVideoFirst();
  }, [_isv]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const items = listVideoRef.current.querySelectorAll(
        `div.${styles.wrap_video}`
      );

      let videoCurrent = items[currentVideo].querySelector(
        `div.${styles.video} video`
      );
      if (document.visibilityState === "hidden") {
        // Người dùng đã chuyển qua trang web khác hoặc tắt trình duyệt
        console.log("roi di");

        videoCurrent.pause();
      } else {
        // Người dùng đã quay lại trang web
        console.log("quay lai");
        setIsPlay(true);
        videoCurrent.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentVideo]);

  const getListVideoFirst = async () => {
    // console.log(_isv);
    if (listVideoData.length !== 0) return;

    if (!_isv) {
      setProgress(90);
      let res = await getListShortVideo();
      if (res?.errCode === 0) {
        setListVideo(res.data);
        let arrId = res.data.map((item) => item.id);
        console.log(arrId);
        setListIdVideo(arrId);
        setProgress(100);
      }
    } else {
      // console.log('vao', _isv);
      setProgress(90);
      let res = await getListShortVideo({
        _isv,
      });
      if (res?.errCode === 0) {
        // setListVideo(res.data)

        let res2 = await getListShortVideo({
          listIdVideo: [_isv],
        });
        if (res2?.errCode === 0) {
          let arrVideo = res2.data;
          arrVideo.unshift(res.data);
          setListVideo(arrVideo);
          let arrId = res2.data.map((item) => item.id);
          arrId.push(_isv);
          setListIdVideo(arrId);
          setProgress(100);
        }
      } else {
        router.push("/home");
      }
    }
  };

  const getListVideoSecond = async () => {
    if (listVideoData.length !== 0) return;
    if (isAddVideo) return;
    let res = await getListShortVideo({
      listIdVideo,
    });
    // console.log(res);
    if (res?.errCode === 0) {
      setIsAddVideo(true);
      let arrVideoOld = listVideo.concat(res.data);
      setTimeout(() => {
        setListVideo([...arrVideoOld]);
        setIsAddVideo(false);
        if (currentVideo + 1 < listVideo.length)
          setCurrentVideo(currentVideo + 1);
      }, 700);
      let arrId = res.data.map((item) => item.id);
      let arrIdOld = listIdVideo.concat(arrId);
      setListIdVideo([...arrIdOld]);
    }
  };

  const clientY_end = useRef(0);
  const clientY_start = useRef(0);
  const height_item = useRef(false);
  const isKeyDown = useRef(false);

  useEffect(() => {
    //add event
    const hanelOnWheel = (event) => {
      console.log("wheel");
      event.preventDefault();

      if (isWheel) return;
      setIsWheel(true);
      setTimeout(() => {
        const direction = Math.sign(event.deltaY);
        if (direction === 1) {
          console.log("scroll down");
          onClickBtnDown();
        }
        if (direction === -1) {
          console.log("scroll up");
          onClickBtnUp();
        }
        setIsWheel(false);
      }, 200);
    };
    const handleTouchStart = (event) => {
      console.log(event.touches[0].clientY);
      clientY_start.current = event.touches[0].clientY;
      clientY_end.current = event.touches[0].clientY;

      const item = listVideoRef.current.querySelector(
        `div.${styles.wrap_video}`
      );
      height_item.current = item.offsetHeight;
      console.log(height_item.current);
    };

    const handleTouchMove = (event) => {
      event.preventDefault();
      clientY_end.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      console.log("current", clientY_end.current);

      if (clientY_end.current < clientY_start.current) {
        console.log("keo xuong");
        onClickBtnDown();
        listVideoRef.current.scrollTop =
          height_item.current * (currentVideo + 1);
      } else if (clientY_end.current > clientY_start.current) {
        console.log("keo len");
        onClickBtnUp();
        listVideoRef.current.scrollTop =
          height_item.current * (currentVideo - 1);
      }
    };

    const handleOnkeyDown = (event) => {
      console.log(event.keyCode);
      if (event.keyCode === 32) {
        event.preventDefault();
        if (isPlay) {
          const items = listVideoRef.current.querySelectorAll(
            `div.${styles.wrap_video}`
          );
          let videoPrev = items[currentVideo].querySelector(
            `div.${styles.video} video`
          );
          videoPrev.pause();
          setIsPlay(false);
        } else {
          const items = listVideoRef.current.querySelectorAll(
            `div.${styles.wrap_video}`
          );
          let videoPrev = items[currentVideo].querySelector(
            `div.${styles.video} video`
          );
          videoPrev.muted = !isMuted;
          videoPrev.play();
          setIsPlay(true);
        }
      }

      if (event.keyCode === 40) {
        if (!isKeyDown.current) {
          isKeyDown.current = true;
          onClickBtnDown();
        } else {
          event.preventDefault();
        }
      } else if (event.keyCode === 38) {
        if (!isKeyDown.current) {
          isKeyDown.current = true;
          onClickBtnUp();
        } else {
          event.preventDefault();
        }
      } else if (event.keyCode === 77) {
        if (isMuted) {
          setIsMuted(false);
          const items = listVideoRef.current.querySelectorAll(
            `div.${styles.wrap_video}`
          );
          let video = items[currentVideo].querySelector(
            `div.${styles.video} video`
          );
          video.muted = true;
        } else {
          setIsMuted(true);
          const items = listVideoRef.current.querySelectorAll(
            `div.${styles.wrap_video}`
          );
          let video = items[currentVideo].querySelector(
            `div.${styles.video} video`
          );
          video.muted = false;
        }
      } else if (event.keyCode === 76) {
        handleLikeShortVideo();
      }
    };
    if (domLoaded) {
      listVideoRef.current.addEventListener("wheel", hanelOnWheel);

      listVideoRef.current.addEventListener("touchstart", handleTouchStart);
      listVideoRef.current.addEventListener("touchmove", handleTouchMove);
      listVideoRef.current.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("keydown", handleOnkeyDown);
    }

    return () => {
      if (domLoaded) {
        listVideoRef?.current?.removeEventListener("wheel", hanelOnWheel);

        listVideoRef?.current?.removeEventListener(
          "touchstart",
          handleTouchStart
        );
        listVideoRef?.current?.removeEventListener(
          "touchmove",
          handleTouchMove
        );
        listVideoRef?.current?.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("keydown", handleOnkeyDown);
      }
    };
  }, [currentVideo, isMuted, isWheel, isPlay, domLoaded]);

  //play pause video
  const handlePlayVideo = (event) => {
    console.log("pause");
    let cha1 = event.target.parentElement;
    let cha2 = cha1.parentElement;
    let cha3 = cha2.parentElement;
    let video = cha3.querySelector("video");
    video.pause();
    video.muted = !isMuted;
    setIsPlay(false);
  };
  const handlePauseVideo = (event) => {
    console.log("play");
    let cha1 = event.target.parentElement;
    let cha2 = cha1.parentElement;
    let cha3 = cha2.parentElement;
    let video = cha3.querySelector("video");
    video.play();
    video.muted = !isMuted;
    setIsPlay(true);
  };

  const togglePlayVideo = (event) => {
    let video = event.target;
    if (video?.paused === true) {
      // const items = listVideoRef.current.querySelectorAll(`div.${styles.wrap_video}`);
      // items.forEach(item => {
      //     let videoPrev = item.querySelector(`div.${styles.video} video`)
      //     console.log(videoPrev);
      //     videoPrev.pause()
      // });

      console.log("play");
      video.muted = !isMuted;
      video.play();
      setIsPlay(true);
    } else if (video?.paused === false) {
      console.log("pause");
      video.muted = !isMuted;
      video.pause();
      setIsPlay(false);
    }
  };

  // toggle muted video
  const handleMutedVideo = (event) => {
    let cha1 = event.target.parentElement;
    let cha2 = cha1.parentElement;
    let cha3 = cha2.parentElement;
    let video = cha3.querySelector("video");
    video.muted = true;
    setIsMuted(false);
  };

  const handleUnMutedVideo = (event) => {
    let cha1 = event.target.parentElement;
    let cha2 = cha1.parentElement;
    let cha3 = cha2.parentElement;
    let video = cha3.querySelector("video");
    video.muted = false;
    setIsMuted(true);
  };

  // handle click btn up/ down
  const onClickBtnDown = () => {
    // console.log('length video', listVideo.length);
    // console.log('id video', listIdVideo);

    const items = listVideoRef.current.querySelectorAll(
      `div.${styles.wrap_video}`
    );
    if (currentVideo + 1 < items.length) {
      console.log("down");

      let videoPrev = items[currentVideo].querySelector(
        `div.${styles.video} video`
      );
      if (!videoPrev.paused && !videoPrev.ended) {
        videoPrev.pause();
      }

      items[currentVideo + 1].scrollIntoView({
        behavior:
          document.activeElement.tagName === "BUTTON" ? "smooth" : "auto",
      });

      let videoNext = items[currentVideo + 1].querySelector(
        `div.${styles.video} video`
      );
      videoNext.muted = !isMuted;
      videoNext.currentTime = "0";
      if (videoNext.paused || videoNext.ended) {
        videoNext.play();
      }

      //load video next
      if (items[currentVideo + 2]) {
        let videoNext1 = items[currentVideo + 2].querySelector(
          `div.${styles.video} video`
        );

        videoNext1.muted = !isMuted;
        videoNext1.currentTime = "0";
        videoNext1.load();
      }

      setCurrentVideo(currentVideo + 1);
      setIsPlay(true);
    }
    setTimeout(() => {
      isKeyDown.current = false;
    }, 1000);

    //add video
    if (listVideo.length - currentVideo < 4) {
      getListVideoSecond();
    }
  };

  const onClickBtnUp = () => {
    const items = listVideoRef.current.querySelectorAll(
      `div.${styles.wrap_video}`
    );
    if (currentVideo - 1 >= 0) {
      console.log("up");

      let videoPrev = items[currentVideo].querySelector(
        `div.${styles.video} video`
      );
      if (!videoPrev.paused && !videoPrev.ended) {
        videoPrev.pause();
      }
      // listVideoRef.current.scrollTop = scroll
      items[currentVideo - 1].scrollIntoView({
        behavior:
          document.activeElement.tagName === "BUTTON" ? "smooth" : "auto",
      });

      let videoNext = items[currentVideo - 1].querySelector(
        `div.${styles.video} video`
      );
      videoNext.muted = !isMuted;
      videoNext.currentTime = "0";
      if (videoNext.paused || videoNext.ended) {
        videoNext.play();
      }

      //load video prev
      if (items[currentVideo - 2] && listVideoData.length > 0) {
        let videoNext1 = items[currentVideo - 2].querySelector(
          `div.${styles.video} video`
        );

        videoNext1.muted = !isMuted;
        videoNext1.currentTime = "0";
        videoNext1.load();
      }

      setCurrentVideo(currentVideo - 1);
      setIsPlay(true);
    }
    setTimeout(() => {
      isKeyDown.current = false;
    }, 1000);
  };

  //logic
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

  const changCountComment = (value) => {
    let arr = [...listVideo];
    arr[currentVideo].countComment += value;
    setListVideo(arr);
  };

  const handleLikeShortVideo = async () => {
    console.log("vao");
    if (!accessToken) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Vui lòng đăng nhập để tiếp tục!",
      });
      return;
    }

    let res = await toggleLikeShortVideo({
      accessToken,
      idShortVideo: listVideo[currentVideo]?.id,
    });
    if (res?.errCode === 0) {
      let arr = [...listVideo];
      if (res.mess === "add") arr[currentVideo].countLike += 1;
      else arr[currentVideo].countLike -= 1;
      setListVideo(arr);
      checkLike();
    }
  };

  const checkLike = async () => {
    if (!accessToken || listVideo.length === 0) return;
    let res = await checkUserLikeShortVideo({
      accessToken,
      idShortVideo: listVideo[currentVideo]?.id,
    });
    if (res?.errCode === 0 && res?.mess === true) {
      setIsLike(true);
    } else setIsLike(false);
  };

  const checkSave = async () => {
    if (!accessToken || listVideo.length === 0 || !listVideo[currentVideo])
      return;
    let res = await checkSaveCollectionShortVideo({
      accessToken,
      idShortVideo: listVideo[currentVideo]?.id,
    });
    if (res?.errCode === 0) {
      setIsSave(res.mess);
    }
  };

  const handleSaveCollectionShortVideo = async (idShortVideo) => {
    if (!accessToken) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Vui lòng đăngn nhập để tiếp tục!",
      });
      return;
    }

    let res = await toggleSaveCollectionShortVideo({
      accessToken,
      idShortVideo,
    });
    if (res?.errCode === 0) {
      checkSave();
      // toast.success(res.mess === 'add' ? "Đã lưu video" : "Đã bỏ lưu", {
      //     position: "bottom-left",
      // })
    }
  };

  const handleMutedCurrentVideo = () => {
    const items = listVideoRef.current.querySelectorAll(
      `div.${styles.wrap_video}`
    );
    let video = items[currentVideo].querySelector(`div.${styles.video} video`);
    video.muted = isMuted;
    setIsMuted(!isMuted);
  };

  const handleCloseSuggess = () => {
    setIsShowSuggess(false);
    let date = new Date().getTime() + 86400000;
    dispatch({
      type: actionTypes.SET_SHOW_SUGGESS_VIDEO,
      data: date,
    });
  };

  const handleCopy = () => {
    Swal.fire({
      icon: "success",
      title: "OK",
      text: "Đã sao chép link.",
    });
  };

  const handleReport = async (idShortVideo) => {
    Swal.fire({
      title: "Báo cáo video",
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
          // let data = {
          //    accessToken,
          //    content: value,
          //    idProduct: id
          // }

          let res = await createNewReportVideo({
            accessToken,
            content: value,
            idShortVideo,
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

  if (!domLoaded) return null;
  return (
    <>
      <Head>
        <title>Video ngắn | {nameWeb}</title>
        {urlImage && <meta property="image" content={urlImage} />}
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {!hideHeader && (
        <HeaderBottom
          smaillIcon={true}
          hideSearch={false}
          hideCart={true}
          short_video={true}
        />
      )}
      <div className={styles.AllShortVideo_container}>
        <button
          ref={listVideoRef}
          className={classNames(styles.AllShortVideo_content, {
            [styles.showComment]: showComment,
          })}
        >
          {listVideo.length > 0 &&
            listVideo.map((item, index) => {
              return (
                <div key={item.id} className={styles.wrap_video}>
                  <div className={styles.video}>
                    {index === 0 ? (
                      <video
                        loop
                        ref={firstVideo}
                        preload={index !== 0 && "none"}
                        onClick={(event) => togglePlayVideo(event)}
                        muted={idMutedData}
                        poster={item?.urlImage}
                      >
                        <source
                          src={
                            process.env.RACT_APP_LNK_VIDEO_DRIVE +
                            item.idDriveVideo
                          }
                        />
                      </video>
                    ) : (
                      <video
                        loop
                        preload={index !== 0 && "none"}
                        onClick={(event) => togglePlayVideo(event)}
                        muted={idMutedData}
                        poster={item?.urlImage}
                      >
                        <source
                          src={
                            process.env.RACT_APP_LNK_VIDEO_DRIVE +
                            item.idDriveVideo
                          }
                        />
                      </video>
                    )}
                  </div>
                  <div className={styles.btns}>
                    <div className={styles.toggle_play}>
                      {isPlay ? (
                        <i
                          className="fa-solid fa-pause"
                          onClick={(event) => handlePlayVideo(event)}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-play"
                          onClick={(event) => handlePauseVideo(event)}
                        ></i>
                      )}
                    </div>
                    <div className={styles.toggle_muted}>
                      {isMuted ? (
                        <i
                          className="fa-solid fa-volume-high"
                          onClick={(event) => handleMutedVideo(event)}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-volume-xmark"
                          onClick={(event) => handleUnMutedVideo(event)}
                        ></i>
                      )}
                    </div>
                    <button className={styles.dots}>
                      <i className="fa-solid fa-ellipsis"></i>
                      <label htmlFor="">
                        <input type="checkbox" name="" id="" />
                      </label>
                      <div className={styles.btn_dot_show}>
                        <div
                          className={styles.item}
                          onClick={() =>
                            handleSaveCollectionShortVideo(item.id)
                          }
                        >
                          <div
                            className={classNames(styles.icon, {
                              [styles.active]: isSave,
                            })}
                          >
                            <i className="fa-regular fa-bookmark"></i>
                          </div>
                          <div className={styles.text}>
                            {!isSave ? "Lưu thước phim" : "Bỏ lưu thước phim"}
                          </div>
                        </div>
                        <CopyToClipboard
                          text={`${process.env.REACT_APP_FRONTEND_URL}/short-video/foryou?_isv=${item.id}`}
                          onCopy={handleCopy}
                        >
                          <div className={styles.item}>
                            <div className={styles.icon}>
                              <i className="fa-solid fa-link"></i>
                            </div>
                            <div className={styles.text}>Sao chép liên kết</div>
                          </div>
                        </CopyToClipboard>
                        <div
                          className={styles.item}
                          onClick={() => handleReport(item.id)}
                        >
                          <div className={styles.icon}>
                            <i className="fa-solid fa-bug"></i>
                          </div>
                          <div className={styles.text}>Báo cáo video</div>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className={styles.header}>
                    <Link
                      href={`/short-video/${item.User.id}`}
                      className={styles.left}
                      style={renderAvatarUser(item.User)}
                    ></Link>
                    <div className={styles.right}>
                      <Link
                        href={`/short-video/${item.User.id}`}
                        className={styles.nameUser}
                      >
                        {item.User?.firstName + " " + item.User?.lastName}
                      </Link>
                      <div className={styles.typeUser}>
                        {item.scope === "public" ? (
                          <>
                            <i className="fa-solid fa-earth-americas"></i>
                            Công khai
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-lock"></i>
                            Riêng tư
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.content}>
                    {isScreen670 && (
                      <div className={styles.header}>
                        <Link
                          href={`/short-video/${item.User.id}`}
                          className={styles.left}
                          style={renderAvatarUser(item.User)}
                        ></Link>
                        <div className={styles.right}>
                          <Link
                            href={`/short-video/${item.User.id}`}
                            className={styles.nameUser}
                          >
                            {item.User?.firstName + " " + item.User?.lastName}
                          </Link>
                          <div className={styles.typeUser}>
                            {item.scope === "public" ? (
                              <>
                                <i className="fa-solid fa-earth-americas"></i>
                                Công khai
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-lock"></i>
                                Riêng tư
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      className={styles.wrap_content}
                      dangerouslySetInnerHTML={{
                        __html: item.content?.replaceAll("\n", "<br/>"),
                      }}
                    ></div>
                    <div className={styles.hashTag}>
                      {item.hashTagVideos?.map((ht, index) => {
                        return (
                          <div
                            key={index}
                            className={styles.item}
                            onClick={() =>
                              router.push(`/product/${ht.product?.id}`)
                            }
                          >
                            #{ht.product?.nameProduct.replaceAll(" ", "")}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
        </button>
        {currentVideo !== 0 && (
          <div
            className={classNames(styles.btn_up, {
              [styles.showComment]: showComment,
            })}
            onClick={onClickBtnUp}
          >
            <i className="fa-solid fa-chevron-up"></i>
          </div>
        )}
        {currentVideo !== listVideo.length - 1 && (
          <div
            className={classNames(styles.btn_down, {
              [styles.showComment]: showComment,
            })}
            onClick={onClickBtnDown}
          >
            <i className="fa-solid fa-chevron-down"></i>
          </div>
        )}
        <div
          className={classNames(styles.extensions, {
            [styles.showComment]: showComment,
          })}
        >
          {listVideo[currentVideo]?.hashTagVideos?.length > 0 && (
            <div className={styles.wrap_icon + " " + styles.cart}>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: false,
                  [styles.showComment]: showComment,
                })}
                onClick={() => setIsShowCart(true)}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <div className={styles.text}>Sản phẩm</div>

              <div
                className={classNames(styles.cart_show, {
                  [styles.showComment]: showComment,
                  [styles.active]: isShowCart,
                })}
                onClick={() => setIsShowCart(false)}
              >
                <div
                  className={classNames(styles.content, {
                    [styles.active]: isShowCart,
                  })}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isShowCart && (
                    <ListCart idShortVideo={listVideo[currentVideo]?.id} />
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={styles.wrap_icon}>
            <div
              className={classNames(styles.icon, {
                [styles.active]: isLike,
              })}
              onClick={handleLikeShortVideo}
            >
              <i className="fa-solid fa-thumbs-up"></i>
            </div>
            <div className={styles.text}>
              {formatNumber(listVideo[currentVideo]?.countLike)}
            </div>
          </div>
          <div className={styles.wrap_icon}>
            <div
              className={classNames(styles.icon, {
                [styles.active]: showComment,
              })}
              onClick={() => setShowComment(!showComment)}
            >
              <i className="fa-solid fa-message"></i>
            </div>
            <div className={styles.text}>
              {listVideo[currentVideo]?.countComment !== 0
                ? formatNumber(listVideo[currentVideo]?.countComment)
                : "Chưa có"}
            </div>
          </div>
          <div className={styles.wrap_icon}>
            <div className={styles.icon}>
              <i className="fa-solid fa-share"></i>
              <div className={styles.Share_show}>
                <div className={styles.item}>
                  <ShareButton
                    url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/short-video/foryou?_isv=${listVideo[currentVideo]?.id}?urlImage=${listVideo[currentVideo]?.urlImage}`}
                    quote={"Noi dung chia se"}
                    hashtag={"hashtag"}
                  />
                </div>
                <div className={styles.item}>Chia sẻ ....</div>
                <div className={styles.item}>Chia sẻ ....</div>
              </div>
            </div>
            <div className={styles.text}>Chia sẻ</div>
          </div>
          {isScreen670 && (
            <div className={styles.wrap_icon}>
              <div
                className={styles.icon}
                onClick={() => handleMutedCurrentVideo()}
              >
                {isMuted ? (
                  <i className="fa-solid fa-volume-high"></i>
                ) : (
                  <i className="fa-solid fa-volume-xmark"></i>
                )}
              </div>
              <div className={styles.text}></div>
            </div>
          )}
          {isScreen670 && (
            <div className={styles.wrap_icon + " " + styles.dots}>
              <input id="inputShowOptionsMobile" type="checkbox" hidden />
              <label htmlFor="inputShowOptionsMobile" className={styles.icon}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
                <div className={styles.Share_show}>
                  <div
                    className={classNames(styles.item, {
                      [styles.active]: isSave,
                    })}
                    onClick={() =>
                      handleSaveCollectionShortVideo(
                        listVideo[currentVideo]?.id
                      )
                    }
                  >
                    <i className="fa-regular fa-bookmark"></i>
                    {!isSave ? "Lưu video" : "Bỏ lưu video"}
                  </div>
                  <CopyToClipboard
                    text={`${process.env.REACT_APP_FRONTEND_URL}/short-video/foryou?_isv=${listVideo[currentVideo]?.id}`}
                    onCopy={handleCopy}
                  >
                    <div className={styles.item}>Chia sẻ ....</div>
                  </CopyToClipboard>
                  <div className={styles.item}>Chia sẻ ....</div>
                </div>
              </label>
              <div className={styles.text}></div>
            </div>
          )}
        </div>

        <div
          className={classNames(styles.layout_comment, {
            [styles.active]: showComment,
          })}
        >
          {showComment && (
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.top}>
                  <Link
                    href={`/short-video/${listVideo[currentVideo]?.User?.id}`}
                    className={styles.left}
                    style={renderAvatarUser(listVideo[currentVideo]?.User)}
                  ></Link>
                  <div className={styles.right}>
                    <Link
                      href={`/short-video/${listVideo[currentVideo]?.User?.id}`}
                      className={styles.name}
                    >
                      {listVideo[currentVideo]?.User?.firstName +
                        " " +
                        listVideo[currentVideo]?.User?.lastName}
                    </Link>
                    <div className={styles.type}>
                      {listVideo[currentVideo]?.User?.idTypeUser === "3"
                        ? "Người dung"
                        : "Quản trị viên"}
                    </div>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div
                    className={styles.text}
                    dangerouslySetInnerHTML={{
                      __html: listVideo[currentVideo]?.content?.replaceAll(
                        "\n",
                        "<br/>"
                      ),
                    }}
                  ></div>
                  <div className={styles.hashtag}>
                    {listVideo[currentVideo]?.hashTagVideos?.map(
                      (item, index) => {
                        return (
                          <Link
                            href={`/product/${item?.product?.id}?name=${item?.product?.nameProduct}`}
                            key={index}
                            className={styles.item_hashtag}
                          >
                            #{item?.product?.nameProduct?.replaceAll(" ", "")}
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
              <ListComments
                accessToken={accessToken}
                idShortVideo={listVideo[currentVideo]?.id}
                idAuhor={listVideo[currentVideo]?.User?.id}
                changCountComment={changCountComment}
              />
              <div className={styles.iconClose}>
                <i
                  className="fa-solid fa-xmark"
                  onClick={() => setShowComment(!showComment)}
                ></i>
              </div>
            </div>
          )}
        </div>
        {!isScreen500 && (
          <div
            className={styles.poster}
            style={{
              backgroundImage: `url(${listVideo[currentVideo]?.urlImage})`,
            }}
          ></div>
        )}
        {isShowSuggess && (
          <div className={styles.suggest}>
            <div className={styles.header}>
              <i className="fa-solid fa-xmark" onClick={handleCloseSuggess}></i>
            </div>
            <div className={styles.list}>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <i className="fa-solid fa-caret-down"></i>
                </div>
                <div className={styles.label}>Chuyển đến video tiếp theo</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <i className="fa-solid fa-caret-up"></i>
                </div>
                <div className={styles.label}>Chuyển đến video trước</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={styles.text}>L</div>
                </div>
                <div className={styles.label}>Like video</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={styles.text}>Space</div>
                </div>
                <div className={styles.label}>Play / pause video</div>
              </div>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <div className={styles.text}>M</div>
                </div>
                <div className={styles.label}>Bật / tắt âm thanh</div>
              </div>
            </div>
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
    </>
  );
};

export default AllShortVideo;
