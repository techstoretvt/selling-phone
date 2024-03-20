import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../../styles/user/purchase/detailPurchase.module.scss";
import HeaderBottom from "../../../components/home/HeaderBottom";
import { useState, useEffect, useMemo } from "react";
// import { getListCartUser, GetUserLogin, GetUserLoginRefreshToken } from '../../../services/userService'
import { getBillById } from "../../../services/graphql";
// import { useDispatch, useSelector } from "react-redux";
// import actionTypes from '../../../store/actions/actionTypes'
import FooterHome from "../../../components/home/FooterHome";
import classNames from "classnames";
import provinces from "../../../services/provinces.json";
import Link from "next/link";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { checkLogin } from "../../../services/common";
import LoadingBar from "react-top-loading-bar";
import { Timeline } from "antd";
import { getListBillByIdBill } from "../../../services/userService";
import Background from "../../../components/background";
import { nameWeb } from "../../../utils/constants";

export default function DetailPurchase() {
  const router = useRouter();
  const accessToken = useSelector((state) => state.user.accessToken);
  const refreshToken = useSelector((state) => state.user.refreshToken);
  const dispatch = useDispatch();
  const [bill, setBill] = useState(null);
  const [progress, setProgress] = useState(100);
  const [listStatus, setListStatus] = useState([]);

  useEffect(() => {
    checkLogin(accessToken, refreshToken, dispatch).then((res) => {
      if (!res) {
        router.push("/home");
      }
    });
  }, []);

  useEffect(() => {
    getBill();
    getListBill();
  }, [router.query.id]);

  const getBill = async () => {
    if (!router.query.id) return;
    setBill(null);
    setProgress(90);
    let res = await getBillById(router.query.id);
    if (res) {
      setBill(res.data.BillById);
      setProgress(100);
    }
  };

  const getListBill = async () => {
    if (!router.query.id) return;

    let res = await getListBillByIdBill({ idBill: router.query.id });
    // console.log(res);
    setListStatus(Array.from(res));
  };

  const isElevate = () => {
    if (!bill) return false;
    let check = true;
    bill.detailBill.forEach((item) => {
      if (item.isReviews === "false") check = false;
    });
    return check;
  };

  const getUrlImageProduct = (item) => {
    let sttimg = 1;
    if (item.classifyProduct?.nameClassifyProduct !== "default")
      sttimg = item.classifyProduct?.STTImg;
    let url;
    item.product?.imageProduct?.forEach((img) => {
      if (img.STTImage === sttimg) url = img.imagebase64;
    });

    return url;
  };

  const getClassifyProduct = (item) => {
    let text = "";
    if (item.classifyProduct?.nameClassifyProduct !== "default")
      text += `Phân loại hàng: ${item.classifyProduct?.nameClassifyProduct}`;
    return text;
  };

  const renderPriceProduct = (item) => {
    let priceRoot;
    if (item.classifyProduct?.nameClassifyProduct !== "default")
      priceRoot = item.classifyProduct?.priceClassify;
    else priceRoot = +item.product?.priceProduct;

    let percent = item.product?.promotionProduct?.numberPercent;
    let timePromotion = item.product?.promotionProduct?.timePromotion;
    let date = new Date().getTime();
    if (!percent || !timePromotion || percent === 0 || timePromotion < date) {
      return (
        <>
          <div className={styles.price2}>
            {new Intl.NumberFormat("ja-JP").format(priceRoot)}₫
          </div>
        </>
      );
    } else {
      let pricePromotion = Math.floor((priceRoot * (100 - percent)) / 100);
      return (
        <>
          <div className={styles.price1}>
            {new Intl.NumberFormat("ja-JP").format(priceRoot)}₫
          </div>
          <div className={styles.price2}>
            {new Intl.NumberFormat("ja-JP").format(pricePromotion)}₫
          </div>
        </>
      );
    }
  };

  const renderTime = (time) => {
    // let date = new Date(+time)
    return moment(+time).format("hh:mm:ss DD/MM/YYYY");
    // return time;
  };

  const renderTimeLine = () => {
    console.log("sà", listStatus.length);
    if (listStatus.length === 0) return [];

    let arr =
      listStatus?.map((item, index) => {
        if (item.idStatusBill === 1)
          return {
            label: (
              <div style={{ color: "green" }}>
                {renderTime(item.timeStatus)}
              </div>
            ),
            children: <div style={{ color: "green" }}>Đơn đã đặt</div>,
            dot: <i className="fa-solid fa-file-invoice"></i>,
            color: "green",
          };
        else if (item.idStatusBill === 2)
          return {
            label: (
              <div style={{ color: "green" }}>
                {renderTime(item.timeStatus)}
              </div>
            ),
            children: <div style={{ color: "green" }}>Đơn hàng đang giao</div>,
            dot: <i className="fa-solid fa-car-side"></i>,
            color: "green",
          };
        else if (item.idStatusBill === 2.99 || item.idStatusBill === 3)
          return {
            label: (
              <div style={{ color: "green" }}>
                {renderTime(item.timeStatus)}
              </div>
            ),
            children: <div style={{ color: "green" }}>Đã giao</div>,
            dot: <i className="fa-solid fa-check"></i>,
            color: "green",
          };
        else if (item.idStatusBill === 4)
          return {
            label: (
              <div style={{ color: "red" }}>{renderTime(item.timeStatus)}</div>
            ),
            children: <div style={{ color: "red" }}>Đã hủy đơn</div>,
            dot: <i className="fa-solid fa-xmark"></i>,
            color: "red",
          };
        else
          return {
            label: (
              <div style={{ color: "red" }}>{renderTime(item.timeStatus)}</div>
            ),
            children: <div style={{ color: "red" }}>{item.nameStatus}</div>,
          };
      }) || [];
    console.log("arr", arr);
    return arr;
  };

  const itemTimeline = useMemo(() => {
    if (listStatus.length === 0) return [];

    let arr =
      listStatus?.map((item, index) => {
        if (item.idStatusBill === 1)
          return {
            label: (
              <div style={{ color: "green" }}>
                {renderTime(item.timeStatus)}
              </div>
            ),
            children: <div style={{ color: "green" }}>Đơn đã đặt</div>,
            dot: <i className="fa-solid fa-file-invoice"></i>,
            color: "green",
          };
        else if (item.idStatusBill === 2)
          return {
            label: (
              <div style={{ color: "green" }}>
                {renderTime(item.timeStatus)}
              </div>
            ),
            children: <div style={{ color: "green" }}>Đơn hàng đang giao</div>,
            dot: <i className="fa-solid fa-car-side"></i>,
            color: "green",
          };
        else if (item.idStatusBill === 3)
          return {
            label: (
              <div style={{ color: "green" }}>
                {renderTime(item.timeStatus)}
              </div>
            ),
            children: <div style={{ color: "green" }}>Đã giao</div>,
            dot: <i className="fa-solid fa-check"></i>,
            color: "green",
          };
        else if (item.idStatusBill === 4)
          return {
            label: (
              <div style={{ color: "red" }}>{renderTime(item.timeStatus)}</div>
            ),
            children: <div style={{ color: "red" }}>Đã hủy đơn</div>,
            dot: <i className="fa-solid fa-xmark"></i>,
            color: "red",
          };
        else
          return {
            label: (
              <div style={{ color: "red" }}>{renderTime(item.timeStatus)}</div>
            ),
            children: <div style={{ color: "red" }}>{item.nameStatus}</div>,
          };
      }) || [];
    // console.log('arr', arr);
    return arr;
  }, [listStatus]);

  const renderDuKien = (createdAt) => {
    if (!createdAt) return;
    console.log("" + createdAt);
    let date = new Date(+createdAt);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return ` ${day + 4}/${month}/${year} - ${day + 8}/${month}/${year}`;
  };

  return (
    <>
      <Head>
        <title>Thông tin đơn hàng | {nameWeb}</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <HeaderBottom hideSearch={false} />
      <div className={styles.DetailPurchase_container}>
        <div className={styles.DetailPurchase_content}>
          <div className={styles.header}>
            <div className={styles.left} onClick={() => history.back()}>
              <i className="fa-solid fa-chevron-left"></i>
              <div className={styles.text}>TRỞ LẠI</div>
            </div>
            <div className={styles.right}>
              <div className={styles.left}>
                MÃ ĐƠN HÀNG.
                <span>{bill && bill.id.replaceAll("-", "").toUpperCase()}</span>
              </div>
              <div className={styles.separate}></div>
              <div className={styles.right}>
                {bill && bill.idStatusBill === "1" && "ĐANG CHỜ XÁC NHẬN"}
                {bill && bill.idStatusBill === "2" && "ĐANG GIAO HÀNG"}
                {bill && bill.idStatusBill === "3" && "ĐƠN HÀNG ĐÃ HOÀN THÀNH"}
                {bill && bill.idStatusBill === "4" && "ĐƠN HÀNG ĐÃ HỦY"}
              </div>
            </div>
          </div>
          {bill && bill.idStatusBill !== 4 && (
            <div className={styles.listIcons}>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill >= 1,
                })}
              >
                <div className={styles.img + " " + styles.chidl1}>
                  <i className="fa-solid fa-file-lines"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>Đơn hàng đã đặt</div>
                  <div className={styles.time}>
                    {renderTime(bill?.createdAt)}
                  </div>
                </div>
              </div>
              <div
                className={classNames(styles.line, {
                  [styles.child1]: true,
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              ></div>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              >
                <div className={styles.img + " " + styles.chidl2}>
                  <i className="fa-regular fa-credit-card"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>
                    Đã xác nhận thông tin thanh toán
                  </div>
                  <div className={styles.time}>
                    {bill?.idStatusBill === "2" && renderTime(bill?.updatedAt)}
                  </div>
                </div>
              </div>
              <div
                className={classNames(styles.line, {
                  [styles.child2]: true,
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              ></div>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              >
                <div className={styles.img + " " + styles.chidl3}>
                  <i className="fa-solid fa-car"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>Đã giao cho ĐVVC</div>
                  <div className={styles.time}>
                    {bill?.idStatusBill === "2" && renderTime(bill?.updatedAt)}
                  </div>
                </div>
              </div>
              <div
                className={classNames(styles.line, {
                  [styles.child3]: true,
                  [styles.active]: bill && +bill.idStatusBill >= 3,
                })}
              ></div>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill === 3,
                })}
              >
                <div className={styles.img + " " + styles.chidl4}>
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>Đã nhận được hàng</div>
                  <div className={styles.time}>
                    {bill?.idStatusBill === "3" && renderTime(bill?.updatedAt)}
                  </div>
                </div>
              </div>
              <div
                className={classNames(styles.line, {
                  [styles.child4]: true,
                  [styles.active]: isElevate(),
                })}
              ></div>
              <div
                className={classNames(styles.icon, styles.evaluate, {
                  [styles.active]: isElevate(),
                })}
              >
                <div className={styles.img + " " + styles.chidl5}>
                  <i className="fa-regular fa-star"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>Đơn hàng đã được đánh giá</div>
                  <div className={styles.time}></div>
                </div>
              </div>
            </div>
          )}
          {bill?.idStatusBill === 4 && (
            <div className={styles.listIcons + " " + styles.listIconCancel}>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill >= 1,
                })}
              >
                <div className={styles.img + " " + styles.chidl1}>
                  <i className="fa-solid fa-file-lines"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>Đơn hàng đã đặt</div>
                  <div className={styles.time}>
                    {renderTime(bill?.createdAt)}
                  </div>
                </div>
              </div>
              <div
                className={classNames(styles.line, {
                  [styles.childCancel1]: true,
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              ></div>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              >
                <div className={styles.img + " " + styles.chidl2}>
                  <i className="fa-regular fa-credit-card"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>
                    Đã xác nhận thông tin thanh toán
                  </div>
                  <div className={styles.time}>
                    {bill?.idStatusBill === "2" && renderTime(bill?.updatedAt)}
                  </div>
                </div>
              </div>
              <div
                className={classNames(styles.line, {
                  [styles.childCancel2]: true,
                  [styles.active]: true,
                })}
              ></div>
              <div
                className={classNames(styles.icon, {
                  [styles.active]: bill && +bill.idStatusBill >= 2,
                })}
              >
                <div className={styles.img + " " + styles.chidl3}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </div>
                <div className={styles.content}>
                  <div className={styles.label}>Đã hủy</div>
                  <div className={styles.time}>
                    {bill?.idStatusBill === "4" && renderTime(bill?.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.wrapText}>
            <div className={styles.address}>
              <div className={styles["card"]}>
                <div className={styles["align"]}>
                  <span className={styles["red"]}></span>
                  <span className={styles["yellow"]}></span>
                  <span className={styles["green"]}></span>
                </div>

                <h1>Địa chỉ nhận hàng</h1>
                <div className={styles.name}>
                  {bill && bill.addressUser?.fullname}
                </div>
                <div className={styles.phone}>
                  (+84) {bill && bill.addressUser?.sdt}
                </div>
                <div className={styles.addressText}>
                  {bill && bill.addressUser?.addressText}
                </div>
                <div className={styles.CountryAndDistrict}>
                  {bill &&
                    provinces[+bill.addressUser.country].name +
                      " - " +
                      provinces[+bill.addressUser.country].districts[
                        +bill.addressUser.district
                      ].name}
                </div>
              </div>
            </div>
            <div className={styles.status}>
              {/* <div className={styles["gearbox"]}>
                                <div className={styles["overlay"]}></div>
                                <div className={styles["gear"] + ' ' + styles.one}>
                                    <div className={styles["gear-inner"]}>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                    </div>
                                </div>
                                <div className={styles["gear"] + ' ' + styles.two}>
                                    <div className={styles["gear-inner"]}>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                    </div>
                                </div>
                                <div className={styles["gear"] + ' ' + styles.three}>
                                    <div className={styles["gear-inner"]}>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                    </div>
                                </div>
                                <div className={styles["gear"] + ' ' + styles.four + ' ' + styles.large}>
                                    <div className={styles["gear-inner"]}>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                        <div className={styles["bar"]}></div>
                                    </div>
                                </div>
                            </div> */}
              <input type="checkbox" id="more-timeline" hidden />
              <div className={styles.timeline}>
                <Timeline
                  style={{ color: "#fff" }}
                  reverse={true}
                  mode="left"
                  items={itemTimeline}
                />
              </div>
              {listStatus.length > 4 && (
                <label htmlFor="more-timeline" className={styles.more}></label>
              )}
            </div>
          </div>
          {/* <div className={styles.slider}>
                        <div></div>
                    </div> */}
          <div className={styles.listProducts}>
            <div className={styles.header}>
              Đơn hàng:{" "}
              <span> {bill?.id.replaceAll("-", "").toUpperCase()}</span>
            </div>
            <div style={{ fontSize: "1.2rem", color: "#fff" }}>
              Dự kiến: {renderDuKien(bill?.createdAt)}
            </div>
            <div className={styles.productParent}>
              {bill?.detailBill?.map((item) => {
                return (
                  <div key={item.id} className={styles.productChild}>
                    <div className={styles.left}>
                      <Link
                        href={`/product/${item.product?.id}?name=${item.product?.nameProduct}`}
                        className={styles.img}
                        style={{
                          backgroundImage: `url(${getUrlImageProduct(item)})`,
                        }}
                      ></Link>
                    </div>
                    <div className={styles.right}>
                      <Link
                        href={`/product/${item.product?.id}?name=${item.product?.nameProduct}`}
                        className={styles.name}
                      >
                        {item.product?.nameProduct.charAt(0).toUpperCase() +
                          item.product?.nameProduct.slice(1)}
                      </Link>
                      <div className={styles.wrap}>
                        <div className={styles.left}>
                          <div className={styles.classify}>
                            {getClassifyProduct(item)}
                          </div>
                          <div className={styles.amount}>x{item.amount}</div>
                        </div>
                        <div className={styles.right}>
                          {renderPriceProduct(item)}
                        </div>
                      </div>
                      <div className={styles.btn}>
                        {bill?.idStatusBill === "3" &&
                          item.isReviews === "false" && (
                            <button
                              onClick={() =>
                                router.push(`/user/evaluate/${item.id}`)
                              }
                            >
                              Đánh giá
                            </button>
                          )}
                        {bill?.idStatusBill === "3" &&
                          item.isReviews === "true" && (
                            <div className={styles.edit}>
                              Đã đánh giá
                              <i
                                onClick={() =>
                                  router.push(`/user/evaluate/${item.id}`)
                                }
                                className="fa-solid fa-pencil"
                              ></i>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.bill}>
            <div className={styles.left}>
              <div>Tổng tiền hàng</div>
              <div>Phí vận chuyển</div>
              <div>Giảm giá phí vận chuyển</div>
              <div>Voucher từ Shop</div>
              <div>Thành tiền</div>
            </div>
            <div className={styles.right}>
              <div>{new Intl.NumberFormat("ja-JP").format(bill?.totals)}₫</div>
              <div>0,00₫</div>
              <div>0,00₫</div>
              <div>0,00₫</div>
              <div>{new Intl.NumberFormat("ja-JP").format(bill?.totals)}₫</div>
            </div>
          </div>
          <div className={styles.payment}>
            <div className={styles.top}>
              <i className="fa-solid fa-bell"></i>
              {bill?.payment === "card" ? (
                <div className={styles.text}>Đơn hàng đã thanh toán</div>
              ) : (
                <div className={styles.text}>
                  Vui lòng thanh toán
                  <span className={styles.price}>
                    {new Intl.NumberFormat("ja-JP").format(bill?.totals)}₫
                  </span>
                  khi nhận hàng.
                </div>
              )}
            </div>
            <div className={styles.bottom}>
              <div className={styles.left}>
                <i className="fa-solid fa-shield-dog"></i>
                Phương thức Thanh toán
              </div>
              <div className={styles.right}>
                {bill?.payment === "card"
                  ? "Thanh toán PayPal"
                  : "Thanh toán khi nhận hàng"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Background />
      <FooterHome />
    </>
  );
}
