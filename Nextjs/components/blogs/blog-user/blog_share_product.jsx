import styles from '../../../styles/blogs/blog-user/blog_share_product.module.scss'
import { Dropdown } from 'antd';
import { useState } from 'react';
import React, { useEffect } from 'react';
import { getBlogShareProduct } from '../../../services/appService'
import moment from "moment/moment";
import Link from 'next/link';
import Fancybox from '../../../components/product/Fancybox'
import Image from 'next/image';

const BlogShareProduct = ({ blog, handleDeleteBlog, editContentBlog, hideMenu }) => {

    const [blogShare, setBlogShare] = useState('')


    useEffect(() => {
        getBlogShare()
    }, [blog])

    const getBlogShare = async () => {
        if (!blog) return;
        let res = await getBlogShareProduct({ idBlog: blog['blogs-blogShares-parent']['blogs-blogShares-child']?.id })
        if (res && res.errCode === 0) {
            setBlogShare(res.data)
        }
    }

    const renderAvatarUser = (item) => {
        if (!item) return {}
        if (item.avatarUpdate) {
            return {
                backgroundImage: `url(${item.avatarUpdate})`,
            }
        }
        if (item.typeAccount === 'web') {
            if (item.avatar) {
                return {
                    backgroundImage: `url(${item.avatar})`,
                }
            }
            else {
                return {
                }
            }
        }

        if (item.typeAccount === 'google') {
            return {
                backgroundImage: `url(${item.avatarGoogle})`,
            }
        }
        if (item.typeAccount === 'facebook') {
            return {
                backgroundImage: `url(${item.avatarFacebook})`,
            }
        }

        if (item.typeAccount === 'github') {
            return {
                backgroundImage: `url(${item.avatarGithub})`,
            }
        }


    }

    const renderTime = (time) => {
        let date = new Date(time).getTime()
        return 'Ngày:  ' + moment(date).format("DD/MM/YYYY hh:mm:ss");
    }
    function formatNumber(num) {
        if (num >= 1000 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'k';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        } else {
            return num?.toString();
        }
    }


    return (
        <div className={styles.BlogShareDefault_container}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <div className={styles.left}
                        style={renderAvatarUser(blog?.User)}
                    ></div>
                    <div className={styles.right}>
                        <div className={styles.name}>{blog?.User?.firstName + ' ' + blog?.User?.lastName}</div>
                        <div className={styles.typeBlog}>Bài viết chia sẻ</div>
                    </div>
                </div>
                <div className={styles.right}>
                    {
                        hideMenu !== true &&
                        <Dropdown
                            trigger={['click']}
                            placement="bottomRight"
                            menu={{
                                items: [
                                    {
                                        label:
                                            <Link
                                                href={`/blogs/detail-blog/${blog?.id}`}
                                            >Xem chi tiết</Link>,
                                        key: '0',
                                    },
                                    {
                                        label:
                                            <div onClick={() => editContentBlog(blog?.id, blog?.contentHTML)}>
                                                Chỉnh sửa nội dung
                                            </div>,
                                        key: '1',
                                    },
                                    {
                                        label:
                                            <div style={{ color: 'red' }}
                                                onClick={() => handleDeleteBlog(blog?.id, blogShare?.id)}
                                            >Xóa bài viết</div>,
                                        key: '3',
                                    },
                                ],
                            }}
                        >
                            <div>
                                <i className="fa-solid fa-ellipsis"></i>
                            </div>
                        </Dropdown>
                    }
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.wrap_content}
                        dangerouslySetInnerHTML={{ __html: blog?.contentHTML.replaceAll('\n', '<br/>') }}
                    >
                    </div>
                </div>
                <div className={styles.right}>
                    {
                        blogShare &&
                        <>
                            <div className={styles.header}>
                                <Link href={`/blogs/blog-user/${blogShare?.User?.id}`} className={styles.avatar}
                                    style={renderAvatarUser(blogShare?.User)}
                                ></Link>
                                <Link href={`/blogs/blog-user/${blogShare?.User?.id}`} className={styles.name}>
                                    {blogShare?.User?.firstName + ' ' + blogShare?.User?.lastName}
                                </Link>
                            </div>
                            <div className={styles.text}
                                dangerouslySetInnerHTML={{
                                    __html: blogShare?.contentHTML?.replaceAll('\n', '<br/>')
                                }}
                            >
                            </div>
                            <div className={styles.nameProduct}>
                                <div className={styles.text}>
                                    {
                                        blogShare['blogs-blogShares-parent']?.product?.nameProduct
                                    }
                                </div>
                            </div>
                            <div className={styles.media}>
                                <Fancybox options={{
                                    infinite: true, hideScrollbar: true,
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
                                    {
                                        blogShare['blogs-blogShares-parent']?.product['imageProduct-product']?.length > 0 &&
                                        blogShare['blogs-blogShares-parent']?.product['imageProduct-product']?.map(item => {
                                            return (
                                                <Image key={item.id} className={styles.image}
                                                    // style={{ backgroundImage: `url(${item.imagebase6})` }}
                                                    src={item.imagebase6}
                                                    alt='sfds'
                                                    width={600}
                                                    height={400}
                                                    data-fancybox={`gallery` + blog?.id}
                                                    data-src={item.imagebase6}
                                                    data-thumb={item.imagebase6}
                                                    data-width={10000}
                                                    data-height={10000}
                                                ></Image>
                                            )
                                        })
                                    }
                                </Fancybox>

                            </div>
                            <Link href={`/blogs/detail-blog/${blogShare?.id}`} style={{ marginTop: '10px', width: 'fit-content' }}>
                                Xem bài viết
                            </Link>
                        </>
                    }
                    {
                        !blogShare &&
                        <div className={styles.noData}>
                            Bài viết được chia sẻ không còn tồn tại
                        </div>
                    }
                </div>
            </div>
            <div className={styles.data}>
                <div className={styles.countLike}>
                    <i className="fa-regular fa-thumbs-up"></i>
                    {formatNumber(blog?.amountLike)}
                </div>
                <div className={styles.countLike}>
                    <i className="fa-solid fa-share-from-square"></i>
                    {formatNumber(blog?.amountShare)}
                </div>
                <div className={styles.countLike}>
                </div>
                <div className={styles.countLike}>
                    <i className="fa-solid fa-eye"></i>
                    {formatNumber(blog?.viewBlog)}
                </div>
                <div className={styles.countLike}>
                    <i className="fa-regular fa-comment"></i>
                    {formatNumber(blog?.amountComment)}
                </div>
            </div>
            <div className={styles.footer}>
                {
                    renderTime(blog?.createdAt)
                }
            </div>
        </div>
    )
}

export default React.memo(BlogShareProduct)