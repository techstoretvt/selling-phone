import Head from "next/head";
import { useRouter } from "next/router";
import HeaderBottom from "../../components/home/HeaderBottom";
import styles from "../../styles/search/SearchPage.module.scss";
import Rating from "@mui/material/Rating";
import { getTypeAndTrademark } from "../../services/graphql";
import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  searchProduct,
  getListProductMayLike,
} from "../../services/appService";
import CardProduct from "../../components/home/CardProduct";
import ModalPreviewProduct from "../../components/home/ModalPreviewProduct";
import { Empty } from "antd";
import { Pagination } from "antd";
import FooterHome from "../../components/home/FooterHome";
import MayLike from "../../components/product/MayLike";
import LoadingBar from "react-top-loading-bar";
import RingLoader from "react-spinners/RingLoader";
import Background from "../../components/background";
import { nameWeb } from "../../utils/constants";

let maxProduct = 30;

const SearchPage = () => {
  const router = useRouter();
  const { keyword, facet, brand, status, rating, minP, maxP, page, promotion } =
    router.query;
  const date = new Date();
  const title = `${router.query.keyword ?? "Sản phẩm"} tốt nhất tháng ${
    date.getMonth() + 1
  } | ${nameWeb}`;
  const [listTrademark, setListTrademark] = useState([]);
  const [listTypeProduct, setListTypeProduct] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [errMessagePriceFiller, setErrMessagePriceFillter] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [order, setOrder] = useState("relevant");
  const [sizePagination, setSizePagination] = useState(10);
  const [isOpenMenuFillter, setIsOpenMenuFillter] = useState(false);
  const [listMayLikes, setListMayLikes] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [progress, setProgress] = useState(100);
  const [loading, setLoading] = useState(true);

  const [isShowModalPreview, setIsShowModalPreview] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");

  useEffect(() => {
    getTrademarkAndType();
  }, [keyword, facet]);

  useEffect(() => {
    if (page) setPageCurrent(+page);
  }, [page]);

  useEffect(() => {
    setListMayLikes([]);
    getListProduct();
  }, [brand, facet, status, rating, minP, maxP, page, promotion]);

  useEffect(() => {
    if (order === "asc" || order === "desc") handleOrderProduct();
    else {
      setListMayLikes([]);
      getListProduct();
    }
  }, [
    order,
    brand,
    facet,
    status,
    rating,
    minP,
    maxP,
    page,
    keyword,
    promotion,
  ]);

  useEffect(() => {
    if (listProduct.length === 0) getListMayLike();
    else {
      setListMayLikes([]);
    }
  }, [listTypeProduct, listProduct]);

  let getListMayLike = async () => {
    if (listTypeProduct.length === 0 || listProduct.length !== 0) return;
    let arrType = listTypeProduct.map((item) => item.nameTypeProduct);
    // console.log(arrType.toString());
    // return
    let res = await getListProductMayLike(arrType.toString());
    // console.log(res);
    if (res && res.errCode === 0) {
      setListMayLikes(res.data);
    }
  };

  let getListProduct = async () => {
    // if (!keyword) return

    let data = {
      keyword,
      facet,
      brand,
      status: status || "sell",
      rating,
      minP,
      maxP,
      page: page || "1",
      order,
      maxProduct,
      promotion,
    };
    setListProduct([]);
    setProgress(90);
    setLoading(true);
    let res = await searchProduct(data);
    // console.log(res);
    if (res && res.errCode === 0) {
      setListProduct(res.data);
      let size = res.countProduct;
      size = (Math.floor((size - 1) / maxProduct) + 1) * 10;
      setSizePagination(size);
      setProgress(100);
      setLoading(false);
      if (res.data.length === 0) {
        getListMayLike();
      } else {
        setListMayLikes([]);
      }
    }
  };

  let handleOrderProduct = () => {
    if (listProduct.length === 0) return;

    let arrTam = [...listProduct];
    // console.log(arrTam);

    let checkItem = arrTam[0].item ? true : false;
    if (checkItem) {
      if (order === "asc")
        for (let i = 0; i < arrTam.length - 1; i++)
          for (let j = i + 1; j < arrTam.length; j++) {
            if (
              getPriceProduct(arrTam[i].item) > getPriceProduct(arrTam[j].item)
            ) {
              let tam = arrTam[i].item;
              arrTam[i].item = arrTam[j].item;
              arrTam[j].item = tam;
            }
          }
      else
        for (let i = 0; i < arrTam.length - 1; i++)
          for (let j = i + 1; j < arrTam.length; j++) {
            if (
              getPriceProduct(arrTam[i].item) < getPriceProduct(arrTam[j].item)
            ) {
              let tam = arrTam[i].item;
              arrTam[i].item = arrTam[j].item;
              arrTam[j].item = tam;
            }
          }
    } else {
      if (order === "asc")
        for (let i = 0; i < arrTam.length - 1; i++)
          for (let j = i + 1; j < arrTam.length; j++) {
            if (getPriceProduct(arrTam[i]) > getPriceProduct(arrTam[j])) {
              let tam = arrTam[i];
              arrTam[i] = arrTam[j];
              arrTam[j] = tam;
            }
          }
      else
        for (let i = 0; i < arrTam.length - 1; i++)
          for (let j = i + 1; j < arrTam.length; j++) {
            if (getPriceProduct(arrTam[i]) < getPriceProduct(arrTam[j])) {
              let tam = arrTam[i];
              arrTam[i] = arrTam[j];
              arrTam[j] = tam;
            }
          }
    }

    setListProduct(arrTam);
  };

  let getPriceProduct = (item) => {
    if (!item) return -1;

    let priceRoot;
    if (item["classifyProduct-product"][0].nameClassifyProduct === "default") {
      priceRoot = +item.priceProduct;
    } else {
      priceRoot = item["classifyProduct-product"][0].priceClassify;
    }

    let date = new Date().getTime();
    let percent = item?.promotionProducts[0]?.numberPercent;
    let timePromotion = item?.promotionProducts[0]?.timePromotion;
    if (!percent || !timePromotion || percent === 0 || timePromotion < date) {
      return priceRoot;
    } else {
      let pricePromotion = Math.floor((priceRoot * (100 - percent)) / 100);
      return pricePromotion;
    }
  };

  let getTrademarkAndType = async () => {
    // if (!keyword) return
    let res = await getTypeAndTrademark(keyword || "all", keyword || facet);
    // console.log(res);
    if (res && res.data) {
      setListTrademark(res.data.listTrademarkSearch);
      setListTypeProduct(res.data.listTypeProductSearch);
    }
  };

  const checkTypeProduct = (name) => {
    let arrFacet = facet?.split(",") || [];
    if (arrFacet.length === 0) return false;

    for (let i = 0; i < arrFacet.length; i++) {
      arrFacet[i] = arrFacet[i]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    }

    if (arrFacet.includes(name)) return true;
    return false;
  };

  const handleClickTypeProduct = (item) => {
    setPageCurrent(1);
    let arrFacet = facet?.split(",") || [];
    let arrFacet1 = [...arrFacet];
    for (let i = 0; i < arrFacet1.length; i++) {
      arrFacet1[i] = arrFacet1[i]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    }

    if (arrFacet1.includes(item.nameTypeProductEn)) {
      arrFacet.splice(arrFacet.indexOf(item.nameTypeProduct), 1);
      let facetText = arrFacet.toString();

      var searchParams = new URLSearchParams(window.location.search);
      if (facetText === "") {
        searchParams.delete("facet");
        searchParams.delete("page");
      } else {
        searchParams.set("facet", facetText);
        searchParams.delete("page");
      }
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    } else {
      arrFacet.push(item.nameTypeProduct);
      let facetText = arrFacet.toString();

      var searchParams = new URLSearchParams(window.location.search);
      if (facetText === "") {
        searchParams.delete("facet");
        searchParams.delete("page");
      } else {
        searchParams.set("facet", facetText);
        searchParams.delete("page");
      }
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    }
  };

  const renderTypeProduct = () => {
    if (listTypeProduct && listTypeProduct.length > 0) {
      return listTypeProduct.map((item) => {
        return (
          <div
            key={item.id}
            className={classNames(styles.item, {
              [styles.active]: checkTypeProduct(item.nameTypeProductEn),
            })}
            onClick={() => handleClickTypeProduct(item)}
          >
            <div className={styles.left}>
              <i className="fa-solid fa-check"></i>
            </div>
            <div className={styles.right}>{item.nameTypeProduct}</div>
          </div>
        );
      });
    }
  };

  const checkTrademark = (name) => {
    let arrBrand = brand?.split(",") || [];
    if (arrBrand.length === 0) return false;

    for (let i = 0; i < arrBrand.length; i++) {
      arrBrand[i] = arrBrand[i]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    }

    let name2 = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    if (arrBrand.includes(name2)) return true;
    return false;
  };

  const handleClickTrademark = (item) => {
    setPageCurrent(1);
    let name1 = item;
    let name2 = item
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    let arrBrand = brand?.split(",") || [];
    let arrBrand2 = [...arrBrand];
    for (let i = 0; i < arrBrand2.length; i++) {
      arrBrand2[i] = arrBrand2[i]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
    }

    if (arrBrand2.includes(name2)) {
      arrBrand.splice(arrBrand.indexOf(name1), 1);
      let brandText = arrBrand.toString();

      var searchParams = new URLSearchParams(window.location.search);
      if (brandText === "") {
        searchParams.delete("brand");
        searchParams.delete("page");
      } else {
        searchParams.set("brand", brandText);
        searchParams.delete("page");
      }
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    } else {
      arrBrand.push(name1);
      let brandText = arrBrand.toString();

      var searchParams = new URLSearchParams(window.location.search);
      if (brandText === "") {
        searchParams.delete("brand");
        searchParams.delete("page");
      } else {
        searchParams.set("brand", brandText);
        searchParams.delete("page");
      }
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    }
  };

  const checkTrademarkOfTypeProduct = (name) => {
    if (!facet) return true;
    let arrFacet = facet.split(",");

    return arrFacet.includes(name);
  };

  const renderTrademark = () => {
    if (listTrademark && listTrademark.length > 0) {
      // console.log(facet);
      let arrNew = listTrademark.map((item) => ({
        id: item.id,
        nameTrademark: item.nameTrademark,
        nameTypeProduct: item?.typeProduct?.nameTypeProduct,
      }));
      arrNew = [...new Set(arrNew)];

      return arrNew.map((item) => {
        if (checkTrademarkOfTypeProduct(item?.nameTypeProduct))
          return (
            <div
              key={item.id}
              className={classNames(styles.item, {
                [styles.active]: checkTrademark(item.nameTrademark),
              })}
              onClick={() => handleClickTrademark(item.nameTrademark)}
            >
              <div className={styles.left}>
                <i className="fa-solid fa-check"></i>
              </div>
              <div className={styles.right}>{item.nameTrademark}</div>
            </div>
          );
      });
    }
  };

  const checkStatus = (a) => {
    if (!status) return false;
    if (a === status) {
      return true;
    }
    return false;
  };

  const hangleChangeStatusFiller = (a) => {
    setPageCurrent(1);
    var searchParams = new URLSearchParams(window.location.search);
    if (status === a) {
      searchParams.delete("status");
      searchParams.delete("page");
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    } else {
      searchParams.set("status", a);
      searchParams.delete("page");
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    }
  };

  const checkPromotion = () => {
    var searchParams = new URLSearchParams(window.location.search);
    if (promotion && promotion === "true") {
      searchParams.delete("promotion");
      router.replace(`/search?${searchParams}`);
    } else {
      searchParams.set("promotion", "true");
      router.replace(`/search?${searchParams}`);
    }
  };

  const checkRating = (a) => {
    if (!rating) return false;
    if (a === rating) {
      return true;
    }
    return false;
  };

  const handleChangeRating = (a) => {
    setPageCurrent(1);
    let searchParams = new URLSearchParams(window.location.search);
    if (rating === a) {
      searchParams.delete("rating");
      searchParams.delete("page");
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    } else {
      searchParams.set("rating", a);
      searchParams.delete("page");
      router.replace(`/search?${searchParams}`, undefined, { scroll: false });
    }
  };

  const setPriceFiller = () => {
    if (!minPrice || !maxPrice) {
      setErrMessagePriceFillter("Vui lòng điền giá trị phù hợp");
      return;
    }
    if (!Number.isInteger(+minPrice) || !Number.isInteger(+maxPrice)) {
      setErrMessagePriceFillter("Vui lòng điền giá trị phù hợp");
      return;
    }
    if (+minPrice > +maxPrice) {
      setErrMessagePriceFillter("Vui lòng điền giá trị phù hợp");
      return;
    }
    setPageCurrent(1);
    setErrMessagePriceFillter("");
    let searchParams = new URLSearchParams(window.location.search);

    searchParams.delete("page");
    searchParams.set("minP", minPrice);
    searchParams.set("maxP", maxPrice);
    router.replace(`/search?${searchParams}`, undefined, { scroll: false });
  };

  const closeModalPreview = () => {
    setIsShowModalPreview(false);
  };

  const handleOpenModalPreview = (product) => {
    setIsShowModalPreview(true);
    setCurrentProduct(product);
  };

  const handleChangePage = (page, pageSize) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page);
    router.push(`/search?${searchParams}`);
    setOrder("relevant");
    setPageCurrent(page);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <HeaderBottom />
      <div className={styles.SearchPage_container}>
        <div className={styles.SearchPage_content}>
          <div
            className={classNames(styles.Search_left, {
              [styles.active]: isOpenMenuFillter,
            })}
          >
            <div className={styles.header}>
              <i className="fa-solid fa-filter-circle-dollar"></i>
              <div className={styles.text}>Bộ lọc tìm kiếm</div>
              <div
                className={styles.iconClode}
                onClick={() => setIsOpenMenuFillter(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
            {listTypeProduct.length > 0 && (
              <>
                <div className={styles.list}>
                  <div className={styles.title}>Theo Danh Mục</div>
                  <div className={styles.list_item}>{renderTypeProduct()}</div>
                </div>
              </>
            )}
            {listTrademark?.length > 0 && (
              <>
                <div className={styles.list}>
                  <div className={styles.title}>Thương hiệu</div>
                  <div className={styles.list_item}>{renderTrademark()}</div>
                </div>
              </>
            )}
            <div className={styles.list}>
              <div className={styles.title}>Đơn vị vận chuyển</div>
              <div className={styles.list_item}>
                <label className={styles.item}>
                  <input type="checkbox" hidden />
                  <div className={styles.left}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className={styles.right}>Hỏa tốc</div>
                </label>
                <label className={styles.item}>
                  <input type="checkbox" hidden />
                  <div className={styles.left}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className={styles.right}>Nhanh</div>
                </label>
                <label className={styles.item}>
                  <input type="checkbox" hidden />
                  <div className={styles.left}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className={styles.right}>Tiết kiệm</div>
                </label>
              </div>
            </div>
            <div className={styles.group_price}>
              <div className={styles.title}>Khoảng giá</div>
              <div className={styles.wrap_input}>
                <input
                  value={minPrice}
                  type="number"
                  placeholder="₫ TỪ"
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <div className={styles.separate}></div>
                <input
                  value={maxPrice}
                  type="number"
                  placeholder="₫ ĐẾN"
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <span>{errMessagePriceFiller}</span>
              <div className={styles.btn} onClick={() => setPriceFiller()}>
                Áp dụng
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.title}>Tình trạng</div>
              <div className={styles.list_item}>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkStatus("sell"),
                  })}
                  onClick={() => hangleChangeStatusFiller("sell")}
                >
                  <div className={styles.left}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className={styles.right}>Đang bán</div>
                </div>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkStatus("nosell"),
                  })}
                  onClick={() => hangleChangeStatusFiller("nosell")}
                >
                  <div className={styles.left}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className={styles.right}>Nghĩ bán</div>
                </div>
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.title}></div>
              <div className={styles.list_item}>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: promotion === "true",
                  })}
                  onClick={() => checkPromotion()}
                >
                  <div className={styles.left}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div className={styles.right}>Khuyến mãi</div>
                </div>
              </div>
            </div>
            <div className={styles.rating}>
              <div className={styles.title}>Đánh giá</div>
              <div className={styles.list_rating}>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkRating("5"),
                  })}
                  onClick={() => handleChangeRating("5")}
                >
                  <Rating
                    name="read-only"
                    value={5}
                    readOnly
                    size="small"
                    icon={
                      <i
                        className="fa-solid fa-star"
                        style={{ margin: "0 2px" }}
                      ></i>
                    }
                    emptyIcon={
                      <i
                        className="fa-regular fa-star"
                        style={{ color: "#fff", margin: "0 2px" }}
                      ></i>
                    }
                  />
                </div>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkRating("4"),
                  })}
                  onClick={() => handleChangeRating("4")}
                >
                  <Rating
                    name="read-only"
                    value={4}
                    readOnly
                    size="small"
                    icon={
                      <i
                        className="fa-solid fa-star"
                        style={{ margin: "0 2px" }}
                      ></i>
                    }
                    emptyIcon={
                      <i
                        className="fa-regular fa-star"
                        style={{ color: "#fff", margin: "0 2px" }}
                      ></i>
                    }
                  />
                  <div className={styles.text}>Trở lên</div>
                </div>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkRating("3"),
                  })}
                  onClick={() => handleChangeRating("3")}
                >
                  <Rating
                    name="read-only"
                    value={3}
                    readOnly
                    size="small"
                    icon={
                      <i
                        className="fa-solid fa-star"
                        style={{ margin: "0 2px" }}
                      ></i>
                    }
                    emptyIcon={
                      <i
                        className="fa-regular fa-star"
                        style={{ color: "#fff", margin: "0 2px" }}
                      ></i>
                    }
                  />
                  <div className={styles.text}>Trở lên</div>
                </div>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkRating("2"),
                  })}
                  onClick={() => handleChangeRating("2")}
                >
                  <Rating
                    name="read-only"
                    value={2}
                    readOnly
                    size="small"
                    icon={
                      <i
                        className="fa-solid fa-star"
                        style={{ margin: "0 2px" }}
                      ></i>
                    }
                    emptyIcon={
                      <i
                        className="fa-regular fa-star"
                        style={{ color: "#fff", margin: "0 2px" }}
                      ></i>
                    }
                  />
                  <div className={styles.text}>Trở lên</div>
                </div>
                <div
                  className={classNames(styles.item, {
                    [styles.active]: checkRating("1"),
                  })}
                  onClick={() => handleChangeRating("1")}
                >
                  <Rating
                    name="read-only"
                    value={1}
                    readOnly
                    size="small"
                    icon={
                      <i
                        className="fa-solid fa-star"
                        style={{ margin: "0 2px" }}
                      ></i>
                    }
                    emptyIcon={
                      <i
                        className="fa-regular fa-star"
                        style={{ color: "#fff", margin: "0 2px" }}
                      ></i>
                    }
                  />
                  <div className={styles.text}>Trở lên</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.Search_right}>
            <div className={styles.header}>
              {keyword && (
                <>
                  <i className="fa-regular fa-lightbulb"></i>
                  <div className={styles.text}>
                    Kết quả tìm kiếm cho từ khoá
                  </div>
                  <div className={styles.keyword}>
                    &apos;
                    <span>{keyword}</span>
                    &apos;
                  </div>
                </>
              )}
              <div
                className={styles.iconFillterMobile}
                onClick={() => setIsOpenMenuFillter(true)}
              >
                <i className="fa-solid fa-angles-left"></i>
              </div>
            </div>
            {listProduct && listProduct.length > 0 && (
              <>
                <div className={styles.fillter}>
                  <div className={styles.text}>Sắp xếp theo</div>
                  <button
                    className={classNames({
                      [styles.active]: order === "relevant",
                    })}
                    onClick={() => setOrder("relevant")}
                  >
                    Liên quan
                  </button>
                  <button
                    className={classNames({
                      [styles.active]: order === "latest",
                    })}
                    onClick={() => setOrder("latest")}
                  >
                    Mới nhất
                  </button>
                  <button
                    className={classNames({
                      [styles.active]: order === "selling",
                    })}
                    onClick={() => setOrder("selling")}
                  >
                    Bán chạy
                  </button>
                  <div className={styles.price}>
                    <div className={styles.text}>Giá</div>
                    <select
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      <option defaultChecked hidden value=""></option>
                      <option disabled value=""></option>
                      <option value="asc">Thấp đến cao</option>
                      <option value="desc">Cao đến thâp</option>
                    </select>
                  </div>
                </div>
                <div className={styles.list_product}>
                  {listProduct &&
                    listProduct.length > 0 &&
                    listProduct.map((item) => {
                      return (
                        <div key={item.id} className={styles.wrap_product}>
                          <CardProduct
                            product={item.item ?? item}
                            handleOpenModalPreview={handleOpenModalPreview}
                          />
                        </div>
                      );
                    })}
                </div>
                <div className={styles.pagination}>
                  {sizePagination > 10 && (
                    <Pagination
                      // defaultCurrent={page || 1}
                      current={pageCurrent}
                      total={sizePagination}
                      showTitle={false}
                      showSizeChanger={false}
                      onChange={handleChangePage}
                    />
                  )}
                </div>
              </>
            )}
            {listProduct && listProduct.length === 0 && !loading && (
              <Empty
                style={{ marginTop: "30px" }}
                description={
                  <div style={{ color: "#fff" }}>
                    Không tìm thấy sản phẩm nào
                  </div>
                }
              />
            )}
            {loading && (
              <>
                <RingLoader
                  color={"red"}
                  loading={loading}
                  //   cssOverride={override}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </>
            )}
            {listMayLikes.length > 0 && !loading && (
              <div className={styles.listMayLike}>
                <div className={styles.listMayLike_header}>
                  Có thể bạn thích
                </div>
                <div className={styles.list_product_maylike}>
                  {listMayLikes.map((item, index) => {
                    return (
                      <div key={index} className={styles.item}>
                        <CardProduct
                          handleOpenModalPreview={handleOpenModalPreview}
                          product={item}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <ModalPreviewProduct
          closeModal={closeModalPreview}
          isOpen={isShowModalPreview}
          product={currentProduct}
        />
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

export default SearchPage;
