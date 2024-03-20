import Head from "next/head";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import styles from "../../styles/short-video/EditShortVideo.module.scss";
import { useEffect, useRef, useState } from "react";
import { Select, Space } from "antd";
import { getListHashTag } from "../../services/appService";
import {
  uploadCoverImageShortVideo,
  uploadVideoForShortVideo,
  getShortVideoById,
  updateShortVideo,
} from "../../services/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import { nameWeb } from "../../utils/constants";

let linkVideoDrive = "https://drive.google.com/uc?export=download&id=";

const EditShortVideo = () => {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector((state) => state.user.accessToken);
  const [urlVideo, setUrlVideo] = useState("");
  const [fileVideo, setFileVideo] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [fileImage, setFileImage] = useState("");
  const video = useRef();
  const [listHashTag, setListHashTag] = useState([]);
  const [currentHashTag, setCurrentHastTag] = useState([]);
  const [scope, setScope] = useState("public");
  const [contentVideo, setContentVideo] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    handleGetListHashTag();
  }, []);

  useEffect(() => {
    getShortVideo();
  }, [id]);

  const getShortVideo = async () => {
    if (!id) return;
    let res = await getShortVideoById({
      accessToken,
      idShortVideo: id,
    });
    console.log(res);
    if (res && res.errCode === 0) {
      let video = res.data;
      setContentVideo(video.content);
      let arrHashTag = video.hashTagVideos.map((item) => {
        return item.idProduct;
      });
      setCurrentHastTag(arrHashTag);
      setScope(video.scope);
      setUrlImage(video.urlImage);
      setUrlVideo(linkVideoDrive + video.idDriveVideo);
    } else if (res && res.errCode === 3) {
      router.push("/home");
    }
  };

  const handleGetListHashTag = async () => {
    let res = await getListHashTag();
    if (res && res.errCode === 0) {
      let arr = res.data.map((item) => {
        return {
          label: item.nameProduct,
          value: item.id,
        };
      });
      setListHashTag(arr);
    }
  };

  const handleDrop = (event) => {
    let file = event.dataTransfer.files[0];
    if (file.type === "video/mp4") {
      URL.revokeObjectURL(urlVideo);
      let url = URL.createObjectURL(file);
      setUrlVideo(url);
      setFileVideo(file);
      if (video.current) video.current.load();
    }
  };
  const allowDrop = (event) => {
    event.preventDefault();
  };

  const handleUpvideo = (event) => {
    // let file = event.target.files[0]
    // if (file.size > 104857600) {
    //     toast.warning('Vui lòng chọn file có kích thướt dưới 100MB')
    //     event.target.value = ''
    //     return;
    // }

    // URL.revokeObjectURL(urlVideo)
    // let url = URL.createObjectURL(file)
    // setUrlVideo(url)
    // setFileVideo(file)
    // event.target.value = ''
    // if (video.current)
    //     video.current.load()

    if (event.target.files && event.target.files[0]?.type === "video/mp4") {
      let file = event.target.files[0];
      if (file.size > 104857600) {
        toast.warning("Vui lòng chọn file có kích thướt dưới 100MB");
        event.target.value = "";
        return;
      }
      //gắn chữ ký cho video
      let url = URL.createObjectURL(file);

      URL.revokeObjectURL(urlVideo);
      setUrlVideo(url);
      setFileVideo(file);
      event.target.value = "";

      //get poster from video
      if (video.current) {
        video.current.load();
        video.current.addEventListener("loadedmetadata", (event) => {
          setTimeout(() => {
            const canvas = document.createElement("canvas");
            canvas.width = video.current.videoWidth;
            canvas.height = video.current.videoHeight;

            const context = canvas.getContext("2d");
            context.drawImage(video.current, 0, 0, canvas.width, canvas.height);

            const image = canvas.toDataURL();
            setUrlImage(image);

            //convert base64 to file
            const arr = image.split(",");
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], "sdfsdfdsfsd", { type: mime });
            setFileImage(file);
          }, 1000);
        });
      }
    }
  };

  const handleChangeHashTag = (value) => {
    setCurrentHastTag(value);
  };

  const handleFillter = (inputValue, option) => {
    if (option.label.includes(inputValue)) return option;
  };

  const onchangScope = (value) => {
    setScope(value);
  };

  const handleUploadImage = (e) => {
    let file = e.target.files[0];
    URL.revokeObjectURL(urlImage);
    let url = URL.createObjectURL(file);
    setUrlImage(url);
    setFileImage(file);
    e.target.value = "";
  };

  const handleEditShortVideo = async () => {
    if (!contentVideo) {
      toast.warning("Nhập nội dung video");
      return;
    }
    if (!urlVideo) {
      toast.warning("Xin mời chọn video");
      return;
    }
    if (!urlImage) {
      toast.warning("Xin mời chọn ảnh bìa");
      return;
    }

    if (loadingEdit) return;
    setLoadingEdit(true);
    let data = {
      accessToken,
      content: contentVideo,
      scope: scope,
      listHashTag: currentHashTag || [],
      idShortVideo: id,
      editImage: fileImage === "",
      editVideo: fileVideo === "",
    };
    setProgress(90);
    let res = await updateShortVideo(data);

    if (res && res.errCode === 0) {
      let idShortVideo = id;

      if (fileImage !== "") {
        let form = new FormData();
        form.append("file", fileImage);
        uploadCoverImageShortVideo(form, idShortVideo);
        setFileImage("");
      }

      if (fileVideo !== "") {
        console.log("change video");

        let form = new FormData();
        form.append("video", fileVideo);
        uploadVideoForShortVideo(form, idShortVideo);
        setFileVideo("");
      }
      setProgress(100);
      setLoadingEdit(false);
      // toast.success("Đã cập nhật video.")

      router.push("/short-video/user");
    } else {
      toast.error(res?.errMessage || "Có lỗi xảy ra!");
      setLoadingEdit(false);
      setProgress(100);
      return;
    }
  };

  return (
    <>
      <Head>
        <title>Chỉnh sửa video | {nameWeb}</title>
      </Head>
      <HeaderBottom />
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles.NewShortVideo_container}>
        <div className={styles.NewShortVideo_content}>
          <div className={styles.header}>
            <div className={styles.title}>Chỉnh sửa video</div>
            <div className={styles.description}>
              Chỉnh sửa lại video của bạn
            </div>
          </div>
          <div className={styles.wrap_content}>
            <div className={styles.left}>
              <div className={styles.content}>
                <div className={styles.label}>Nội dung</div>
                <input
                  value={contentVideo}
                  onChange={(e) => setContentVideo(e.target.value)}
                  type="text"
                  placeholder="Nội dung video..."
                />
              </div>
              <div className={styles.hashtag}>
                <div className={styles.title}>HashTag</div>
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Danh sách hashtag"
                  onChange={handleChangeHashTag}
                  options={listHashTag}
                  filterOption={handleFillter}
                  optionFilterProp="label"
                  placement="topLeft"
                  value={currentHashTag}
                />
              </div>
              <div className={styles.coverImage}>
                <div className={styles.title}>Ảnh bìa</div>
                <div className={styles.wrap}>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleUploadImage(e)}
                    />
                    {!urlImage && (
                      <div className={styles.upload}>Chọn ảnh bìa</div>
                    )}
                    {urlImage && (
                      <div
                        className={styles.preview}
                        style={{ backgroundImage: `url(${urlImage})` }}
                      ></div>
                    )}
                  </label>
                </div>
              </div>
              <div className={styles.scope}>
                <div className={styles.title}>Ai có thể xem video này!</div>
                <Select
                  defaultValue="Công khai"
                  style={{
                    width: 120,
                  }}
                  onChange={onchangScope}
                  options={[
                    {
                      label: "Công khai",
                      value: "public",
                    },
                    {
                      label: "Riêng tư",
                      value: "private",
                    },
                  ]}
                  value={scope}
                />
              </div>
              <div className={styles.btn}>
                <button
                  type="button"
                  className={styles["btn"]}
                  onClick={handleEditShortVideo}
                >
                  <strong>Lưu</strong>
                  <div id={styles["container-stars"]}>
                    <div id={styles["stars"]}></div>
                  </div>

                  <div id={styles["glow"]}>
                    <div className={styles["circle"]}></div>
                    <div className={styles["circle"]}></div>
                  </div>
                </button>
              </div>
            </div>
            <div className={styles.right}>
              <div
                className={styles.wrap}
                onDrop={(event) => handleDrop(event)}
                onDragOver={(event) => allowDrop(event)}
                onDropCapture={(event) => event.preventDefault()}
              >
                {!urlVideo && (
                  <div className={styles.top}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <div className={styles.title}>Chọn video để tải lên</div>
                    <div className={styles.discription}>
                      Hoặc kéo và thả tập tin
                    </div>
                    <div className={styles.note}>
                      MP4 hoặc WebM
                      <br />
                      Nhỏ hơn 100MB
                    </div>
                  </div>
                )}
                {urlVideo && (
                  <div className={styles.preview}>
                    <video ref={video} controls>
                      <source src={urlVideo} type="video/mp4" />
                    </video>
                  </div>
                )}

                <div className={styles.bottom}>
                  <label>
                    Chọn tập tin
                    <input
                      type="file"
                      hidden
                      accept="video/mp4"
                      onChange={handleUpvideo}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default EditShortVideo;
