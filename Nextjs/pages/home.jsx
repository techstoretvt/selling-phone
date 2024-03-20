import Head from "next/head";
// import Link from 'next/link'
import dynamic from "next/dynamic";
import LazyLoad from "react-lazyload";
import styles from "../styles/home/HomePage.module.scss";
import LoadingBar from "react-top-loading-bar";

const PromotionProduct = dynamic(
  () => import("../components/home/PromotionProduct"),
  {
    loading: () => "Loading...",
  }
);

const NewCollection = dynamic(
  () => import("../components/home/NewCollection"),
  {
    loading: () => "Loading...",
  }
);

import HeaderHome from "../components/home/HeaderHome";
import SliderImageHome from "../components/home/SliderImageHome";

import ExhibitionImage from "../components/home/ExhibitionImage";
// import PromotionProduct from '../components/home/PromotionProduct'
import Category from "../components/home/Category";
import TopSellingProduct from "../components/home/TopSellingProduct";
import ExhibitionImage2 from "../components/home/ExhibitionImage2";
// import NewCollection from '../components/home/NewCollection'
import ExhibitionImage3 from "../components/home/ExhibitionImage3";
import AdvanceProduct from "../components/home/AdvanceProduct";
import GenuineFlycam from "../components/home/GenuineFlycam";
import NewPost from "../components/home/NewPost";
import TopSearch from "../components/home/TopSearch";
import FooterHome from "../components/home/FooterHome";
import BannerHome from "../components/home/BannerHome";
import ShortVideo from "../components/home/ShortVideo";
// import FacebookChat from "../components/home/ChatFacebook";
import Background from "../components/background";

// import IphonePage from '../components/home/IphonePage'
// import initializeAOS from '../utils/aos'

// import { getPromotionProduct, getTopSellProduct, getProductFlycam } from '../services/appService'
import { useEffect, useState } from "react";
typeof window === "undefined";

export async function getStaticProps(context) {
  try {
    // let resPromotionProduct = await getPromotionProduct();
    // console.log('resPromotionProduct', resPromotionProduct);
    // let resTopSellProduct = await getTopSellProduct();
    // console.log('resTopSellProduct', resTopSellProduct);
    // let resProductFlycam = await getProductFlycam();
    // console.log('resProductFlycam', resProductFlycam);

    let resPromotionProduct = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-product-promotion-home`
    );
    resPromotionProduct = await resPromotionProduct.json();
    // console.log("resPromotionProduct", resPromotionProduct);

    let resTopSellProduct = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/vi/get-top-sell-product`
    );
    resTopSellProduct = await resTopSellProduct.json();
    // console.log("resTopSellProduct", resTopSellProduct);

    let resProductFlycam = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-product-type-flycam`
    );
    resProductFlycam = await resProductFlycam.json();
    // console.log("resProductFlycam", resProductFlycam);

    let listTypeProductRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/get-all-type-product`
    );
    listTypeProductRes = await listTypeProductRes.json();

    let newCollectionRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/vi/get-new-collection-product?typeProduct=điện thoại`
    );
    newCollectionRes = await newCollectionRes.json();

    let listBlogHomeRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-list-blog-home`
    );
    listBlogHomeRes = await listBlogHomeRes.json();

    let listShortVideoRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-list-short-video`
    );
    listShortVideoRes = await listShortVideoRes.json();

    let listEventRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-list-event-promotion-home`
    );
    listEventRes = await listEventRes.json();

    return {
      props: {
        PromotionProducts: resPromotionProduct?.data || [],
        TopSellProducts: resTopSellProduct?.data || [],
        ProductFlycams: resProductFlycam?.data || [],
        listTypeProductData: listTypeProductRes?.data ?? [],
        newCollectionData: newCollectionRes?.data ?? [],
        listBlogHomeData: listBlogHomeRes?.data ?? [],
        listShortVideoData: listShortVideoRes?.data ?? [],
        listEventData: listEventRes?.data ?? [],
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log("lỗi phải static", e);
    return {
      props: {
        PromotionProducts: [],
        TopSellProducts: [],
        ProductFlycams: [],
        listTypeProductData: [],
        newCollectionData: [],
      },
    };
  }
}

export default function Home({
  PromotionProducts = [],
  TopSellProducts = [],
  ProductFlycams = [],
  listTypeProductData,
  newCollectionData,
  listBlogHomeData = [],
  listShortVideoData,
  listEventData,
}) {
  useEffect(() => {}, []);

  const [progress, setProgress] = useState(100);
  return (
    <>
      <Head>
        <title>TechStore</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles["homePage-container"] + " scoll-bar"}>
        <HeaderHome isTop={true} link_social={true} />
        <BannerHome />
        <SliderImageHome listEventData={listEventData} />

        <LazyLoad offset={500}>
          <Category listTypeProductData={listTypeProductData} />
        </LazyLoad>
        <PromotionProduct PromotionProducts={PromotionProducts} />
        <LazyLoad offset={500}>
          <ExhibitionImage />
        </LazyLoad>
        <TopSellingProduct TopSellProducts={TopSellProducts} />
        <LazyLoad offset={500}>
          <ExhibitionImage2 />
        </LazyLoad>
        <NewCollection newCollectionData={newCollectionData} />
        <LazyLoad offset={500}>
          <ExhibitionImage3 />
        </LazyLoad>
        <AdvanceProduct newCollectionData={newCollectionData} />
        <GenuineFlycam ProductFlycams={ProductFlycams} />
        <NewPost listBlogHomeData={listBlogHomeData} />
        <ShortVideo listShortVideoData={listShortVideoData} />
        <TopSearch />
        <FooterHome />
        {/* <FacebookChat /> */}

        <Background />
      </div>
    </>
  );
}
