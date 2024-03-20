import Head from "next/head";
import HeaderBottom from "../../../components/home/HeaderBottom";
import FooterHome from "../../../components/home/FooterHome";
import styles from "../../../styles/blogs/blogUser.module.scss";
import { getBlogUserByIdUser } from "../../../services/userService";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import BlogDefault from "../../../components/blogs/blog-user/blog_default";
import BlogProduct from "../../../components/blogs/blog-user/blog_product";
import BlogShareDefault from "../../../components/blogs/blog-user/blog_share_default";
import BlogShareProduct from "../../../components/blogs/blog-user/blog_share_product";
import { Pagination } from "antd";
import LoadingBar from "react-top-loading-bar";
import Link from "next/link";
import Background from "../../../components/background";
import { Empty } from "antd";
import { nameWeb } from "../../../utils/constants";

export async function getStaticProps(context) {
  try {
    // let count = (Math.floor((resBlogUser.count - 1) / 10) + 1) * 10
    let listBlogRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_BUILD}/api/v1/get-list-blog-by-id-user?idUser=${context.params.idUser}&page=1`
    );
    listBlogRes = await listBlogRes.json();

    let count = (Math.floor((listBlogRes?.count - 1) / 10) + 1) * 10;

    return {
      props: {
        listBlogData: listBlogRes?.data ?? [],
        countData: count,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.log("err from blog user in static: ", e);
    console.log("url: ", process.env.REACT_APP_BACKEND_URL_BUILD);
    return {
      props: { data: "" },
    };
  }
}

export async function getStaticPaths() {
  // Tạo ra một mảng các đối tượng path
  const paths = [
    {
      params: { idUser: "380c9312-8012-4626-86aa-1d5f2d696516" },
    },
  ];

  // Trả về mảng path đã tạo
  return { paths, fallback: true };
}

const BlogUser = ({ listBlogData = [], countData = 0 }) => {
  const router = useRouter();
  const { page, idUser } = router.query;
  const [listBlog, setListBlog] = useState(listBlogData);
  const [countPage, setCountPage] = useState(countData);
  const [currentPage, setCurrentPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [domloaded, setDomloaded] = useState(false);

  // useEffect(() => {
  //     setListBlog(BlogUsers)
  //     setCountPage(DataCount)
  // }, [BlogUsers, DataCount])

  useEffect(() => {
    if (domloaded) getListBlog();

    setDomloaded(true);
  }, [page, idUser]);

  useEffect(() => {
    if (page) setCurrentPage(+page);
  }, [page]);

  const getListBlog = async () => {
    if (!idUser) return;
    setProgress(90);
    let res = await getBlogUserByIdUser({
      idUser,
      page: page || "1",
    });
    if (res && res.errCode === 0) {
      setListBlog(res.data);
      let count = (Math.floor((res.count - 1) / 10) + 1) * 10;
      setCountPage(count);
      setProgress(100);
    }
  };

  const handleChangePage = (page, pageSize) => {
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page);
    router.push(`/blogs/blog-user/${idUser}?${searchParams}`);
    setCurrentPage(page);
  };

  const handleDeleteBlog = async (idBlog) => {};

  const editContentBlog = async (idBlog, contentOld) => {};

  return (
    <>
      <Head>
        <title>Bài viết của người dùng | {nameWeb}</title>
      </Head>
      <HeaderBottom hideSearch={false} />
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={styles.BlogUser_container}>
        <div className={styles.BlogUser_content}>
          {listBlog?.length > 0 ? (
            <div className={styles.list_blog}>
              {listBlog?.length > 0 &&
                listBlog?.map((item) => {
                  if (item.typeBlog === "default")
                    return (
                      <div
                        key={item.id}
                        className={styles.blog}
                        style={{ backgroundColor: item.backgroundColor }}
                      >
                        <BlogDefault
                          blog={item}
                          handleDeleteBlog={handleDeleteBlog}
                          hideMenu={true}
                        />

                        <Link
                          href={`/blogs/detail-blog/${item.id}`}
                          className={styles.more}
                        >
                          <button className={styles["btn"]}>
                            Xem bài viết
                          </button>
                        </Link>
                      </div>
                    );
                  if (item.typeBlog === "product")
                    return (
                      <div
                        key={item.id}
                        className={styles.blog}
                        style={{ backgroundColor: item.backgroundColor }}
                      >
                        <BlogProduct
                          blog={item}
                          handleDeleteBlog={handleDeleteBlog}
                          editContentBlog={editContentBlog}
                          hideMenu={true}
                        />
                        <Link
                          href={`/blogs/detail-blog/${item.id}`}
                          className={styles.more}
                        >
                          <button className={styles["btn"]}>
                            Xem bài viết
                          </button>
                        </Link>
                      </div>
                    );
                  if (item.typeBlog === "shareBlog") {
                    if (
                      item["blogs-blogShares-parent"]["blogs-blogShares-child"]
                        ?.typeBlog === "default"
                    )
                      return (
                        <div
                          key={item.id}
                          className={styles.blog}
                          style={{ backgroundColor: item.backgroundColor }}
                        >
                          <BlogShareDefault
                            blog={item}
                            handleDeleteBlog={handleDeleteBlog}
                            editContentBlog={editContentBlog}
                            hideMenu={true}
                          />
                          <Link
                            href={`/blogs/detail-blog/${item.id}`}
                            className={styles.more}
                          >
                            <button className={styles["btn"]}>
                              Xem bài viết
                            </button>
                          </Link>
                        </div>
                      );
                    else {
                      return (
                        <div
                          key={item.id}
                          className={styles.blog}
                          style={{ backgroundColor: item.backgroundColor }}
                        >
                          <BlogShareProduct
                            blog={item}
                            handleDeleteBlog={handleDeleteBlog}
                            editContentBlog={editContentBlog}
                            hideMenu={true}
                          />
                          <Link
                            href={`/blogs/detail-blog/${item.id}`}
                            className={styles.more}
                          >
                            <button className={styles["btn"]}>
                              Xem bài viết
                            </button>
                          </Link>
                        </div>
                      );
                    }
                  }
                })}

              {countPage > 20 && (
                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage || 1}
                    value={currentPage}
                    total={countPage}
                    showTitle={false}
                    showSizeChanger={false}
                    onChange={handleChangePage}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noData}>
              <Empty
                description={
                  <div style={{ color: "#fff" }}>Không có bài viết nào</div>
                }
              />
            </div>
          )}
        </div>
      </div>
      <Background />
      <FooterHome />
    </>
  );
};

export default BlogUser;
