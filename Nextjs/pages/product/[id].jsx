import { useRouter } from "next/router";

import styles from "../../styles/product/detailProduct.module.scss";

import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { use, useState } from "react";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import classNames from "classnames";
import Swal from "sweetalert2";
import Background from "../../components/background";

// import { getProductById } from '../../services/graphql'
import {
  addCartProduct,
  addCartOrMoveCart,
  getListCartUser,
  shareProduct,
} from "../../services/userService";
import {
  getListProductMayLike,
  getEvaluateById,
  getProductById,
} from "../../services/appService";
// import { handleRefreshToken } from '../../store/actions/userAction'
import actionTypes from "../../store/actions/actionTypes";
// import { GetUserLoginRefreshToken } from '../../services/userService'

import Fancybox from "../../components/product/Fancybox";
import MayLike from "../../components/product/MayLike";
import { useEffect } from "react";
import Head from "next/head";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import Rating from "@mui/material/Rating";
import { Pagination } from "antd";
import { variables, checkWord } from "../../services/common";
import { Empty, QRCode } from "antd";
import Image from "next/image";
import LoadingBar from "react-top-loading-bar";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
} from "react-share";
import { nameWeb } from "../../utils/constants";

export async function getStaticProps(context) {
  try {
    // console.log(context);
    let productRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-product-by-id?idProduct=${context.params.id}`
    );
    productRes = await productRes.json();
    // console.log(productRes);
    if (!productRes) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }

    let evaluateRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-evaluate-by-id-product?idProduct=${context.params.id}&fillter=all&page=1&offset=${variables.countPageEvaluate}`
    );
    evaluateRes = await evaluateRes.json();
    let avgStart = evaluateRes?.avgStar?.toFixed(1) ?? null;
    let amountPage = evaluateRes?.amoutFiller
      ? (Math.floor(
          (evaluateRes?.amoutFiller - 1) / variables.countPageEvaluate
        ) +
          1) *
        10
      : 0;
    // console.log(evaluateRes);

    let mayLikeRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-list-product-may-like?nameTypeProduct=${productRes?.data?.typeProduct?.nameTypeProduct}&id=${context.params.id}`
    );
    mayLikeRes = await mayLikeRes.json();
    // console.log(mayLikeRes);

    return {
      props: {
        productProps: productRes?.data ?? null,
        countEvaluate: productRes?.countEvaluate ?? 0,
        persentElevate: productRes?.persentElevate ?? 0,
        evaluateData: evaluateRes?.data ?? null,
        avgStarData: avgStart,
        amount5starData: evaluateRes?.amount5star ?? null,
        amount4starData: evaluateRes?.amount4star ?? null,
        amount3starData: evaluateRes?.amount3star ?? null,
        amount2starData: evaluateRes?.amount2star ?? null,
        amount1starData: evaluateRes?.amount1star ?? null,
        amountCommentData: evaluateRes?.amountComment ?? null,
        amountImageData: evaluateRes?.amountImage ?? null,
        amountVideoData: evaluateRes?.amountVideo ?? null,
        AmountPageData: amountPage,
        mayLikeData: mayLikeRes?.data ?? [],
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log("err detail product in static props: ", e);
    return {
      props: { data: "" },
    };
  }
}

export async function getStaticPaths() {
  // Tạo ra một mảng các đối tượng path
  const paths = [
    {
      params: { id: "999f009d-5e42-44fe-a204-63f32ec04d9b" },
    },
    {
      params: { id: "e93c6669-3a7e-45c8-8c39-e0bce6b3d027" },
    },
    {
      params: { id: "7423f787-765a-4af8-beb0-48537ca6b0ec" },
    },
  ];

  // Trả về mảng path đã tạo
  return { paths, fallback: true };
}

const DetailProduct = ({
  productProps = null,
  countEvaluate,
  persentElevate = 0,
  evaluateData = null,
  avgStarData,
  amount5starData,
  amount4starData = null,
  amount3starData = null,
  amount2starData = null,
  amount1starData = null,
  amountCommentData = null,
  amountImageData = null,
  amountVideoData = null,
  AmountPageData = 0,
  mayLikeData = null,
}) => {
  const router = useRouter();
  const { id, name, classify } = router.query;
  const title =
    router && name
      ? name?.charAt(0).toUpperCase() + name?.slice(1) + ` | ${nameWeb}`
      : `${nameWeb}`;

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [product, setProduct] = useState(productProps);
  const [indexClassify, setIndexClassify] = useState(0);
  const [countProduct, setCountProduct] = useState(1);
  const inputCountProduct = useRef();
  const [isMoreInfo, setIsMoreInfo] = useState(false);
  const tagContentHtml = useRef();
  const [heightContentFromInfo, setHeightContentInfo] = useState(0);
  const [listMayLikes, setListMayLikes] = useState(mayLikeData);

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  // const refreshToken = useSelector(state => state.user.refreshToken)
  const [avgStar, setAvgStar] = useState(avgStarData);
  const [amount5sao, setAmount5Sao] = useState(amount5starData);
  const [amount4sao, setAmount4Sao] = useState(amount4starData);
  const [amount3sao, setAmount3Sao] = useState(amount3starData);
  const [amount2sao, setAmount2Sao] = useState(amount2starData);
  const [amount1sao, setAmount1Sao] = useState(amount1starData);
  const [amountComment, setAmountComment] = useState(amountCommentData);
  const [amountVideo, setAmountVideo] = useState(amountVideoData);
  const [amountImage, setAmountImage] = useState(amountImageData);
  const [listEvaluate, setListEvaluate] = useState(evaluateData);
  const [amountPage, setAmountPage] = useState(AmountPageData);
  const [currentPageEvaluate, setCurrentPageEvaluate] = useState(1);
  const [currentFillter, setCurrentFillter] = useState("all");
  const headerEvaluate = useRef();
  const [domloaded, setDomloaded] = useState(false);
  const [countEvaluateState, setCountEvalueState] = useState(countEvaluate);
  const [persentElevateState, setPersentElevateState] =
    useState(persentElevate);
  const [progress, setProgress] = useState(100);
  const [metaImage, setMetaImage] = useState("");

  // useEffect(() => {
  //    setProduct(DataProduct)
  // }, [DataProduct])

  // useEffect(() => {
  //    setListMayLikes(DataMayLike)
  // }, [DataMayLike])

  useEffect(() => {
    // setProduct(null)
    setCountProduct(1);
    setIndexClassify(0);
    setHeightContentInfo(0);
    setIsMoreInfo(false);
    // getProduct();
    setHeightContentInfo(tagContentHtml.current.getBoundingClientRect().height);
    setCurrentPageEvaluate(1);
    setCurrentFillter("all");
  }, [id]);

  useEffect(() => {
    if (
      heightContentFromInfo !==
      tagContentHtml.current.getBoundingClientRect().height
    ) {
      setHeightContentInfo(
        tagContentHtml.current.getBoundingClientRect().height
      );
    }
  });
  useEffect(() => {
    if (domloaded) getEvalueProduct();
    setDomloaded(true);
  }, [currentFillter, currentPageEvaluate, id]);

  useEffect(() => {
    // getListMayLike()
    if (domloaded) {
      getProduct();
      getListMayLike();
    }
    setDomloaded(true);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    // console.log('stt', product['classifyProduct-product'][indexClassify]?.STTImg);
    if (product["classifyProduct-product"] && classify) {
      product["classifyProduct-product"].forEach((classifyItem) => {
        if (classifyItem.id === classify) {
          product["imageProduct-product"]?.forEach((img) => {
            if (img.STTImage === classifyItem?.STTImg) {
              setMetaImage(img?.imagebase64);
            }
          });
        }
      });
    } else setMetaImage(product["imageProduct-product"][0]?.imagebase64);
  }, []);

  const getEvalueProduct = async () => {
    if (!id) return;

    let res = await getEvaluateById({
      idProduct: id,
      fillter: currentFillter,
      page: currentPageEvaluate,
      offset: variables.countPageEvaluate,
    });

    // console.log(res);
    if (res && res.errCode === 0) {
      if (res?.avgStar === 0) {
        setAvgStar(0);
      } else {
        setAvgStar(res?.avgStar?.toFixed(1));
      }
      setAmount5Sao(res.amount5star);
      setAmount4Sao(res.amount4star);
      setAmount3Sao(res.amount3star);
      setAmount2Sao(res.amount2star);
      setAmount1Sao(res.amount1star);
      setAmountComment(res.amountComment);
      setAmountImage(res.amountImage);
      setAmountVideo(res.amountVideo);
      setListEvaluate(res.data);
      setAmountPage(
        (Math.floor((res.amoutFiller - 1) / variables.countPageEvaluate) + 1) *
          10
      );
    } else {
      setListEvaluate(null);
      setAvgStar(null);
    }
  };

  const getListMayLike = async () => {
    if (!product?.typeProduct?.nameTypeProduct) return;
    // console.log('goi list may like');
    setListMayLikes(null);
    let res = await getListProductMayLike(
      product?.typeProduct?.nameTypeProduct,
      id
    );
    if (res && res.errCode === 0) {
      setListMayLikes(res.data);
    }
  };

  const getListCarts = async () => {
    let res = await getListCartUser(accessToken);
    if (res && res.errCode === 0) {
      dispatch({
        type: actionTypes.UPDATE_LIST_CART,
        data: res.data,
      });
    }
  };

  const getProduct = async () => {
    if (id) {
      setProduct(null);
      // console.log('goi api product');
      setProgress(90);
      let res = await getProductById({
        idProduct: id,
      });
      console.log(res);
      if (res?.errCode === 0) {
        setProduct(res.data);

        setCountEvalueState(res?.countEvaluate ?? 0);
        setPersentElevateState(res?.persentElevate ?? 0);
        // nav1?.slickGoTo(0)
        setProgress(100);
      } else {
        router.push("/home");
      }
    }
  };

  const settings = {
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    arrows: true,
    // dontAnimate: true,
    responsive: [
      // {
      //     breakpoint: 580,
      //     settings: {
      //         arrows: false,
      //     }
      // },
    ],
  };
  const settings2 = {
    infinite: false,
    speed: 200,
    slidesToShow: 10,
    arrows: false,
    focusOnSelect: true,
  };

  function compare(a, b) {
    if (a.STTImg > b.STTImg) return 1;
    if (b.STTImg > a.STTImg) return -1;
    return 0;
  }

  const renderImageTop = () => {
    if (!product) return;
    let listImage = [...product["imageProduct-product"]] || [];
    // console.log('list img', listImage);

    listImage.sort(compare);
    return listImage?.map((item) => {
      return (
        <div key={item.STTImage}>
          <Image
            className={styles.item}
            // style={{ backgroundImage: `url(${item.imagebase64})` }}
            data-fancybox="gallery"
            data-src={item.imagebase64}
            src={item.imagebase64}
            data-thumb={item.imagebase64}
            data-width={10000}
            data-height={10000}
            width={600}
            height={200}
            alt="Your Image Alt Text"
          ></Image>
        </div>
      );
    });
  };

  const renderImageBottom = () => {
    if (!product) return;
    // console.log(product);
    let listImage = [...product["imageProduct-product"]] || [];

    listImage.sort(compare);
    return listImage.map((item) => {
      return (
        <div key={item.STTImage}>
          <div
            style={{ backgroundImage: `url(${item.imagebase64})` }}
            className={styles.item + " item"}
          ></div>
        </div>
      );
    });
  };

  const renderPriceProduct = () => {
    if (!product) return;
    // console.log(product);

    //get price
    let price;
    if (
      product["classifyProduct-product"].length === 0 ||
      (product["classifyProduct-product"].length === 1 &&
        product["classifyProduct-product"][0].nameClassifyProduct === "default")
    ) {
      price = +product.priceProduct;
    } else {
      price = +product["classifyProduct-product"][indexClassify]?.priceClassify;
    }

    if (
      !product.promotionProducts[0] ||
      product.promotionProducts[0]?.numberPercent === 0
    ) {
      return (
        <>
          <div>Giá:</div>
          <div>{new Intl.NumberFormat("ja-JP").format(price)}₫</div>
        </>
      );
    } else {
      let date = new Date().getTime();
      let timePromotion = +product.promotionProducts[0].timePromotion;
      if (timePromotion < date) {
        return (
          <>
            <div>Giá:</div>
            <div>{new Intl.NumberFormat("ja-JP").format(price)}₫</div>
          </>
        );
      } else {
        let persent = product.promotionProducts[0]?.numberPercent;
        let pricePromotion = parseInt((price * (100 - persent)) / 100);

        return (
          <>
            <div>Giá:</div>
            <div>{new Intl.NumberFormat("ja-JP").format(pricePromotion)}₫</div>
            <div>{new Intl.NumberFormat("ja-JP").format(price)}₫</div>
            <div>-{persent}%</div>
          </>
        );
      }
    }
  };

  const renderClassifyProduct = () => {
    if (!product) return;
    if (
      product["classifyProduct-product"].length === 0 ||
      (product["classifyProduct-product"].length === 1 &&
        product["classifyProduct-product"][0].nameClassifyProduct === "default")
    ) {
      return;
    }

    let listClassifyTam = [...product["classifyProduct-product"]];
    listClassifyTam.sort(compare);

    return (
      <>
        <div className={styles.left}>
          <div>Phân loại:</div>
          <div>
            Kho:
            {listClassifyTam.map((item, index) => {
              if (indexClassify === index) return " " + item.amount;
            })}
          </div>
        </div>
        <div className={styles.right}>
          {listClassifyTam.map((item, index) => {
            if (index === indexClassify) {
              return (
                <div
                  key={index}
                  className={styles.item + " " + styles.active}
                  onClick={() => handleClickClassify(index, item)}
                >
                  {item.nameClassifyProduct}
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className={styles.item}
                  onClick={() => handleClickClassify(index, item)}
                >
                  {item.nameClassifyProduct}
                </div>
              );
            }
          })}
        </div>
      </>
    );
  };

  const handleClickClassify = (index, item) => {
    setCountProduct(1);
    if (item.STTImg !== -1) {
      nav1.slickGoTo(item.STTImg - 1);
    }
    setIndexClassify(index);
  };

  const handleAddcart = async () => {
    if (!accessToken) {
      dispatch({
        type: actionTypes.UPDATE_REDIRECT_LOGIN,
        data: router.asPath,
      });

      router.push("/account/login");
      return;
    }
    let listClassifyTam = [...product["classifyProduct-product"]];
    listClassifyTam.sort(compare);
    let amount = listClassifyTam[indexClassify].amount;
    if (!amount) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Có lỗi xảy ra, vui lòng tải lại trang và thử lại sau!",
      });
      return;
    }

    if (amount === 0) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Sản phẩm đã hết hàng!",
      });
      return;
    }

    if (+countProduct < 1) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Vui lòng chọn số lượng!",
      });
      return;
    }
    if (+countProduct > amount) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Sản phẩm trong kho không còn đủ!",
      });
      return;
    }

    let data = {
      accessToken: accessToken,
      idProduct: id,
      amount: +countProduct,
      idClassifyProduct: listClassifyTam[indexClassify].id,
    };

    let res = await addCartProduct(data);
    console.log(res);

    if (res && res.errCode === 0) {
      getListCarts();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã thêm sản phẩm vào giỏ hàng",
      });
    } else if (res && res.errCode === 4) {
      getListCarts();
      Swal.fire({
        icon: "warning",
        title: "Oh no",
        text: "Sản phẩm này đã tạm ngừng bán!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Xin lỗi",
        text: res.errMessage,
      });
      window.location.reload();
    }
  };

  const handleBuyNow = async () => {
    if (!accessToken) {
      dispatch({
        type: actionTypes.UPDATE_REDIRECT_LOGIN,
        data: router.asPath,
      });

      router.push("/account/login");
      return;
    }
    let amount = product["classifyProduct-product"][indexClassify].amount;
    if (!amount) {
      toast.warning("Có lỗi xảy ra, vui lòng tải lại trang và thử lại sau!");
      return;
    }

    if (amount === 0) {
      toast.warning("Sản phẩm đã hết hàng!");
      return;
    }

    if (+countProduct < 1) {
      toast.warning("Vui lòng chọn số lượng!");
      return;
    }
    if (+countProduct > amount) {
      toast.warning("Sản phẩm trong kho không còn đủ!");
      return;
    }

    let data = {
      accessToken: accessToken,
      idProduct: id,
      amount: +countProduct,
      idClassifyProduct: product["classifyProduct-product"][indexClassify].id,
    };

    let res = await addCartOrMoveCart(data);
    console.log(res);

    if (res && res.errCode === 0) {
      //chuyển trang giỏ hàng
      console.log("chuyển trang");
      router.push("/cart");
      return;
    }
    toast.error(res.errMessage);
    window.location.reload();
  };

  const handleCopy = () => {
    Swal.fire({
      icon: "success",
      title: "OK",
      text: "Đã sao chép Url vào khay nhớ tạm.",
    });
  };

  const linkAvatarUser = (user) => {
    if (!user) return;

    if (user?.avatarUpdate)
      return { backgroundImage: `url(${user?.avatarUpdate})` };

    if (user.typeAccount === "web") {
      return user.avatar && { backgroundImage: `url(${user.avatar})` };
    } else if (user.typeAccount === "google") {
      return (
        user.avatarGoogle && { backgroundImage: `url(${user.avatarGoogle})` }
      );
    } else if (user.typeAccount === "facebook") {
      return (
        user.avatarFacebook && {
          backgroundImage: `url(${user.avatarFacebook})`,
        }
      );
    } else if (user.typeAccount === "github") {
      return (
        user.avatarGithub && { backgroundImage: `url(${user.avatarGithub})` }
      );
    }
  };
  const nameUserEvaluate = (item) => {
    if (!item) return "";
    if (item.displayname === "true") {
      return item.User?.firstName + " " + item.User?.lastName;
    } else {
      let name = item?.User?.firstName + " " + item?.User?.lastName;
      let first = name.charAt(0);
      for (let i = 0; i < name.slice(1, name.length - 1).length; i++) {
        first = first + "*";
      }
      first = first + name.charAt(name.length - 1);
      return first;
    }
  };

  const timeEvaluate = (item) => {
    let date = new Date(item.createdAt);
    return `${date.getHours()}:${date.getMinutes()} -- ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  const classifyEvaluate = (item) => {
    if (item.detailBill.classifyProduct.nameClassifyProduct !== "default") {
      let text = item.detailBill.classifyProduct.nameClassifyProduct;
      text = text.charAt(0).toUpperCase() + text.slice(1);
      return text;
    }
    return "Không có";
  };
  const handleOnchangPageEvaluate = (page, pageSize) => {
    setCurrentPageEvaluate(page);
    headerEvaluate.current.scrollIntoView();
  };

  const handleShareProduct = () => {
    Swal.fire({
      title: "Chia sẻ sản phẩm",
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
      text: name,
      imageUrl: product["imageProduct-product"][indexClassify]?.imagebase64,
      image: `object-fit: cover`,
      imageHeight: 300,
      imageAlt: "Custom image",
      background: "#222",
      preConfirm: async (value) => {
        if (!value) {
          toast.warning("Vui lòng nhập nội dung chia sẻ!");
          return false;
        } else if (!checkWord(value)) {
          toast.warning("Nội dung chứa các từ ngữ bị cấm trên hệ thống!");
          return false;
        } else {
          let data = {
            accessToken,
            content: value,
            idProduct: id,
          };

          let res = await shareProduct(data);
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
          icon: "error",
          title: result.value?.mess || "Đã xảy ra sự cố ngoài ý muốn!",
        });
      }
    });
  };

  const handleDownLoadQRCode = () => {
    const canvas = document.getElementById("QR_Code")?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = "QRCode.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="title" content="Tiêu đề của trang web" />

        {product && <meta property="image" content={metaImage} />}
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {/* <button onClick={handleclick}>hello</button> */}
      <div
        className={styles.DetailProductContainer}
        id="DetailProductContainer"
      >
        <HeaderBottom />
        {product !== null ? (
          <div className={styles.infoProduct}>
            <div className={styles.left}>
              <div className={styles.sliderTop}>
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
                  <Slider
                    {...settings}
                    asNavFor={nav2}
                    ref={(slider) => setNav1(slider)}
                  >
                    {renderImageTop()}
                  </Slider>
                </Fancybox>
              </div>
              <div className={styles.sliderBottom + " " + "sliderBottom"}>
                <Slider
                  {...settings2}
                  asNavFor={nav1}
                  ref={(slider) => setNav2(slider)}
                >
                  {renderImageBottom()}
                </Slider>
              </div>
            </div>
            <div className={styles.right}>
              <h3>{product?.nameProduct}</h3>
              <div className={styles.statusAndTrademark}>
                <div className={styles.wrap}>
                  <div>Tình trạng:</div>
                  <div>
                    {product && product.isSell === "true" ? "Đang bán" : ""}
                    {product && product.isSell === "false" ? "Ngừng bán" : ""}
                  </div>
                </div>
                <div className={styles.wrap}>
                  <div>Thương hiệu:</div>
                  <div style={{ textTransform: "capitalize" }}>
                    {product && product.trademark?.nameTrademark}
                  </div>
                </div>
                <div className={styles.wrap}>
                  <div>
                    {product &&
                      product["classifyProduct-product"].length === 1 &&
                      product["classifyProduct-product"][0]
                        .nameClassifyProduct === "default" &&
                      "Kho:"}
                  </div>
                  <div style={{ textTransform: "capitalize" }}>
                    {product &&
                      product["classifyProduct-product"].length === 1 &&
                      product["classifyProduct-product"][0]
                        .nameClassifyProduct === "default" &&
                      product["classifyProduct-product"][0].amount}
                  </div>
                </div>
                <div className={styles.separate}></div>
                <div className={styles.wrapStar}>
                  {product && countEvaluate !== 0 ? (
                    <>
                      <div>{product && persentElevateState.toFixed(1)}</div>
                      <div style={{ textTransform: "capitalize" }}>
                        {product && (
                          <Rating
                            precision={0.1}
                            name="read-only"
                            value={persentElevateState}
                            readOnly
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    "Chưa có đánh giá"
                  )}
                </div>
                <div className={styles.wrapStar}>
                  {product && countEvaluateState !== 0 ? (
                    <>
                      <div>
                        {product &&
                          new Intl.NumberFormat("en-GB", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(countEvaluateState)}
                      </div>
                      <div style={{ textTransform: "capitalize" }}>
                        Đánh giá
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div className={styles.wrapStar}>
                  <div>
                    {product &&
                      new Intl.NumberFormat("en-GB", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(product.sold)}
                  </div>
                  <div style={{ textTransform: "capitalize" }}>Đã bán</div>
                </div>
              </div>
              <div className={styles.price}>{renderPriceProduct()}</div>
              <div className={styles.infoProductWrap}>
                <div className={styles.infoProductWrap_left}>
                  <div className={styles.classifyProduct}>
                    {renderClassifyProduct()}
                  </div>
                  <div className={styles.count}>
                    <div className={styles.title}>Số lượng:</div>
                    <div className={styles.wrapBtn}>
                      <button
                        onClick={() => {
                          inputCountProduct.current.stepDown();
                          setCountProduct(inputCountProduct.current.value);
                        }}
                      >
                        -
                      </button>
                      <input
                        value={countProduct}
                        type="number"
                        onChange={(e) => setCountProduct(e.target.value)}
                        min={1}
                        ref={inputCountProduct}
                      />
                      <button
                        onClick={() => {
                          inputCountProduct.current.stepUp();
                          setCountProduct(inputCountProduct.current.value);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.wrapBtnProduct}>
                    <div className={styles.btnAddcart} onClick={handleAddcart}>
                      <button>
                        <span>Thêm vào giỏ</span>
                        <i></i>
                      </button>
                    </div>
                    <div className={styles.btnBuy} onClick={handleBuyNow}>
                      <button className={styles["btn"]} type="button">
                        <strong>MUA</strong>
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
                  <div className={styles.iconSocial}>
                    <div className={styles.title}>Chia sẻ:</div>
                    <div className={styles.wrapIconSocial}>
                      <FacebookShareButton
                        url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}&classify=${product["classifyProduct-product"][indexClassify]?.id}`}
                        quote={"quote"}
                        hashtag={`#${product?.nameProduct.replaceAll(" ", "")}`}
                      >
                        <div className={styles.iconItem + " " + styles.fb}>
                          <i className="fa-brands fa-facebook-f"></i>
                          <div className={styles.label}>Facebook</div>
                        </div>
                      </FacebookShareButton>
                      <FacebookMessengerShareButton
                        appId={process.env.REACT_APP_APPID_FACE}
                        url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}&classify=${product["classifyProduct-product"][indexClassify]?.id}`}
                      >
                        <div className={styles.iconItem + " " + styles.msg}>
                          <i className="fa-brands fa-facebook-messenger"></i>
                          <div className={styles.label}>Messenger</div>
                        </div>
                      </FacebookMessengerShareButton>
                      <TwitterShareButton
                        title={nameWeb}
                        hashtags={["abc", "def"]}
                        url={`${process.env.REACT_APP_FRONTEND_URL_DOMAIN1}/product/${product?.id}?name=${product?.nameProduct}&classify=${product["classifyProduct-product"][indexClassify]?.id}`}
                      >
                        <div className={styles.iconItem + " " + styles.tt}>
                          <i className="fa-brands fa-twitter"></i>
                          <div className={styles.label}>Twitter</div>
                        </div>
                      </TwitterShareButton>
                      <div
                        className={styles.iconItem}
                        onClick={() => handleShareProduct()}
                      >
                        <i className="fa-solid fa-share"></i>
                        <div className={styles.label}>Chia sẻ lên bài viết</div>
                      </div>
                      <div className={styles.iconItem}>
                        <CopyToClipboard
                          text={
                            typeof window !== "undefined" &&
                            window.location.href
                          }
                          onCopy={handleCopy}
                        >
                          <div>
                            <i className="fa-solid fa-copy"></i>
                            <div className={styles.label}>Sao chép url</div>
                          </div>
                        </CopyToClipboard>
                      </div>
                      <div className={styles.iconItem}>
                        <div>
                          <i className="fa-solid fa-qrcode"></i>
                          <div
                            className={styles.label}
                            id={"QR_Code"}
                            onClick={handleDownLoadQRCode}
                          >
                            <QRCode
                              value={
                                process.env.REACT_APP_FRONTEND_URL +
                                router.asPath
                              }
                              style={{
                                marginBottom: 5,
                                marginTop: 5,
                              }}
                            />
                            Lấy mã QR code
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.infoProductWrap_right}>
                  <div className={styles.child_item}>
                    <h4>Chính sách bán hàng</h4>
                    <div className={styles.wrapItem}>
                      <div className={styles.img + " " + styles.img1}></div>
                      <div className={styles.text}>Cam kết 100% chính hãng</div>
                    </div>
                    <div className={styles.wrapItem}>
                      <div className={styles.img + " " + styles.img2}></div>
                      <div className={styles.text}>Miễn phí giao hàng</div>
                    </div>
                    <div className={styles.wrapItem}>
                      <div className={styles.img + " " + styles.img3}></div>
                      <div className={styles.text}>Hỗ trợ 24/7</div>
                    </div>
                  </div>
                  <div className={styles.child_item}>
                    <h4>Thông tin thêm</h4>
                    <div className={styles.wrapItem}>
                      <div className={styles.img + " " + styles.img4}></div>
                      <div className={styles.text}>
                        Hoàn tiền 111% nếu hàng giả
                      </div>
                    </div>
                    <div className={styles.wrapItem}>
                      <div className={styles.img + " " + styles.img5}></div>
                      <div className={styles.text}>
                        Mở hộp kiểm tra nhận hàng
                      </div>
                    </div>
                    <div className={styles.wrapItem}>
                      <div className={styles.img + " " + styles.img6}></div>
                      <div className={styles.text}>Đổi trả trong 7 ngày</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.infoProduct + " " + styles.loading}>
            <div className={styles["loader"]}></div>
          </div>
        )}

        <div
          data-aos="zoom-in-up"
          className={styles.discriptionProduct_container}
        >
          <div className={styles.discriptionProduct_content}>
            <div className={styles.header}>
              <div className={styles.title}>Chi tiết sản phẩm</div>
              <div></div>
            </div>
            <div
              className={classNames(styles.container, {
                [styles.active]: isMoreInfo,
              })}
            >
              <div ref={tagContentHtml} className={styles.content}>
                {product && (
                  <div
                    dangerouslySetInnerHTML={{ __html: product.contentHTML }}
                  />
                )}
              </div>
            </div>
            {heightContentFromInfo && heightContentFromInfo > 200 && (
              <div
                className={classNames(styles.footer, {
                  [styles.active]: isMoreInfo,
                })}
              >
                {/* <div className={styles.footerBg}></div> */}
                <div
                  className={styles.wrapBtn}
                  onClick={() => setIsMoreInfo(!isMoreInfo)}
                >
                  {!isMoreInfo && (
                    <>
                      <i className="fa-solid fa-plus"></i>
                      <div>Xem thêm nội dung</div>
                    </>
                  )}
                  {isMoreInfo && (
                    <>
                      <i className="fa-solid fa-minus"></i>
                      <div>Rút gọn nội dung</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div data-aos="zoom-in-up" className={styles.evaluateContainer}>
          <div className={styles.evaluateContent}>
            <div ref={headerEvaluate} className={styles.header}>
              Đánh giá sản phẩm
            </div>
            {avgStar === null || avgStar < 1 ? (
              <div className={styles.noEvaluate}>
                <Empty
                  description={
                    <p style={{ color: "#fff" }}>Chưa có đánh giá</p>
                  }
                />
              </div>
            ) : (
              <>
                <div className={styles.filler}>
                  <div className={styles.left}>
                    <div className={styles.top}>
                      <div className={styles.number}>{avgStar}</div>
                      <div className={styles.text}>trên 5</div>
                    </div>
                    <div className={styles.bottom}>
                      <Rating
                        size="large"
                        name="read-only"
                        value={avgStar}
                        precision={0.1}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.listBtn}>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "all",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("all");
                        }}
                      >
                        <div className={styles.text}>Tất cả</div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "5",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("5");
                        }}
                      >
                        <div className={styles.text}>5 sao</div>
                        <div className={styles.count}>
                          {amount5sao === 0 ? "" : `(${amount5sao})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "4",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("4");
                        }}
                      >
                        <div className={styles.text}>4 sao</div>
                        <div className={styles.count}>
                          {amount4sao === 0 ? "" : `(${amount4sao})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "3",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("3");
                        }}
                      >
                        <div className={styles.text}>3 sao</div>
                        <div className={styles.count}>
                          {amount3sao === 0 ? "" : `(${amount3sao})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "2",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("2");
                        }}
                      >
                        <div className={styles.text}>2 sao</div>
                        <div className={styles.count}>
                          {amount2sao === 0 ? "" : `(${amount2sao})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "1",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("1");
                        }}
                      >
                        <div className={styles.text}>1 sao</div>
                        <div className={styles.count}>
                          {amount1sao === 0 ? "" : `(${amount1sao})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "comment",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("comment");
                        }}
                      >
                        <div className={styles.text}>Có Bính Luận</div>
                        <div className={styles.count}>
                          {amountComment === 0 ? "" : `(${amountComment})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "image",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("image");
                        }}
                      >
                        <div className={styles.text}>Có Hình Ảnh</div>
                        <div className={styles.count}>
                          {amountImage === 0 ? "" : `(${amountImage})`}
                        </div>
                      </div>
                      <div
                        className={classNames(styles.btn, {
                          [styles.active]: currentFillter === "video",
                        })}
                        onClick={() => {
                          setCurrentPageEvaluate(1);
                          setCurrentFillter("video");
                        }}
                      >
                        <div className={styles.text}>Có Video</div>
                        <div className={styles.count}>
                          {amountVideo === 0 ? "" : `(${amountVideo})`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.List_Evaluate}>
                  {listEvaluate &&
                    listEvaluate.length > 0 &&
                    listEvaluate.map((item) => {
                      return (
                        <div key={item.id} className={styles.Item_Evaluate}>
                          <div className={styles.left}>
                            <div
                              className={styles.avatar}
                              style={linkAvatarUser(item.User)}
                            ></div>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.nameUser}>
                              {nameUserEvaluate(item)}
                            </div>
                            <div className={styles.star}>
                              <Rating
                                size="small"
                                name="read-only"
                                value={item.starNumber}
                                readOnly
                              />
                            </div>
                            <div className={styles.time_and_classify}>
                              {timeEvaluate(item)} | Phân loại hàng:{" "}
                              {classifyEvaluate(item)}
                            </div>
                            <div className={styles.text_evaluate}>
                              <div className={styles.text}>{item.content}</div>
                            </div>
                            <div className={styles.List_media}>
                              {item?.videoEvaluateProduct?.videobase64 && (
                                <div className={styles.item_video}>
                                  <iframe
                                    src={item?.videoEvaluateProduct?.videobase64?.replace(
                                      "view",
                                      "preview"
                                    )}
                                    allow="autoplay"
                                  ></iframe>
                                </div>
                              )}

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
                                      "rotateCCW",
                                      "rotateCW",
                                      "flipX",
                                      "flipY",
                                    ],
                                  },
                                }}
                              >
                                {item?.imageEvaluateProducts?.map((img) => {
                                  return (
                                    <div
                                      key={img.id}
                                      className={styles.item_media}
                                    >
                                      <Image
                                        className={styles.img}
                                        data-fancybox="gallery1"
                                        data-src={img.imagebase64}
                                        data-thumb={img.imagebase64}
                                        // style={{ backgroundImage: `url(${img.imagebase64})` }}
                                        src={img.imagebase64}
                                        alt="sfsdf"
                                        height={600}
                                        width={400}
                                        data-width={10000}
                                        data-height={10000}
                                      ></Image>
                                    </div>
                                  );
                                })}
                              </Fancybox>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className={styles.pagination}>
                  {amountPage && amountPage >= 20 ? (
                    <Pagination
                      defaultCurrent={1}
                      total={amountPage}
                      onChange={handleOnchangPageEvaluate}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <MayLike listMayLikes={listMayLikes} />

        <div className={styles.bg_detailProduct}></div>
        <Background />
        <FooterHome />
      </div>
    </>
  );
};

export default DetailProduct;
