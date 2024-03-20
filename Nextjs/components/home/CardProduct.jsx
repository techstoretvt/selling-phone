import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import LazyLoad from "react-lazyload";
import { addCartProduct, getListCartUser } from "../../services/userService";

import styles from "../../styles/home/CardProduct.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import actionTypes from "../../store/actions/actionTypes";

const CardProduct = ({ product, handleOpenModalPreview }) => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();

  // useEffect(() => {
  //     console.log(product);
  // }, [product])

  const renderPriceProduct = () => {
    if (!product) return;

    let price;
    if (
      product["classifyProduct-product"]?.length === 1 &&
      product["classifyProduct-product"][0]?.nameClassifyProduct === "default"
    ) {
      price = +product.priceProduct;
    } else {
      price = +product["classifyProduct-product"][0]?.priceClassify;
    }

    if (product.promotionProducts?.length === 0) {
      return (
        <>
          <div className={styles["price"]}>
            <div className={styles["price-number"] + " " + styles.active}>
              {new Intl.NumberFormat("ja-JP").format(price)} VND
            </div>
          </div>
          <div className={styles["price-promotion"]}></div>
        </>
      );
    }

    let timePromotion = +product.promotionProducts[0].timePromotion;
    let time = new Date().getTime();

    if (timePromotion > time) {
      let persent = product.promotionProducts[0].numberPercent;
      let pricePromotion = parseInt(price - (price * persent) / 100);

      return (
        <>
          <div className={styles["price-promotion"]}>
            {new Intl.NumberFormat("ja-JP").format(pricePromotion)} VND
          </div>
          <div className={styles["price"]}>
            <div className={styles["price-number"]}>
              {new Intl.NumberFormat("ja-JP").format(price)} VND
            </div>
            <div className={styles["price-number-promotion"]}>{persent}%</div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles["price"]}>
            <div className={styles["price-number"] + " " + styles.active}>
              {new Intl.NumberFormat("ja-JP").format(price)} VND
            </div>
          </div>
          <div className={styles["price-promotion"]}></div>
        </>
      );
    }
  };

  const linkProduct = useMemo(() => {
    return (
      (product &&
        product.id &&
        `/product/${product.id}?name=${product.nameProduct}`) ||
      "/home"
    );
  }, [product]);

  const handleAddCart = async () => {
    if (!product) return;
    if (!accessToken) {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: "Đăng nhập để thực hiện",
      });
      return;
    }
    // console.log(product);
    let data = {
      accessToken: accessToken,
      idProduct: product?.id,
      amount: 1,
      idClassifyProduct: product["classifyProduct-product"][0]?.id,
    };

    let res = await addCartProduct(data);
    if (res?.errCode === 0) {
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

  return (
    <LazyLoad>
      <div className={styles["CardProduct-container"]}>
        <div className={styles["CardProduct-content"]}>
          <div className={styles["CardProduct-imgs"]}>
            {!product && (
              <>
                <div className={styles["img-loading"]}>
                  <PacmanLoader color={"#36d7b7"} loading={true} size={35} />
                </div>
              </>
            )}
            {product && product["imageProduct-product"]?.length >= 2 && (
              <>
                <Link href={linkProduct} className={styles["imgs-wrap"]}>
                  <div
                    className={styles["img"]}
                    style={{
                      backgroundImage: `url(${product["imageProduct-product"][0].imagebase64})`,
                    }}
                  ></div>
                  <div
                    className={styles["img"]}
                    style={{
                      backgroundImage: `url(${product["imageProduct-product"][1].imagebase64})`,
                    }}
                  ></div>
                </Link>
              </>
            )}
            {product ? (
              <>
                <div className={styles.lable1}>Yêu thích</div>
                <div className={styles.lable2}></div>
                <div
                  className={styles.preview}
                  onClick={() => handleOpenModalPreview(product)}
                >
                  <i className="fa-solid fa-eye"></i>
                </div>
                {product.isSell === "false" && (
                  <div className={styles.label3}>Tạm ngưng</div>
                )}
              </>
            ) : (
              ""
            )}
          </div>
          <div className={styles["CardProduct-bottom"]}>
            <div className={styles["trademark"]}>
              {product?.trademark?.nameTrademark}
            </div>
            <Link
              href={linkProduct}
              className={styles["name"]}
              title={product?.nameProduct}
            >
              {product?.nameProduct ? product.nameProduct : ""}
            </Link>
            {renderPriceProduct()}
          </div>
          <div className={styles.btn}>
            {/* onClick={handleAddCart */}
            <button onClick={handleAddCart}> Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </LazyLoad>
  );
};

export default React.memo(CardProduct);
