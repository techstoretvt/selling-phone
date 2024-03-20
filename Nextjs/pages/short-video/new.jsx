import Head from "next/head";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import styles from "../../styles/short-video/newShortVideo.module.scss";
import { useEffect, useRef, useState } from "react";
import { Select, Space } from "antd";
import { getListHashTag } from "../../services/appService";
import {
  createNewShortVideo,
  uploadCoverImageShortVideo,
  uploadVideoForShortVideo,
} from "../../services/userService";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import classNames from "classnames";
import { nameWeb } from "../../utils/constants";
// import dynamic from 'next/dynamic'
// import * as ffmpeg from 'ffmpeg.js';
// const ffmpeg = dynamic(
//     () => import('ffmpeg.js'), {
//     ssr: false
// }

// )

const NewShortVideo = () => {
  const router = useRouter();
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
  const [progress, setProgress] = useState(0);
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    handleGetListHashTag();

    return () => {
      if (URL && urlVideo) {
        URL.revokeObjectURL(urlVideo);
      }
    };
  }, []);

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

  const handleUpvideo = async (event) => {
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
    console.log(value);
    if (currentHashTag.length === 5) return;
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

  const handleCreateNewShortVideo = async () => {
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
    if (loadingCreate) return;
    setLoadingCreate(true);
    let data = {
      accessToken,
      content: contentVideo,
      scope: scope,
      listHashTag: currentHashTag || [],
    };
    setProgress(90);
    let res = await createNewShortVideo(data);
    if (res && res.errCode === 0) {
      let idShortVideo = res.idShortVideo;

      if (urlImage) {
        let form = new FormData();
        form.append("file", fileImage);
        uploadCoverImageShortVideo(form, idShortVideo);
      }

      if (urlVideo) {
        let form = new FormData();
        form.append("video", fileVideo);
        uploadVideoForShortVideo(form, idShortVideo);
      }
      setProgress(100);
      // toast.success("Tải video thành công.")
      router.push("/short-video/user");
    } else {
      setProgress(100);
      setLoadingCreate(false);
      toast.error(res?.errMessage || "Có lỗi xảy ra!");
      return;
    }
  };

  return (
    <>
      <Head>
        <title>Tạo video mới | {nameWeb}</title>
      </Head>
      <HeaderBottom hideSearch={false} />
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles.NewShortVideo_container}>
        <div className={styles.NewShortVideo_content}>
          <div className={styles.header}>
            <div className={styles.title}>Tải video mới</div>
            <div className={styles.description}>
              Thêm video mới vào tài khoản của bạn
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
                  value={currentHashTag}
                  onChange={handleChangeHashTag}
                  options={listHashTag}
                  filterOption={handleFillter}
                  optionFilterProp="label"
                  placement="topLeft"
                  onClear={() => setCurrentHastTag([])}
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
                />
              </div>
              <div className={styles.btn}>
                {/* <button
                                    onClick={handleCreateNewShortVideo}
                                >Đăng</button> */}
                <button onClick={handleCreateNewShortVideo}>
                  <p className={styles["icon_shadow"]}>
                    Tạo video
                    <svg
                      fillRule="nonzero"
                      height="40px"
                      width="40px"
                      viewBox="0,0,256,256"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        style={{ mixBlendMode: "normal" }}
                        textAnchor="none"
                        fontSize="none"
                        fontWeight="none"
                        fontFamily="none"
                        strokeDashoffset="0"
                        strokeDasharray=""
                        strokeMiterlimit="10"
                        strokeLinejoin="miter"
                        strokeLinecap="butt"
                        strokeWidth="1"
                        stroke="none"
                        fillRule="nonzero"
                        fill="#ff206e"
                      >
                        <g transform="scale(5.12,5.12)">
                          <path d="M9.00586,0c-0.26622,-0.00153 -0.52207,0.10314 -0.71087,0.29084c-0.1888,0.1877 -0.29497,0.44293 -0.29499,0.70916c0,0 -0.00031,2.83655 0.64063,6.42578c0.61624,3.45096 1.81717,7.63635 4.30078,10.82617c-0.03223,0.09658 -0.07,0.1913 -0.09375,0.29102c-0.51237,2.15694 -2.24793,7.75515 -3.67969,9.90234c-0.1714,0.25672 -0.21465,0.5782 -0.11719,0.87109c0.45954,1.38222 1.56103,3.62778 3.01758,6.31836c-0.01566,0.04013 -0.0287,0.08123 -0.03906,0.12305c-0.86684,3.46737 -4.47656,5.34766 -4.47656,5.34766c-0.38199,0.19127 -0.60031,0.60406 -0.54342,1.02745c0.05689,0.42339 0.37644,0.7639 0.79537,0.84755c0,0 4.31619,0.94287 7.71289,-1.3125c0.91656,1.52521 1.87104,3.06527 2.83594,4.55469c0.65113,1.06549 1.71842,1.81101 2.94141,2.05664c0.00065,0 0.0013,0 0.00195,0l3.50781,0.70117c0.12894,0.02568 0.26168,0.02568 0.39062,0l3.50781,-0.70117c1.22163,-0.24407 2.28615,-0.98944 2.9375,-2.05078c0.98284,-1.49004 1.95099,-3.02074 2.87695,-4.53516c3.39115,2.22499 7.67773,1.28711 7.67773,1.28711c0.41893,-0.08365 0.73848,-0.42416 0.79537,-0.84755c0.05689,-0.42339 -0.16143,-0.83618 -0.54342,-1.02745c0,0 -3.60972,-1.88028 -4.47656,-5.34766c-0.00187,-0.00718 -0.00383,-0.01434 -0.00586,-0.02148c1.46264,-2.68934 2.55988,-4.95683 2.99609,-6.45703c0.08216,-0.2834 0.03499,-0.58862 -0.12891,-0.83398c-1.43176,-2.1472 -3.1673,-7.74433 -3.67969,-9.90039c-0.0239,-0.10033 -0.06127,-0.19575 -0.09375,-0.29297c2.48361,-3.18982 3.68454,-7.37521 4.30078,-10.82617c0.64093,-3.58924 0.64063,-6.42578 0.64063,-6.42578c0.00009,-0.27036 -0.10929,-0.52924 -0.3032,-0.71764c-0.19392,-0.1884 -0.45584,-0.29025 -0.72609,-0.28236c-0.36819,0.01085 -0.70062,0.22321 -0.86523,0.55273c0,0 -1.22717,2.45223 -3.06836,5.27539c-1.83801,2.81828 -4.33608,5.97912 -6.53906,7.30664c-0.01664,-0.01026 -0.03357,-0.02003 -0.05078,-0.0293l-4,-2c-0.23724,-0.11863 -0.5119,-0.13815 -0.76353,-0.05427c-0.25164,0.08388 -0.45965,0.26429 -0.57826,0.50153l-0.10547,0.21094l-0.10547,-0.21094c-0.16817,-0.33628 -0.51075,-0.54982 -0.88672,-0.55273c-0.15789,-0.00126 -0.31384,0.03488 -0.45508,0.10547l-4,2c-0.01721,0.00927 -0.03414,0.01904 -0.05078,0.0293c-2.20298,-1.32752 -4.70105,-4.48836 -6.53906,-7.30664c-1.84119,-2.82316 -3.06836,-5.27539 -3.06836,-5.27539c-0.16849,-0.3369 -0.51199,-0.55055 -0.88867,-0.55273zM10.44922,5.48047c0.40281,0.67844 0.33529,0.67075 0.83789,1.44141c1.72202,2.64044 3.92494,5.59777 6.39063,7.38477l-3.50195,2.25781c-1.92627,-2.72329 -3.0125,-6.38833 -3.56641,-9.49023c-0.15981,-0.89493 -0.07317,-0.83633 -0.16016,-1.59375zM39.55078,5.48047c-0.08698,0.75742 -0.00035,0.69882 -0.16016,1.59375c-0.55406,3.10275 -1.64109,6.76867 -3.56836,9.49219l-3.50195,-2.25781c2.46659,-1.78682 4.67004,-4.74549 6.39258,-7.38672c0.5026,-0.77065 0.43508,-0.76296 0.83789,-1.44141zM27.05469,13.64453l2.44922,1.22461l5.24023,3.37891c0.22849,0.20156 0.3928,0.46551 0.46289,0.75977c0.5267,2.2163 1.97899,7.09786 3.70508,9.98047c-0.41087,1.29136 -1.51905,3.66685 -3.10156,6.52734c-0.11737,0.21216 -0.25142,0.44161 -0.37305,0.6582c-0.01256,0.00818 -0.02493,0.01665 -0.03711,0.02539l-2.72266,2.04297c-0.65602,0.49221 -1.4544,0.75781 -2.27539,0.75781h-0.2832c-0.95071,0 -1.87171,0.40914 -2.49414,1.1543c-0.67926,0.81273 -1.96214,1.8457 -2.625,1.8457c-0.66286,0 -1.94574,-1.03297 -2.625,-1.8457c-0.00065,-0.00065 -0.0013,-0.0013 -0.00195,-0.00195c-0.623,-0.7441 -1.54204,-1.15234 -2.49219,-1.15234h-0.2832c-0.82099,0 -1.61937,-0.2656 -2.27539,-0.75781l-2.5957,-1.94727c-0.15289,-0.27378 -0.33972,-0.58094 -0.48633,-0.84766c-1.57979,-2.87411 -2.7014,-5.22715 -3.14648,-6.46875c1.72375,-2.88394 3.17302,-7.75751 3.69922,-9.97266c0.07009,-0.29424 0.23442,-0.55626 0.46289,-0.75781l5.24024,-3.37891l2.41211,-1.20508c-0.17792,0.99687 -0.619,1.95257 -1.23828,2.91016c-1.033,1.622 -2.63797,3.33278 -2.66797,5.42578c-0.054,1.329 0.94872,2.75319 1.76172,3.49219c1.081,0.994 1.65347,2.07444 1.85547,3.52344c0.056,0.429 0.72267,0.41637 0.76367,-0.01562c0.268,-1.571 -0.38119,-3.37231 -1.36719,-4.57031c-2.357,-2.458 -0.04634,-4.32659 1.47266,-6.68359c0.5319,-0.8034 1.01497,-1.75086 1.28711,-2.77344c0.1517,0.03525 0.30954,0.03458 0.46094,-0.00195c0.35062,1.17299 0.9477,2.34876 1.27344,2.77734c1.519,2.357 3.82966,4.22459 1.47266,6.68359c-0.986,1.198 -1.63519,2.99736 -1.36719,4.56836c0.037,0.431 0.70567,0.44562 0.76367,0.01563c0.203,-1.448 0.77447,-2.52944 1.85547,-3.52344c0.489,-0.522 1.13328,-1.14213 1.48828,-2.07813c1.36175,-3.76223 -3.13108,-6.34958 -3.66797,-9.76953zM14.02148,24.43555c-0.28236,-0.0058 -0.554,0.10805 -0.74785,0.31343c-0.19385,0.20538 -0.29182,0.48315 -0.26973,0.7647c0,0 0.10863,1.46594 0.60156,3.09375c0.49293,1.62781 1.34722,3.59721 3.26758,4.32813c0.99298,0.37769 2.03753,0.34296 2.87305,0.26758c0.83552,-0.07538 1.48438,-0.23047 1.48438,-0.23047c0.26102,-0.06188 0.48624,-0.22602 0.62507,-0.45557c0.13883,-0.22954 0.17962,-0.50523 0.11321,-0.76514c0,0 -0.67774,-2.64234 -3.34375,-3.95703c-1.86724,-0.92051 -3.89258,-3.03906 -3.89258,-3.03906c-0.18388,-0.19856 -0.44038,-0.31413 -0.71094,-0.32031zM35.94727,24.4375c-0.2593,0.01386 -0.50305,0.12802 -0.67969,0.31836c0,0 -2.02534,2.11855 -3.89258,3.03906c-2.66601,1.3147 -3.34375,3.95703 -3.34375,3.95703c-0.06641,0.25991 -0.02562,0.5356 0.11321,0.76514c0.13883,0.22954 0.36405,0.39369 0.62507,0.45557c0,0 0.64886,0.15509 1.48438,0.23047c0.83552,0.07538 1.88006,0.11011 2.87305,-0.26758c1.92036,-0.73091 2.77464,-2.70031 3.26758,-4.32812c0.49293,-1.62781 0.60156,-3.09375 0.60156,-3.09375c0.02227,-0.28685 -0.08007,-0.56939 -0.28088,-0.77543c-0.20081,-0.20604 -0.48062,-0.31562 -0.76795,-0.30074zM15.53125,28.05469c0.68725,0.54202 1.36291,1.11611 2.20898,1.5332c0.89522,0.44146 1.43599,1.07873 1.78125,1.61914c-0.67935,0.05639 -1.49476,0.02582 -1.9375,-0.14258c-0.87935,-0.33469 -1.63087,-1.63351 -2.05273,-3.00977zM34.46875,28.05469c-0.42186,1.37626 -1.17338,2.67507 -2.05273,3.00977c-0.44274,0.1684 -1.25815,0.19897 -1.9375,0.14258c0.34526,-0.54041 0.88603,-1.17768 1.78125,-1.61914c0.84608,-0.4171 1.52174,-0.99118 2.20898,-1.5332zM27.99219,33.98633c-0.40904,-0.00235 -0.77828,0.24463 -0.93227,0.62358c-0.15399,0.37895 -0.06169,0.81348 0.23305,1.09712c0.29454,0.29454 0.30273,0.48463 0.31836,0.52344c-0.04939,0.01724 -0.07535,0.04102 -0.25391,0.04102c-0.20398,0.00033 -0.40298,0.06303 -0.57031,0.17969l-1.26953,0.88086c-0.325,0.22538 -0.71016,0.22538 -1.03516,0l-1.26953,-0.88086c-0.16733,-0.11666 -0.36633,-0.17935 -0.57031,-0.17969c-0.17855,0 -0.20452,-0.02378 -0.25391,-0.04102c0.01563,-0.03881 0.02382,-0.2289 0.31836,-0.52344c0.29576,-0.28749 0.38469,-0.72707 0.22393,-1.10691c-0.16075,-0.37985 -0.53821,-0.62204 -0.9505,-0.60988c-0.2598,0.00774 -0.50638,0.11632 -0.6875,0.30273c-0.65827,0.65827 -1.10429,1.48152 -0.91602,2.41602c0.09414,0.46725 0.40294,0.92546 0.82422,1.19336c0.27576,0.17536 0.61685,0.19088 0.94336,0.24219l1.19727,0.83008c0.993,0.68862 2.3234,0.68862 3.31641,0l1.19727,-0.83008c0.32651,-0.05131 0.6676,-0.06683 0.94336,-0.24219c0.42128,-0.2679 0.73008,-0.72611 0.82422,-1.19336c0.18827,-0.93449 -0.25774,-1.75774 -0.91602,-2.41602c-0.18714,-0.19448 -0.44495,-0.30507 -0.71484,-0.30664zM13.35352,37.92188c0.37242,0.65914 0.75112,1.32264 1.15039,2.00586c-1.10139,0.73582 -2.40406,1.03593 -3.54492,1.14258c0.85618,-0.7877 1.75413,-1.82683 2.39453,-3.14844zM36.69336,38.01172c0.63728,1.27795 1.51135,2.28918 2.34766,3.05859c-1.12109,-0.1048 -2.39911,-0.39549 -3.48828,-1.10352c0.39398,-0.66374 0.77367,-1.31354 1.14063,-1.95508zM17.21094,40.41211c0.75295,0.34535 1.54863,0.58789 2.38672,0.58789h0.2832c0.37786,0 0.72803,0.16165 0.95898,0.4375c0.4435,0.53063 1.0736,1.23111 1.86523,1.77344c-0.67877,0.0717 -1.43942,0.09054 -2.00781,0.18359c-0.9398,0.15372 -1.86873,-0.28465 -2.36328,-1.10937zM32.63867,40.49219l-1.19336,1.90625c-0.52279,0.83632 -1.49107,1.24907 -2.45703,1.04883c-0.49569,-0.10254 -1.17427,-0.11834 -1.76172,-0.19727c0.8235,-0.54705 1.47803,-1.26937 1.93359,-1.81445c0.22957,-0.27484 0.5797,-0.43555 0.95898,-0.43555h0.2832c0.78054,0 1.52637,-0.20718 2.23633,-0.50781zM25,45c1.25356,0 2.55018,0.19239 3.58398,0.40625c0.37725,0.0782 0.75597,0.09392 1.12891,0.07227c-0.35918,0.42637 -0.84664,0.72726 -1.40039,0.83789c0,0.00065 0,0.0013 0,0.00195l-3.3125,0.66211l-3.31055,-0.66211h-0.00195c-0.58016,-0.11692 -1.08502,-0.44352 -1.44727,-0.90234c0.25811,0.0054 0.5181,-0.00611 0.7793,-0.04883c1.15191,-0.18858 2.62598,-0.36719 3.98047,-0.36719z"></path>
                        </g>
                      </g>
                    </svg>
                  </p>
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
                {
                  // urlVideo &&
                  <div
                    className={classNames(styles.preview, {
                      [styles.active]: urlVideo ? true : false,
                    })}
                  >
                    <video ref={video} controls>
                      <source src={urlVideo} type="video/mp4" />
                    </video>
                  </div>
                }

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

export default NewShortVideo;
