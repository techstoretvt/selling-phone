import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../store/actions/userAction';
import Head from 'next/head';
import classNames from 'classnames';
import Swal from 'sweetalert2';
import actionTypes from '../../store/actions/actionTypes';

import styles from '../../styles/home/HeaderBottom.module.scss';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    getListCartUser,
    deleteProductInCart,
    GetUserLogin,
    GetUserLoginRefreshToken,
    getListNotifyAll,
    seenNotifyOfUser,
} from '../../services/userService';
import { Menu } from 'antd';
import Autocomplete from 'react-autocomplete';

import { createNewKeyword } from '../../services/appService';
import { getListKeyword } from '../../services/graphql';
import { decode_token_exp } from '../../services/common';
import Image from 'next/image';
import { Empty } from 'antd';
import { decode_token } from '../../services/common';
import { toast } from 'react-toastify';
import { initNotifications, notify } from '@mycv/f8-notification';
import { useMediaQuery } from 'react-responsive';
// import FacebookChat from "./ChatFacebook";

var io = require('socket.io-client');

let socket;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const lenghtKeyword = 7;

const HeaderBottom = (props) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const router = useRouter();
    const accessToken = useSelector((state) => state.user.accessToken);
    const refreshToken = useSelector((state) => state.user.refreshToken);
    const listCarts = useSelector((state) => state.user.listCarts);
    const [showMenuMobile, setShowMenuMobile] = useState(false);
    const [valueInput, setValueInput] = useState('');
    const [dataKeyword, setDataKeyword] = useState([]);
    const listKeyword = useSelector((state) => state.app.listKeyword);
    const [listNotify, setListNotify] = useState([]);
    const [countNotify, setCountNotify] = useState(0);
    const isScreen700 = useMediaQuery({ query: '(max-width: 700px)' });
    const isScreen500 = useMediaQuery({ query: '(max-width: 500px)' });
    const [listItemMenu, setListItemMenu] = useState([
        getItem('Tài khoảng', 'sub1', <i className="fa-solid fa-bars"></i>, [
            getItem(<Link href={'/account/login'}>Đăng nhập</Link>, 'sub5-1'),
            getItem(<Link href={'/blogs/all'}>Trang bài viết</Link>, 'sub5-2'),
            getItem(
                <Link href={'/short-video/foryou'}>Xem video</Link>,
                'sub5-3'
            ),
        ]),
    ]);

    const btnIconCart = useRef();
    const inputSearchRef = useRef();

    useEffect(() => {
        getUserLogin();
        getListCart();
        getListNotify();
        initNotifications({ cooldown: 3000 });

        if (accessToken) {
            let decoded = decode_token(accessToken);

            socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
                reconnect: true,
            });
            socket?.on(`new-notify-${decoded?.id}`, async function (data) {
                getListNotify();
                notify(
                    data.title.charAt(0).toUpperCase() + data.title.slice(1),
                    {
                        body:
                            data.content?.length > 50
                                ? data.content.substring(0, 50) + '...'
                                : data.content,
                    }
                );
                if (props?.hideToastNotify === true) return;
                toast(`🦄 ${data.title}`, {
                    position: 'bottom-left',
                    theme: 'dark',
                });
            });

            socket?.on(`new-notify-all`, async function (data) {
                notify(
                    data.title.charAt(0).toUpperCase() + data.title.slice(1),
                    {
                        body:
                            data.content?.length > 50
                                ? data.content.substring(0, 50) + '...'
                                : data.content,
                    }
                );
                getListNotify();
                if (props?.hideToastNotify === true) return;
                toast('🦄 có 1 thông báo mới', {
                    position: 'bottom-left',
                    theme: 'dark',
                });
            });

            setListItemMenu([
                getItem(
                    'Tài khoản',
                    'sub1',
                    <i className="fa-solid fa-bars"></i>,
                    [
                        getItem(
                            <Link href={'/user/account/profile?sub=profile'}>
                                Trang cá nhân
                            </Link>,
                            'sub1-1'
                        ),
                        getItem(
                            <Link href={'/user/notifycations/system'}>
                                Thông báo
                            </Link>,
                            'sub1-2'
                        ),
                        getItem('Đăng xuất', 'logout'),
                    ]
                ),
                {
                    type: 'divider',
                },
                getItem(
                    'Bài viết',
                    'sub2',
                    <i className="fa-solid fa-bars"></i>,
                    [
                        getItem(
                            <Link href={'/blogs/all'}>Trang bài viết</Link>,
                            'sub2-1'
                        ),
                        getItem(
                            <Link href={'/blogs/new'}>Viết blog</Link>,
                            'sub2-2'
                        ),
                        getItem(
                            <Link href={'/user/blog-user'}>
                                Bài viết của tôi
                            </Link>,
                            'sub2-3'
                        ),
                        getItem(
                            <Link href={'/blogs/save-blog'}>Đã lưu</Link>,
                            'sub2-4'
                        ),
                    ]
                ),
                {
                    type: 'divider',
                },
                getItem(
                    'Short video',
                    'sub3',
                    <i className="fa-solid fa-bars"></i>,
                    [
                        getItem(
                            <Link href={'/short-video/foryou'}>Xem video</Link>,
                            'sub3-1'
                        ),
                        getItem(
                            <Link href={'/short-video/new'}>Tạo video</Link>,
                            'sub3-2'
                        ),
                        getItem(
                            <Link href={'/short-video/user'}>
                                Quản lý video
                            </Link>,
                            'sub3-3'
                        ),
                    ]
                ),
                {
                    type: 'divider',
                },
                getItem(
                    'Mua hàng',
                    'sub4',
                    <i className="fa-solid fa-bars"></i>,
                    [
                        getItem(
                            <Link href={'/user/purchase'}>Đơn mua</Link>,
                            'sub4-1'
                        ),
                        getItem(
                            <Link href={'/cart'}>Giỏ hàng của tôi</Link>,
                            'sub4-2'
                        ),
                    ]
                ),
                {
                    type: 'divider',
                },
            ]);
        }

        return () => {
            if (accessToken) {
                socket?.disconnect();
            }
        };
    }, [accessToken]);

    const getListNotify = async () => {
        let res = await getListNotifyAll({
            accessToken,
        });

        // console.log(res);
        if (res?.errCode === 0) {
            setListNotify(res.data);
            setCountNotify(res.count);
        }
    };

    const getUserLogin = async () => {
        try {
            const accToken = localStorage.getItem('accessToken');
            if (!accToken) {
                return;
            }

            let res = await GetUserLogin();
            // console.log("res user login: ", res);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.GET_LOGIN_SUCCESS,
                    data: res.data,
                });
            } else if (res && res.errCode === 3) {
                dispatch({
                    type: actionTypes.UPDATE_TOKENS_FAILD,
                });
                // router.push('/account/login')
            }
        } catch (error) {
            console.log('Error In HeaderBottom (get user login)');
        }
    };

    const getListCart = async () => {
        try {
            let res = await getListCartUser(accessToken);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.UPDATE_LIST_CART,
                    data: res.data,
                });
            }
        } catch (error) {
            console.log('Error in HeaderBottom (get list car)');
        }
    };

    const handleLogout = () => {
        userLogout(dispatch);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/home';
    };

    const renderPriceCartSmall = (item) => {
        let priceProduct;
        if (item.classifyProduct.nameClassifyProduct !== 'default') {
            priceProduct = item.classifyProduct.priceClassify;
        } else {
            priceProduct = +item.product.priceProduct;
        }

        if (
            !item.product.promotionProducts ||
            item.product.promotionProducts?.length === 0
        ) {
            return <>{new Intl.NumberFormat('ja-JP').format(priceProduct)}₫</>;
        } else {
            let percent = item.product.promotionProducts[0].numberPercent;
            let timePromotion = item.product.promotionProducts[0].timePromotion;
            let date = new Date().getTime();

            if (percent === 0 || timePromotion < date) {
                return (
                    <>{new Intl.NumberFormat('ja-JP').format(priceProduct)}₫</>
                );
            } else {
                let pricePromotion = Math.floor(
                    (priceProduct * (100 - percent)) / 100
                );
                return (
                    <>
                        {new Intl.NumberFormat('ja-JP').format(pricePromotion)}₫
                    </>
                );
            }
        }
    };

    const handleDeleteProductInCart = async (id) => {
        let res = await deleteProductInCart({
            accessToken,
            id,
        });
        if (res && res.errCode === 0) {
            getListCart();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text:
                    res?.errMessage || 'Có lỗi xảy ra, vui lòng tải lại trang!',
            });
        }
    };

    const handleOnclickMenu = (e) => {
        console.log(e.key);
        // return
        switch (e.key) {
            case 'logout':
                handleLogout();
                break;
        }
    };

    const handleCloseMenuMobile = (event) => {
        setShowMenuMobile(false);
    };

    const renderAvatarUser = () => {
        if (currentUser.avatarUpdate)
            return (
                <span
                    style={{
                        backgroundImage: `url(${currentUser.avatarUpdate})`,
                    }}
                ></span>
            );

        if (currentUser?.typeAccount === 'google')
            return (
                <span
                    style={{
                        backgroundImage: `url(${currentUser.avatarGoogle})`,
                    }}
                ></span>
            );

        if (currentUser?.typeAccount === 'facebook')
            return (
                <span
                    style={{
                        backgroundImage: `url(${currentUser.avatarFacebook})`,
                    }}
                ></span>
            );

        if (currentUser?.typeAccount === 'github')
            return (
                <span
                    style={{
                        backgroundImage: `url(${currentUser.avatarGithub})`,
                    }}
                ></span>
            );

        if (currentUser?.typeAccount === 'web' && currentUser?.avatar)
            return (
                <span
                    style={{ backgroundImage: `url(${currentUser.avatar})` }}
                ></span>
            );

        if (currentUser?.typeAccount === 'web' && !currentUser?.avatar)
            return <span></span>;
    };

    const handleTimeOut = useRef();

    const onchangeInputSearch = (e) => {
        if (e.target.value === '') {
            setDataKeyword(listKeyword);
        }
        setValueInput(e.target.value);

        clearTimeout(handleTimeOut.current);
        handleTimeOut.current = setTimeout(() => {
            getDataKeyWord(e.target.value);
        }, 200);
    };

    const onSelectInputSearch = (val) => {
        setValueInput('');
        handleCreateNewKeyword(val);
        handleSetListKeyword(val);
        router.push(`/search?keyword=${val}`);
    };

    const handleCreateNewKeyword = (value) => {
        createNewKeyword({ nameKeyword: value });
    };

    const getDataKeyWord = async (value) => {
        if (!value) {
            setDataKeyword([]);
            return;
        }
        let res = await getListKeyword(value);
        if (res) {
            setDataKeyword(res.data.listKeyword);
        }
    };

    const handleOnkeyDown = (e) => {
        if (e.keyCode === 13) {
            if (!valueInput) return;
            handleCreateNewKeyword(valueInput);
            router.push(`/search?keyword=${valueInput}`);
            handleSetListKeyword(valueInput);
            setValueInput('');
        }
    };

    const handleClickBtnSearch = () => {
        if (!valueInput) return;
        handleCreateNewKeyword(valueInput);
        setValueInput('');
        handleSetListKeyword(valueInput);
        router.push(`/search?keyword=${valueInput}`);
    };

    const handleForcusSearch = () => {
        if (!valueInput) {
            setDataKeyword(listKeyword);
        }
    };

    const handleSetListKeyword = (value) => {
        let arr = [...listKeyword];
        // console.log("input search: ", inputSearchRef);
        inputSearchRef.current.blur();

        let checkKeyword = arr.find((item) => item.keyword === value);
        // console.log("check key word: ", checkKeyword);

        if (checkKeyword) {
            arr = arr.filter((item) => item.keyword !== value);
            arr.unshift({ keyword: value });
            dispatch({
                type: actionTypes.UPDATE_LIST_KEYWORD,
                data: arr,
            });
            return;
        }

        if (arr?.length >= lenghtKeyword) {
            arr.pop();
        }

        arr.unshift({ keyword: value });
        dispatch({
            type: actionTypes.UPDATE_LIST_KEYWORD,
            data: arr,
        });
    };

    const handleClickBell = async (e) => {
        // console.log('vao');

        if (countNotify > 0) {
            let res = await seenNotifyOfUser({
                accessToken,
            });
            // console.log(res);
            if (res?.errCode === 0) {
                getListNotify();
            }
        }

        if (isScreen700) {
            router.push('/user/notifycations/system');
        }
    };

    return (
        <>
            <Head>
                {/* <link rel="stylesheet" href="/css/home/HeaderBottom.css" /> */}
                {showMenuMobile && (
                    <style>
                        {`
                     html {
                        overflow-y: hidden;
                     }
                     `}
                    </style>
                )}
            </Head>
            <div
                className={classNames(styles['header-bottom-container'], {
                    [styles.short_video]: props?.short_video === true,
                })}
            >
                <div
                    className={classNames(styles['header-bottom-content'], {
                        [styles.short_video]: props?.short_video === true,
                    })}
                >
                    <div className={styles['header-logo']}>
                        <Link href={'/home'}>
                            {props?.smaillIcon !== true ? (
                                <Image
                                    className={classNames(
                                        styles['header-logo-img'],
                                        {
                                            [styles.logoIcon]: isScreen500,
                                        }
                                    )}
                                    src={
                                        !isScreen500
                                            ? '/images/logo/logo-full.webp'
                                            : '/images/logo/logo-icon.webp'
                                    }
                                    width={50}
                                    height={50}
                                    alt=""
                                />
                            ) : (
                                <Image
                                    className={classNames(
                                        styles['header-logo-img'],
                                        styles.logoIcon
                                    )}
                                    src={'/images/logo/logo-icon.webp'}
                                    width={50}
                                    height={50}
                                    alt=""
                                />
                            )}
                        </Link>
                    </div>
                    <div
                        className={classNames(styles['header-search'], {
                            [styles.unShow]: props?.hideSearch === false,
                        })}
                    >
                        <div className={styles['header-search-wrap']}>
                            <div className={styles['search-input']}>
                                <div className={styles.wrapInput}>
                                    <Autocomplete
                                        getItemValue={(item) => item.keyword}
                                        ref={inputSearchRef}
                                        inputProps={{
                                            placeholder: 'Tìm kiếm sản phẩm',
                                            onKeyDown: handleOnkeyDown,
                                            onFocus: handleForcusSearch,
                                        }}
                                        items={dataKeyword}
                                        renderItem={(item, isHighlighted) => (
                                            <div
                                                style={{
                                                    background: isHighlighted
                                                        ? 'lightgray'
                                                        : 'white',
                                                }}
                                            >
                                                {item.keyword}
                                            </div>
                                        )}
                                        menuStyle={{
                                            width: '100%',
                                            position: 'absolute',
                                            left: '0',
                                            top: 'calc(100% + 6px)',
                                            borderRadius: '3px',
                                            boxSizing: 'border-box',
                                            overflowY: 'auto',
                                            maxHeight: '300px',
                                            zIndex: '100',
                                            fontSize: '1.2rem',
                                            zIndex: '10',
                                        }}
                                        value={valueInput}
                                        onChange={(e) => onchangeInputSearch(e)}
                                        onSelect={(val) =>
                                            onSelectInputSearch(val)
                                        }
                                    />
                                </div>

                                <div
                                    className={styles['btn-search']}
                                    onClick={handleClickBtnSearch}
                                >
                                    <button className={styles['btn']}>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                                <div className={styles['search-boder']}></div>
                            </div>
                            <div className={styles['search-suggestions']}></div>
                        </div>
                    </div>
                    <div className={styles['header-icon']}>
                        <div className={styles['header-icon-wrap']}>
                            <button
                                className={styles.icon_notify}
                                onMouseDown={handleClickBell}
                            >
                                <div className={styles.icon}>
                                    {countNotify > 0 ? (
                                        <i className="fa-regular fa-bell fa-shake"></i>
                                    ) : (
                                        <i className="fa-regular fa-bell"></i>
                                    )}
                                    {countNotify > 0 && (
                                        <span>{countNotify}</span>
                                    )}
                                </div>
                                <div className={styles.notify_show}>
                                    <div className={styles.header}>
                                        Thông báo mới
                                    </div>
                                    <div className={styles.list_notify}>
                                        {listNotify?.length > 0 ? (
                                            listNotify.map((item, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            styles.item_notify
                                                        }
                                                        onClick={() =>
                                                            router.push(
                                                                item.redirect_to
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.title
                                                            }
                                                        >
                                                            {item.title}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.content
                                                            }
                                                        >
                                                            {item.content}
                                                        </div>
                                                        {item.urlImage && (
                                                            <Image
                                                                src={
                                                                    item.urlImage
                                                                }
                                                                width={600}
                                                                height={200}
                                                                alt="anh thong bao"
                                                            ></Image>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <Empty
                                                description={
                                                    <span
                                                        style={{
                                                            color: '#fff',
                                                            fontSize: '1rem',
                                                        }}
                                                    >
                                                        Chưa có thông báo mới
                                                    </span>
                                                }
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={styles.footer}
                                        onClick={() =>
                                            router.push(
                                                '/user/notifycations/order'
                                            )
                                        }
                                    >
                                        Xem tất cả thông báo
                                    </div>
                                </div>
                            </button>

                            {/* <div className={styles['header-icon-separate']}></div> */}
                            <button
                                ref={btnIconCart}
                                className={classNames(styles['icon-cart'], {
                                    [styles.unShow]: props?.hideCart === true,
                                })}
                            >
                                <div className={styles['left']}>
                                    <span>
                                        <i className="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <div>
                                        {listCarts ? listCarts.length : 0}
                                    </div>
                                </div>

                                {/* <div className={styles['right']}>
                              <div className={styles.text}>Giỏ hàng</div>

                           </div> */}
                                <div className={styles.cartShow_container}>
                                    <div className={styles.cartShow_content}>
                                        <div className={styles.header}>
                                            Giỏ hàng
                                        </div>
                                        <div
                                            className={
                                                styles.listCarts + ' scoll-bar'
                                            }
                                        >
                                            {listCarts && listCarts?.length > 0
                                                ? listCarts.map((item) => {
                                                      return (
                                                          <div
                                                              key={item.id}
                                                              className={
                                                                  styles.cartItem
                                                              }
                                                          >
                                                              <div
                                                                  className={
                                                                      styles.cartItem_left
                                                                  }
                                                                  style={{
                                                                      backgroundImage: `url(${item.product['imageProduct-product'][0].imagebase64})`,
                                                                  }}
                                                                  onClick={() => {
                                                                      router.push(
                                                                          `/product/${item.product.id}?name=${item.product.nameProduct}`
                                                                      );
                                                                  }}
                                                              ></div>
                                                              <div
                                                                  className={
                                                                      styles.cartItem_right
                                                                  }
                                                              >
                                                                  <div
                                                                      className={
                                                                          styles.cartItem_name
                                                                      }
                                                                      onClick={() => {
                                                                          router.push(
                                                                              `/product/${item.product.id}?name=${item.product.nameProduct}`
                                                                          );
                                                                      }}
                                                                  >
                                                                      {
                                                                          item
                                                                              .product
                                                                              .nameProduct
                                                                      }
                                                                  </div>
                                                                  <div
                                                                      className={
                                                                          styles.cartItem_classify
                                                                      }
                                                                  >
                                                                      {item
                                                                          .classifyProduct
                                                                          .nameClassifyProduct !==
                                                                          'default' &&
                                                                          item
                                                                              .classifyProduct
                                                                              .nameClassifyProduct}
                                                                  </div>
                                                                  <div
                                                                      className={
                                                                          styles.cartItem_wrap
                                                                      }
                                                                  >
                                                                      <div
                                                                          className={
                                                                              styles.cartItem_amount
                                                                          }
                                                                      >
                                                                          Số
                                                                          lượng:{' '}
                                                                          <b>
                                                                              {
                                                                                  item.amount
                                                                              }
                                                                          </b>{' '}
                                                                      </div>
                                                                      <div
                                                                          className={
                                                                              styles.cartItem_price
                                                                          }
                                                                      >
                                                                          {renderPriceCartSmall(
                                                                              item
                                                                          )}
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <div
                                                                  className={
                                                                      styles.close
                                                                  }
                                                              >
                                                                  <i
                                                                      className="fa-solid fa-xmark"
                                                                      onClick={() =>
                                                                          handleDeleteProductInCart(
                                                                              item.id
                                                                          )
                                                                      }
                                                                  ></i>
                                                              </div>
                                                          </div>
                                                      );
                                                  })
                                                : 'Không có sản phẩm nào trong giỏ hàng'}
                                        </div>
                                        <div className={styles.footer}>
                                            <div
                                                onClick={() => {
                                                    if (accessToken)
                                                        router.push(`/cart`);
                                                    else {
                                                        router.push(
                                                            `/account/login`
                                                        );
                                                    }
                                                }}
                                                className={styles.footer_btn}
                                            >
                                                Xem giỏ hàng
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.btnClose}>
                                        <i
                                            className="fa-solid fa-xmark"
                                            onClick={() =>
                                                btnIconCart.current.blur()
                                            }
                                        ></i>
                                    </div>
                                </div>
                                <div
                                    className={styles.layoutCartMobile}
                                    onClick={() => btnIconCart.current.blur()}
                                ></div>
                            </button>
                            <button className={styles.icon_virtual}></button>
                            <div
                                className={styles['header-icon-separate']}
                            ></div>
                            <div className={styles['icon-account']}>
                                {(currentUser === '' ||
                                    currentUser === null) && (
                                    <Link
                                        href={'/account/login'}
                                        className={styles['no-login']}
                                    >
                                        <span></span>
                                        <div className={styles['text']}>
                                            Đăng nhập
                                        </div>
                                    </Link>
                                )}
                                {currentUser && (
                                    <>
                                        <button className={styles['login']}>
                                            {renderAvatarUser()}

                                            <div
                                                className={styles['text']}
                                                title={currentUser?.firstName}
                                            >
                                                {currentUser?.firstName}
                                            </div>

                                            <div
                                                className={styles['login-menu']}
                                            >
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            '/user/account/profile?sub=profile'
                                                        )
                                                    }
                                                >
                                                    Trang cá nhân
                                                </div>
                                                <div
                                                    className={styles.separate}
                                                ></div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            '/blogs/new'
                                                        )
                                                    }
                                                >
                                                    Viết blog
                                                </div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            '/blogs/blog-user'
                                                        )
                                                    }
                                                >
                                                    Bài viết của tôi
                                                </div>
                                                <div
                                                    className={styles.separate}
                                                ></div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            '/short-video/new'
                                                        )
                                                    }
                                                >
                                                    Thêm video
                                                </div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            '/short-video/user'
                                                        )
                                                    }
                                                >
                                                    Trang video của tôi
                                                </div>
                                                <div
                                                    className={styles.separate}
                                                ></div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            '/user/purchase'
                                                        )
                                                    }
                                                >
                                                    Đơn hàng
                                                </div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        router.push('/cart')
                                                    }
                                                >
                                                    Giỏ hàng của tôi
                                                </div>
                                                <div
                                                    className={styles.separate}
                                                ></div>
                                                <div
                                                    className={
                                                        styles['menu-item']
                                                    }
                                                    onClick={() =>
                                                        handleLogout()
                                                    }
                                                >
                                                    Đăng xuất
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            className={styles.virtualButton}
                                        ></button>
                                    </>
                                )}
                            </div>
                            <div
                                className={classNames(styles['icon-menu'], {
                                    [styles.active]: showMenuMobile,
                                })}
                                onClick={() => setShowMenuMobile(true)}
                            >
                                <i className="fa-solid fa-bars"></i>
                            </div>
                            <div className={styles.menuShow}>
                                <div className={styles.btnClose}>
                                    <i
                                        className="fa-solid fa-angles-left"
                                        onClick={(event) =>
                                            handleCloseMenuMobile(event)
                                        }
                                    ></i>
                                </div>
                                {
                                    // accessToken &&
                                    <Menu
                                        onClick={handleOnclickMenu}
                                        style={{
                                            width: '100%',
                                        }}
                                        theme="dark"
                                        // defaultSelectedKeys={[`sub1-1-1`]}
                                        defaultOpenKeys={['sub1']}
                                        mode="inline"
                                        items={listItemMenu}
                                    />
                                }
                            </div>
                            <div
                                className={styles.layoutIconMenu}
                                onClick={(event) =>
                                    handleCloseMenuMobile(event)
                                }
                            ></div>
                        </div>
                    </div>
                </div>
                {props.link_social && (
                    <div className={styles.link_social}>
                        <Link
                            href={'/short-video/foryou'}
                            className={styles.social_item}
                        >
                            <div className={styles.left}>
                                <i
                                    className="fa-solid fa-clapperboard"
                                    style={{ color: '#93AEE9' }}
                                ></i>
                            </div>
                            <div className={styles.right}>Short video</div>
                        </Link>
                        <Link
                            href={'/blogs/all'}
                            className={styles.social_item}
                        >
                            <div className={styles.left}>
                                <i
                                    className="fa-solid fa-newspaper"
                                    style={{ color: '#93AEE9' }}
                                ></i>
                            </div>
                            <div className={styles.right}>Blog</div>
                        </Link>
                    </div>
                )}
            </div>
            {/* <FacebookChat /> */}
        </>
    );
};
export default React.memo(HeaderBottom);
