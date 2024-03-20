import { useDispatch, useSelector } from "react-redux";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import styles from "../../styles/user/purchase.module.scss";
import {
  getListBillByType,
  userCancelBill,
  userRepurchaseBill,
  hasRecievedProduct,
} from "../../services/userService";

import { useEffect } from "react";
// import actionTypes from '../../store/actions/actionTypes'
import Head from "next/head";
import { useRouter } from "next/router";
import LazyLoad from "react-lazyload";
import classNames from "classnames";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import listWordObscene from "../../services/listWordObscene.json";
import { Empty } from "antd";
import { checkLogin } from "../../services/common";
import LoadingBar from "react-top-loading-bar";
import Background from "../../components/background";
import { nameWeb } from "../../utils/constants";

const Loading = () => (
  <div className="post loading">
    <h5>Loading...</h5>
  </div>
);

const listStatusBills = ["Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

const PurchasePage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();

  const router = useRouter();
  const { type } = router.query;
  const [listBills, setListBills] = useState(null);
  const [count, setCount] = useState(null);
  const [countType1, setCountType1] = useState(0);
  const [countType2, setCountType2] = useState(0);
  // const [listCarts, setListCarts] = useState([]);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);
  const [isDifferent, setIsDifferent] = useState(false);
  const [idCurrentCancelBill, setIdCurrentCancelBill] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    checkLogin(accessToken, refreshToken, dispatch).then((res) => {
      if (!res) {
        router.push("/home");
      }
    });
  }, []);

  useEffect(() => {
    setListBills(null);
    getListBill();
    setIdCurrentCancelBill("");
    setIsOpenModalCancel(false);
    setOtherReason("");
  }, [type]);

  const getListBill = async () => {
    setListBills([]);
    if (!accessToken && !type) return;
    setProgress(90);
    let res = await getListBillByType({
      accessToken,
      type: type || "1",
      offset: 0,
    });
    if (res && res.errCode === 0) {
      setListBills([...res.data]);
      setCount(res.count);
      setCountType1(res.countType1);
      setCountType2(res.countType2);
      setProgress(100);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Chú ý",
        text: res?.errMessage || "Lỗi",
      });
    }
  };

  const onClickType = (type) => {
    router.push(`/user/purchase?type=${type}`);
  };

  const renderPrice = (item) => {
    let priceRoot;
    if (item.classifyProduct.nameClassifyProduct !== "default") {
      priceRoot = item.classifyProduct.priceClassify;
    } else {
      priceRoot = +item.product.priceProduct;
    }

    let percent =
      item.product.promotionProducts &&
      item.product.promotionProducts.length > 0 &&
      item.product.promotionProducts[0].numberPercent;
    let timePromotion =
      item.product.promotionProducts &&
      item.product.promotionProducts.length > 0 &&
      item.product.promotionProducts[0].timePromotion;
    let date = new Date().getTime();

    if (!percent || !timePromotion || percent === 0 || timePromotion < date) {
      return (
        <>
          <div className={styles.priceRoot}></div>
          <div className={styles.pricePromotion}>
            {new Intl.NumberFormat("ja-JP").format(priceRoot)}₫
          </div>
          <div className={styles.numberPercent}></div>
        </>
      );
    }

    let pricePromotion = Math.floor((priceRoot * (100 - percent)) / 100);
    return (
      <>
        <div className={styles.priceRoot}>
          {new Intl.NumberFormat("ja-JP").format(priceRoot)}₫
        </div>
        <div className={styles.pricePromotion}>
          {new Intl.NumberFormat("ja-JP").format(pricePromotion)}₫
        </div>
        <div className={styles.numberPercent}>-{percent}%</div>
      </>
    );
  };

  const renderTotals = (list) => {
    let totals = 0;
    list.forEach((item) => {
      let priceRoot;
      if (item.classifyProduct.nameClassifyProduct !== "default") {
        priceRoot = item.classifyProduct.priceClassify;
      } else {
        priceRoot = +item.product.priceProduct;
      }

      let percent =
        item.product.promotionProducts &&
        item.product.promotionProducts.length > 0 &&
        item.product.promotionProducts[0].numberPercent;
      let timePromotion =
        item.product.promotionProducts &&
        item.product.promotionProducts.length > 0 &&
        item.product.promotionProducts[0].timePromotion;
      let date = new Date().getTime();

      if (!percent || !timePromotion || percent === 0 || timePromotion < date) {
        totals += priceRoot * item.amount;
      } else {
        let pricePromotion = Math.floor((priceRoot * (100 - percent)) / 100);
        totals += pricePromotion * item.amount;
      }
    });
    return <>{new Intl.NumberFormat("ja-JP").format(totals)}₫</>;
  };

  const handleMoreBill = async () => {
    if (!accessToken) return;
    let res = await getListBillByType({
      accessToken,
      type: type || "0",
      offset: listBills?.length > 0 ? listBills?.length : 0,
    });
    if (res && res.errCode === 0) {
      setListBills([...listBills, ...res.data]);
    }
  };

  const closeModalCancel = () => {
    setIsOpenModalCancel(false);
    setIdCurrentCancelBill("");
  };

  const handleCancelBill = async (note) => {
    if (!accessToken || !idCurrentCancelBill) {
      Swal.fire({
        icon: "error",
        title: "Xin lỗi",
        text: "Có lối xảy ra vui lòng thử lại sau!",
      });
      window.location.reload();
      return;
    }
    console.log(note, "id", idCurrentCancelBill, "accessToken", accessToken);
    let res = await userCancelBill({
      accessToken,
      id: idCurrentCancelBill,
      note: note,
    });
    console.log(res);

    if (res && res.errCode === 0) {
      setIsOpenModalCancel(false);
      setIdCurrentCancelBill("");
      setOtherReason("");
      Swal.fire({
        icon: "success",
        title: "OK",
        text: "Hủy đơn thành công.",
      });
      getListBill();
    } else {
      Swal.fire({
        icon: "sucess",
        title: "Sorry",
        text: res?.errMessage || "Lỗi",
      });
    }
  };

  const handleOnclickOtherReason = () => {
    if (!otherReason.trim()) return;

    let arrText = otherReason.toLowerCase().split(" ");

    let check = true;
    arrText.forEach((item) => {
      if (listWordObscene.includes(item)) check = false;
    });

    if (check) handleCancelBill(otherReason);
    else {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Không được có lời lẽ thô tục nha bạn êk!",
      });
    }
  };

  const handleRepurchaseBill = async (id) => {
    let res = await userRepurchaseBill({
      accessToken,
      id,
    });
    console.log(res);
    if (res && res.errCode === 0) {
      router.push("/cart");
    } else {
      Swal.fire({
        icon: "sucess",
        title: "Sorry",
        text: res?.errMessage || "Lỗi",
      });
    }
  };

  const handleRecieveProduct = async (id) => {
    console.log(id);
    let res = await hasRecievedProduct({
      accessToken,
      id,
    });
    if (res && res.errCode === 0) {
      getListBill();
    } else {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: res?.errMessage || "Lỗi",
      });
    }
  };

  const renderDuKien = (createdAt) => {
    if (!createdAt) return;
    console.log(createdAt);
    let date = new Date(createdAt);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return ` ${day + 4}/${month}/${year} - ${day + 8}/${month}/${year}`;
  };

  return (
    <>
      <Head>
        <title>Đơn mua | {nameWeb}</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div>
        <HeaderBottom hideSearch={false} />
        <div className={styles.PurchasePage_container}>
          <div className={styles.PurchasePage_content}>
            <div className={styles.header}>
              <div
                className={classNames(styles.item, {
                  [styles.active]: type === "0",
                })}
                onClick={() => onClickType("0")}
              >
                Tất cả
                <span>{count !== 0 && type === "0" ? count : ""}</span>
              </div>
              <div
                className={classNames(styles.item, {
                  [styles.active]: !type || type === "1",
                })}
                onClick={() => onClickType("1")}
              >
                Chờ xác nhận
                <span>{countType1 !== 0 ? countType1 : ""}</span>
              </div>
              <div
                className={classNames(styles.item, {
                  [styles.active]: type === "2",
                })}
                onClick={() => onClickType("2")}
              >
                Đang giao
                <span>{countType2 !== 0 ? countType2 : ""}</span>
              </div>
              <div
                className={classNames(styles.item, {
                  [styles.active]: type === "3",
                })}
                onClick={() => onClickType("3")}
              >
                Hoàn thành
              </div>
              <div
                className={classNames(styles.item, {
                  [styles.active]: type === "4",
                })}
                onClick={() => onClickType("4")}
              >
                Đã hủy
              </div>
            </div>
            <div className={styles.content}>
              {listBills && listBills.length > 0 && (
                <div className={styles.listBills}>
                  {listBills.map((item, index) => {
                    return (
                      <LazyLoad key={item.id} placeholder={<Loading />}>
                        <div className={styles.itemCart}>
                          <div className={styles.header}>
                            <div className={styles.left}>
                              <div className={styles.codePurchase}>
                                Mã đơn hàng:
                                <b> {item.id}</b>
                              </div>
                              <div className={styles.timePurchase}>
                                Ngày: {item.createdAt}
                              </div>
                              <div className={styles.dukien}>
                                Dự kiến: {renderDuKien(item?.createdAt)}
                              </div>
                            </div>
                            <div className={styles.right}>
                              <div className={styles.icon}>
                                <i className="fa-regular fa-circle-question"></i>
                                <div className={styles.info}>
                                  Cập nhật mới nhất
                                  <br />
                                  {item.updatedAt}
                                </div>
                              </div>
                              <div className={styles.text}>
                                {listStatusBills[+item.idStatusBill - 1]}
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            id={`more-${item.id}`}
                            hidden
                          />
                          <div className={styles.listProducts}>
                            {item.detailBills.map((item2, index) => {
                              return (
                                <div key={item2.id} className={styles.product}>
                                  {item2.product["imageProduct-product"].map(
                                    (item3, index) => {
                                      if (
                                        item3.STTImage ===
                                        item2.classifyProduct.STTImg
                                      ) {
                                        return (
                                          <Link
                                            key={item3.id}
                                            href={`/product/${item2.product.id}?name=${item2.product.nameProduct}`}
                                            className={styles.left}
                                            style={{
                                              backgroundImage: `url(${item3.imagebase64})`,
                                            }}
                                          ></Link>
                                        );
                                      }
                                      if (
                                        item2.classifyProduct.STTImg === -1 &&
                                        index === 0
                                      ) {
                                        return (
                                          <Link
                                            key={item3.id}
                                            href={`/product/${item2.product.id}?name=${item2.product.nameProduct}`}
                                            className={styles.left}
                                            style={{
                                              backgroundImage: `url(${item3.imagebase64})`,
                                            }}
                                          ></Link>
                                        );
                                      }
                                    }
                                  )}
                                  <div className={styles.right}>
                                    <Link
                                      href={`/product/${item2.product.id}?name=${item2.product.nameProduct}`}
                                      className={styles.name}
                                    >
                                      {item2.product.nameProduct}
                                    </Link>
                                    <div className={styles.wrap}>
                                      <div className={styles.left}>
                                        <div>
                                          Phân loại hàng:
                                          {item2.classifyProduct
                                            .nameClassifyProduct !== "default"
                                            ? " " +
                                              item2.classifyProduct
                                                .nameClassifyProduct
                                            : " Không có "}
                                        </div>
                                        <div>x{item2.amount}</div>
                                      </div>
                                      <div className={styles.right}>
                                        {renderPrice(item2)}
                                      </div>
                                    </div>
                                    <div className={styles.evaluate}>
                                      {item.idStatusBill === 3 &&
                                        item2.isReviews === "false" && (
                                          <button
                                            onClick={() =>
                                              router.push(
                                                `/user/evaluate/${item2.id}`
                                              )
                                            }
                                          >
                                            Đánh giá
                                          </button>
                                        )}
                                      {item.idStatusBill === 3 &&
                                        item2.isReviews === "true" && (
                                          <div className={styles.edit}>
                                            Đã đánh giá
                                            <i
                                              className="fa-solid fa-pencil"
                                              onClick={() =>
                                                router.push(
                                                  `/user/evaluate/${item2.id}`
                                                )
                                              }
                                            ></i>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {item.detailBills.length > 2 && (
                            <label
                              htmlFor={`more-${item.id}`}
                              className={styles.more_bill}
                            >
                              Xem Thêm {item.detailBills.length - 2} sản phẩm
                            </label>
                          )}
                          <div className={styles.footer}>
                            <div className={styles.top}>
                              <div className={styles.left}>
                                <div className={styles.icon}></div>
                                <div className={styles.text}>Thành tiền:</div>
                              </div>
                              <div className={styles.right}>
                                {renderTotals(item.detailBills)}
                              </div>
                            </div>
                            <div className={styles.bottom}>
                              {item.idStatusBill === 1 ? (
                                <>
                                  {item.payment !== "card" && (
                                    <>
                                      <button
                                        className={styles.active}
                                        onClick={() => {
                                          setIsOpenModalCancel(true);
                                          setIdCurrentCancelBill(item.id);
                                        }}
                                      >
                                        Hủy đơn hàng
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() =>
                                      router.push(`/user/purchase/${item.id}`)
                                    }
                                  >
                                    Xem thông tin
                                  </button>
                                </>
                              ) : item.idStatusBill < 3 ? (
                                <>
                                  {item.idStatusBill === 2.99 ? (
                                    <>
                                      <button
                                        className={styles.active}
                                        onClick={() =>
                                          handleRecieveProduct(item.id)
                                        }
                                      >
                                        Đã nhận hàng
                                      </button>
                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/user/purchase/${item.id}`
                                          )
                                        }
                                      >
                                        Xem thông tin
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button className={styles.disable}>
                                        Đã nhận hàng
                                      </button>
                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/user/purchase/${item.id}`
                                          )
                                        }
                                      >
                                        Xem thông tin
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : item.idStatusBill === 3 ? (
                                <>
                                  <button
                                    className={styles.active}
                                    onClick={() =>
                                      handleRepurchaseBill(item.id)
                                    }
                                  >
                                    Mua lại
                                  </button>
                                  <button
                                    onClick={() =>
                                      router.push(`/user/purchase/${item.id}`)
                                    }
                                  >
                                    Xem thông tin
                                  </button>
                                </>
                              ) : item.idStatusBill === 4 ? (
                                <>
                                  <button
                                    className={styles.active}
                                    onClick={() =>
                                      handleRepurchaseBill(item.id)
                                    }
                                  >
                                    Mua lại
                                  </button>
                                  <button
                                    onClick={() =>
                                      router.push(`/user/purchase/${item.id}`)
                                    }
                                  >
                                    Xem thông tin
                                  </button>
                                </>
                              ) : (
                                ""
                              )}
                              <div className={styles.text}>
                                <i className="fa-solid fa-right-long"></i>

                                {item.payment === "card"
                                  ? "Đã thanh toán"
                                  : "Thanh toán khi nhận hàng"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </LazyLoad>
                    );
                  })}
                </div>
              )}
              {listBills?.length === 0 && (
                <div className={styles.noPurchase}>
                  <div className={styles.wrap}>
                    <Empty />
                  </div>
                </div>
              )}
            </div>
            <div className={styles.footer}>
              {listBills && count && listBills.length < count ? (
                <div
                  className={classNames(styles.btn, { [styles.active]: true })}
                  onClick={handleMoreBill}
                >
                  Xem Thêm
                  <br />
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <Background />
        <FooterHome />
      </div>
      {/* modal huy don */}
      <Modal
        centered={true}
        size="lg"
        isOpen={isOpenModalCancel}
        className={styles.modalCancelBill}
        toggle={() => closeModalCancel()}
      >
        <ModalHeader toggle={() => closeModalCancel()}>
          <div style={{ fontSize: "20px" }}>Lý do hủy đơn</div>
        </ModalHeader>
        <ModalBody>
          <ul>
            <li onClick={() => handleCancelBill("Không muốn mua nửa.")}>
              Không muốn mua nửa.
            </li>
            <li
              onClick={() =>
                handleCancelBill("Sai sót trong quá trình tạo đơn.")
              }
            >
              Sai sót trong quá trình tạo đơn.
            </li>
            <li onClick={() => handleCancelBill("Thay đổi địa chỉ nhận hàng.")}>
              Thay đổi địa chỉ nhận hàng.
            </li>
            <li
              onClick={() =>
                handleCancelBill("Thay đổi phương thức thanh toán.")
              }
            >
              Thay đổi phương thức thanh toán.
            </li>

            <li className={classNames({ [styles.different]: isDifferent })}>
              <div onClick={() => setIsDifferent(true)}>Lí do khác:</div>
              <div className={styles.wrap}>
                <input
                  value={otherReason}
                  type="text"
                  onChange={(e) => setOtherReason(e.target.value)}
                />
                <button
                  onClick={handleOnclickOtherReason}
                  disabled={!otherReason}
                >
                  OK
                </button>
                <button onClick={() => setIsDifferent(false)}>Cancel</button>
              </div>
            </li>
          </ul>
        </ModalBody>
        <ModalFooter>
          <div className="btn btn-danger" onClick={() => closeModalCancel()}>
            Thoát
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PurchasePage;
