import Head from "next/head";
import HeaderBottom from "../../components/home/HeaderBottom";
import FooterHome from "../../components/home/FooterHome";
import CardProduct from "../../components/home/CardProduct";
import styles from "../../styles/promotion/detailPromotion.module.scss";
import Image from "next/image";
import Countdown from "react-countdown";
import { Pagination } from "antd";
import Link from "next/link";
import {
  getEventPromotionById,
  getContentEventPromotionById,
} from "../../services/appService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalPreviewProduct from "../../components/home/ModalPreviewProduct";
import CircleLoader from "react-spinners/CircleLoader";
import Background from "../../components/background";

export async function getStaticProps(context) {
  try {
    // console.log(context);
    let eventPromotionRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-event-promotion-by-id?idEventPromotion=${context.params.idPromotion}&page=1`
    );
    eventPromotionRes = await eventPromotionRes.json();

    if (!eventPromotionRes || eventPromotionRes?.errCode === 2) {
      return {
        redirect: {
          destination: "/home", // Đích redirect
          permanent: false, // Đặt thành true nếu redirect là vĩnh viễn
        },
      };
    }

    return {
      props: {
        eventPromotionData: eventPromotionRes.data ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log("err detail promotion event in static props: ", e);
    return {
      props: { data: "" },
    };
  }
}

export async function getStaticPaths() {
  // Tạo ra một mảng các đối tượng path
  const paths = [
    // {
    //     params: { idPromotion: 'c741f6fe-de7f-46d7-b342-979a15ee47bb' },
    // },
    // {
    //     params: { idPromotion: '2d565a59-f970-4344-8e49-596782266ef5' },
    // },
    // {
    //     params: { idPromotion: 'fc5ed69c-82f3-4f78-bf9c-ee1b153f0ab6' },
    // },
  ];

  // Trả về mảng path đã tạo
  return { paths, fallback: true };
}

const DetailPromotion = ({ eventPromotionData }) => {
  const router = useRouter();
  const { idPromotion } = router.query;
  const [eventPromotion, setEventPromotion] = useState(eventPromotionData);
  const [countPage, setCountPage] = useState(10);
  const [isClient, setIsClient] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1)
  const [firstContent, setFirstContent] = useState("");
  const [lastContent, setLastContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [isShowModalPreview, setIsShowModalPreview] = useState(false);
  const [currentProduct, setCurrentProduct] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    handeleGetContent();
  }, [idPromotion]);

  const handeleGetContent = async () => {
    let res = await getContentEventPromotionById({
      idEventPromotion: idPromotion,
    });

    if (res?.errCode === 0) {
      setFirstContent(res.data.firstContent);
      setLastContent(res.data.lastContent);
      setLoading(false);
    }
  };

  const renderCountDown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      router.push("/home");
      return <span>Sự kiện đã kết thúc</span>;
    } else {
      // Render a countdown
      return (
        <div id="countdown">
          <div id="tiles">
            <span>{hours}</span>
            <span>{minutes}</span>
            <span>{seconds}</span>
          </div>
          <div className="labels">
            <li>Giờ</li>
            <li>Phút</li>
            <li>Giây</li>
          </div>
        </div>
      );
    }
  };

  const handleChangePage = async (page, pageSize) => {
    // console.log(page);

    let res = await getEventPromotionById({
      idEventPromotion: idPromotion,
      page,
    });
    // console.log(res);
    if (res?.errCode === 0) {
      let size = Math.floor((res.count - 1) / 30 + 1) * 10;
      setCountPage(size);
      setEventPromotion(res.data);
    } else if (res?.errCode === 2) {
      router.push("/home");
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
    <>
      <Head>
        <title>Ten su kien</title>
      </Head>
      <HeaderBottom />
      <div
        className={
          styles.DetailPromotion_container + " PromotionProduct-container"
        }
      >
        <div className={styles.DetailPromotion_content}>
          <div className={styles.top}>
            <div className={styles.cover}>
              <Image
                src={eventPromotion?.cover ?? ""}
                alt=""
                width={2000}
                height={2000}
              />
            </div>
            <div className={styles.namePromotion}>
              {eventPromotion?.nameEvent}
            </div>
            <div className={styles.countdowm + " countdown"}>
              {eventPromotion?.timeEnd && isClient && (
                <Countdown
                  date={Date.now() + +eventPromotion?.timeEnd}
                  renderer={renderCountDown}
                />
              )}
            </div>
            {loading ? (
              <CircleLoader
                color={"red"}
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: firstContent }}
              ></div>
            )}
          </div>
          <div className={styles.center}>
            <Link href={"/home"} className={styles.more}>
              Xem tất cả
            </Link>
            <div className={styles.listProduct}>
              {eventPromotion?.productEvents?.map((item) => (
                <div key={item.id} className={styles.item}>
                  <CardProduct
                    handleOpenModalPreview={handleOpenModalPreview}
                    product={item.product}
                  />
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              {countPage >= 20 && (
                <Pagination
                  defaultCurrent={1}
                  // current={page}
                  total={countPage}
                  showTitle={false}
                  showSizeChanger={false}
                  onChange={handleChangePage}
                />
              )}
            </div>
          </div>
          <div className={styles.bottom}>
            {loading ? (
              <CircleLoader
                color={"red"}
                loading={loading}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: lastContent }}
              ></div>
            )}
          </div>
        </div>
      </div>
      <ModalPreviewProduct
        closeModal={closeModalPreview}
        isOpen={isShowModalPreview}
        product={currentProduct}
      />
      <FooterHome />
      <Background />
    </>
  );
};

export default DetailPromotion;
