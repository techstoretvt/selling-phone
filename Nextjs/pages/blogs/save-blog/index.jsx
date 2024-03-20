import styles from "../../../styles/blogs/save-blog/saveBlog.module.scss";
import HeaderBottom from "../../../components/home/HeaderBottom";
import FooterHome from "../../../components/home/FooterHome";
import Head from "next/head";
import { Pagination } from "antd";
import {
  getCollectionBlogUserByPage,
  deleteCollectBlogById,
} from "../../../services/userService";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import LoadingBar from "react-top-loading-bar";
import Background from "../../../components/background";
import { useRouter } from "next/router";

const SaveBlog = () => {
  const router = useRouter();
  const [listBlog, setListBlog] = useState([]);
  const accessToken = useSelector((state) => state.user.accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [countPage, setCountPage] = useState(10);
  const [progress, setProgress] = useState(90);
  const [countBlog, setCountBlog] = useState("");

  useEffect(() => {
    getListBlog_collection();
  }, [currentPage]);

  const getListBlog_collection = async () => {
    let res = await getCollectionBlogUserByPage({
      accessToken,
      page: currentPage,
    });
    console.log(res);
    if (res && res.errCode === 0) {
      setListBlog(res.data);
      let size = Math.floor((res.count - 1) / 20) + 1;
      setCountPage(size * 10);
      setCountBlog(res.count);
    }
    setProgress(100);
  };

  const handleChangePage = (page, pageSize) => {
    setCurrentPage(page);
  };

  const renderTime = (time) => {
    let date = new Date(time).getTime();
    return "Ngày:  " + moment(date).format("DD/MM/YYYY hh:mm:ss");
  };

  const deleteBlog = async (idCollect) => {
    setProgress(90);
    let res = await deleteCollectBlogById({
      accessToken,
      idCollect,
    });
    if (res?.errCode === 0) {
      getListBlog_collection();
    }
    setProgress(100);
  };

  const handleClickCollect = (id) => {
    if (id) {
      router.push(`/blogs/detail-blog/${id}`);
    }
  };
  return (
    <>
      <Head>
        <title>Bài viết đã lưu</title>
      </Head>
      <LoadingBar
        color="#5885E6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <HeaderBottom />
      <div className={styles.SaveBlog_container}>
        <div className={styles.SaveBlog_content}>
          <div className={styles.header}>
            <h3>Bài viết đã lưu</h3>
          </div>
          <div className={styles.count}>
            <div className={styles.text}>Bài viết ({countBlog})</div>
          </div>
          <div className={styles.list_blog}>
            {listBlog.length > 0 &&
              listBlog.map((item) => {
                return (
                  <div key={item.id} className={styles.blog_item}>
                    <div
                      className={styles.left}
                      onClick={() => handleClickCollect(item?.blog?.id)}
                    >
                      {item.blog ? (
                        <>
                          <div
                            className={styles.content_blog}
                            dangerouslySetInnerHTML={{
                              __html: item?.blog?.contentHTML?.replaceAll(
                                "\n",
                                "<br/>"
                              ),
                            }}
                          ></div>
                          <div className={styles.footer}>
                            <div className={styles.time}>
                              {renderTime(item.createdAt)}
                            </div>
                            <div className={styles.auhor}>
                              <div className={styles.label}>Tác giả</div>
                              <div className={styles.nameAuthor}>
                                {item.blog?.User?.firstName +
                                  " " +
                                  item.blog?.User?.lastName}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={styles.noData}>
                          Bài viết này không còn tồn tại hoặc đã bị xóa
                        </div>
                      )}
                    </div>
                    <button className={styles.right}>
                      <i className="fa-solid fa-ellipsis"></i>
                      <div
                        className={styles.delete}
                        onClick={() => deleteBlog(item.id)}
                      >
                        Bỏ lưu bài viết
                      </div>
                    </button>
                  </div>
                );
              })}
          </div>

          {countPage >= 20 && (
            <div className={styles.pagination}>
              <Pagination
                current={currentPage || 1}
                // value={currentPage}
                total={countPage}
                showTitle={false}
                showSizeChanger={false}
                onChange={handleChangePage}
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

export default SaveBlog;
