import React, { useEffect, useState } from "react";
import { CheckAdminLogin, handleCheckLoginAdmin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
// react-bootstrap components
var io = require('socket.io-client');


let socket
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { Collapse, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {
  getTypeProduct,
  getTrademarks,
  cloudinaryUpload, addNewProduct, getProductByPage, blockProduct, editProductById,
  editImageProduct, addPromotionByIdProduct
} from "services/adminService";
import NotificationAlert from "react-notification-alert";
import PaginationExampleShorthand from "components/Commons/Pagination";
import CurrencyInput from 'react-currency-input-field';

// import MarkdownIt from 'markdown-it';
// import MdEditor from 'react-markdown-editor-lite';
// import 'react-markdown-editor-lite/lib/index.css';
import '../assets/css/TableProduct.scss'
import ImageUploading from 'react-images-uploading';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import noImageProduct from '../assets/img/no-image-product.png'
import LoadingOverlay from 'react-loading-overlay-ts';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from "react";
import moment from 'moment';
// const mdParser = new MarkdownIt(/* Markdown-it options */);



function TableProduct() {
  const notificationAlertRef = React.useRef(null);


  const [listTypeProduct, setListTypeProduct] = useState([]);


  const [valueSelectTrademark, setValueSelectTrademark] = useState('')
  const [listTrademark, setListTrademark] = useState([]);


  const [nameProduct, setNameProduct] = useState('');
  const [priceProduct, setPriceProduct] = useState(1000);
  const [idTypeProduct, setIdTypeProduct] = useState('');
  const [idTrademark, setIdTrademark] = useState('');
  const [descriptionProductMarkdown, setDescriptionProductMarkdown] = useState('rong');
  const [descriptionProductHTML, setDescriptionProductHTML] = useState('');
  const [imageProducts, setImageProduct] = useState([]);
  const [isShowReviewImage, setIsShowReviewImage] = useState(false);
  const [indexReviewImage, setIndexReviewImage] = useState(0);
  const [nameClassify, setNameClassify] = useState('');
  const [countClassify, setCountClassify] = useState('');
  const [listClassify, setListClassify] = useState([]);
  const [sttImageClassify, setSttImageClassify] = useState('');
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [listProducts, setListProducts] = useState([]);
  const [countPages, setCountPages] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndexEditClassify, setCurrenIndexEditClassify] = useState('');
  const [addOrEditClassify, setAddOrEditClassify] = useState(true)
  const [currentIdEditProduct, setCurrentIdEditProduct] = useState('');
  const [addOrEditProduct, setAddOrEditProduct] = useState(true)
  const [isSellProduct, setIsSellProduct] = useState('');
  const [priceClassify, setPriceClassify] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [idFillterTypeProduct, setIdFillterTypeProduct] = useState('all')
  const [nameFillterProduct, setNameFilterProduct] = useState('')
  const idTimeOutFillter = useRef()
  const [isOpenModalAddPromotion, setIsOpenModalAddPromotion] = useState(false);
  const [persentPromotion, setPersenPromotion] = useState('');
  const [timePromotion, setTimePromotion] = useState('');
  const [idProductPromotion, setIdProductPromotion] = useState('')

  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])

  useEffect(() => {
    getListTypeProduct();
  }, [])

  useEffect(() => {
    getListTrademarks()
  }, [valueSelectTrademark])

  useEffect(() => {
    getListProduct();
    let accessToken = localStorage.getItem('accessToken')
    if (accessToken) {

      socket = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, { reconnect: true });

      socket?.on(`refreshAmountProduct`, async function (data) {
        getListProduct()
      })

    }

    return () => {
      if (accessToken) {
        socket?.disconnect();
      }
    }
  }, [currentPage, idFillterTypeProduct, nameFillterProduct])



  const notify = (place, color, content) => {
    // var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {content}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  // TypeProduct
  const getListTypeProduct = async () => {
    let res = await getTypeProduct()
    if (res && res.errCode === 0) {
      setListTypeProduct(res.data)
    }
  }

  //End TypeProduct

  //Trademark
  const getListTrademarks = async () => {
    let res = await getTrademarks();
    if (res && res.errCode === 0) {
      setListTrademark(res.data);
    }
    else {
      notify('br', 3, res ? res.errMessage : 'Có lỗi khi lấy danh sách thương hiệu!');
    }
  }


  //End Trademark

  //Product
  const getListProduct = async () => {
    let res = await getProductByPage(currentPage, idFillterTypeProduct, nameFillterProduct);
    if (res && res.errCode === 0) {
      setCountPages(parseInt((res.count / 6) + 1))
      setListProducts(res.data)
    }


  }

  const onchangePageProduct = (rest, value) => {
    setCurrentPage(value)
  }

  const handleOnchangeMarkdown = ({ html, text }) => {
    setDescriptionProductHTML(html);
    setDescriptionProductMarkdown(text)
  }

  const onChangeImageProduct = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log('onchange', imageList, addUpdateIndex);
    setImageProduct(imageList);
  };

  const handleAddProduct = async () => {
    if (isShowLoading) return;
    // if (imageProducts.length < 5) {
    //   notify('br', 4, `Số lượng ảnh là ${imageProducts.length} sản phẩm chỉ đạt mức trung bình.`);
    // }
    // else {
    //   notify('br', 2, `Số lượng ảnh là ${imageProducts.length} sản phẩm chỉ đạt mức tốt.`);
    // }

    if (!nameProduct || !priceProduct || !idTypeProduct || !idTrademark
      || imageProducts.length < 2
    ) {
      notify('br', 4, 'Vui lòng điền đẩy đủ thông tin 1!');
    }

    else {
      let sl
      if (listClassify.length === 0) {
        sl = prompt('Nhập số lượng sản phẩm.')
        if (!sl) return;
      }

      //loading

      let accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        location.reload()
        return
      }
      setIsShowLoading(true)
      let data = {
        nameProduct,
        priceProduct,
        idTypeProduct,
        idTrademark,
        contentHTML: descriptionProductHTML,
        contentMarkdown: descriptionProductMarkdown,
        listClassify,
        sl: sl,
        accessToken
      }
      // console.log('data:', data);

      let res = await addNewProduct(data);
      // console.log(res);
      if (res && res.errCode === 0) {

        let form = new FormData()
        imageProducts.forEach((item, index) => {
          form.append('file', item.file, 'file')
        })

        cloudinaryUpload(form, res.idProduct).then(result => {
          if (result && result.errCode === 0) {
            getListProduct()
          }
        })
        setIsShowLoading(false)
        notify('br', 2, 'Thêm sản phẩm thành công!')
        getListProduct()
        handleCancelEditProduct()
      }

      else {
        notify('br', 3, err?.errMessage || 'error')
        setIsShowLoading(false)
      }


    }
  }

  const handleAddClassify = () => {
    if (!nameClassify || !+countClassify || !priceClassify) {
      notify('br', 4, 'Vui lòng nhập tên và số lượng phân loại')
    }
    else {
      let data = {
        nameClassify,
        amount: countClassify,
        STTImg: sttImageClassify ?? '',
        priceClassify: priceClassify
      }
      let arr = [...listClassify]
      arr.push(data);
      setListClassify(arr);
      setNameClassify('');
      setCountClassify('')
      setSttImageClassify('')
      setPriceClassify('')

    }
  }

  const handleDeleteClassify = (index) => {
    let data = [...listClassify]
    data.splice(index, 1)
    setListClassify(data)
  }

  const RenderOptionImgClassify = () => {
    let arrImgProduct = []
    imageProducts.forEach((item, index) => {
      arrImgProduct.push(index + 1)
    })

    let arrImgClassify = []
    listClassify.forEach((item) => {
      if (item['STTImg'])
        arrImgClassify.push(+item['STTImg'])
    })

    // let arrOptions = arrImgProduct.filter((item) => {
    //   if (!arrImgClassify.includes(item))
    //     return item
    // })


    // console.log(arrImgProduct, arrImgClassify, arrOptions);

    return (
      <>
        {
          arrImgProduct.length > 0 &&
          arrImgProduct.map((item, index) => {
            if (!arrImgClassify.includes(item))
              return <option key={index} value={item} >{item}</option>
            else
              return <option key={index} style={{ color: 'red' }} value={item} disabled>{item}</option>
          })
        }
      </>
    )
  }

  const handleClickClassify = (item, index) => {
    console.log(item, index);

    setNameClassify(item.nameClassify);
    setCountClassify(item.amount);
    setSttImageClassify(item.STTImg);
    setPriceClassify(item.priceClassify)
    setCurrenIndexEditClassify(index);
    setAddOrEditClassify(false)
  }

  const handleCancelEditClassify = () => {
    setNameClassify('');
    setCountClassify('');
    setSttImageClassify('');
    setPriceClassify('')
    setCurrenIndexEditClassify('');
    setAddOrEditClassify(true)
  }

  const handleEditClassify = () => {
    let data = {
      nameClassify,
      amount: countClassify,
      STTImg: sttImageClassify ?? '',
      priceClassify: priceClassify
    }

    let copyArr = [...listClassify];
    copyArr[currentIndexEditClassify].nameClassify = nameClassify
    copyArr[currentIndexEditClassify].amount = countClassify;
    copyArr[currentIndexEditClassify].STTImg = sttImageClassify ?? ''
    copyArr[currentIndexEditClassify].priceClassify = priceClassify

    setListClassify(copyArr)
    handleCancelEditClassify()
  }

  const handleSetUpEditProduct = (item) => {
    console.log(item);
    setCurrentIdEditProduct(item.id);
    setNameProduct(item.nameProduct);
    setPriceProduct(+item.priceProduct);
    setIdTypeProduct(item.idTypeProduct);
    setIdTrademark(item.idTrademark);
    setDescriptionProductMarkdown(item.contentMarkdown);
    setDescriptionProductHTML(item.contentHTML);

    let listImgs = []
    item['imageProduct-product'].forEach((item, index) => {
      let data = {
        data_url: item.imagebase64,
        file: null
      }
      listImgs.push(data);
    })
    setImageProduct(listImgs);

    if (item['classifyProduct-product'].length === 1 &&
      item['classifyProduct-product'][0].nameClassifyProduct === "default") {
      setListClassify([])
      setNameClassify('')
      setCountClassify('')
      setSttImageClassify('')
      setPriceClassify('')
    }
    else {
      let arr = []
      item['classifyProduct-product'].forEach((item, index) => {
        let data = {
          nameClassify: item.nameClassifyProduct,
          amount: item.amount,
          STTImg: item.STTImg,
          priceClassify: item.priceClassify
        }
        arr.push(data);
      })
      setListClassify(arr);
    }
    setAddOrEditClassify(true)
    setAddOrEditProduct(false)
    setIsSellProduct(item.isSell)

  }

  const handleCancelEditProduct = () => {
    setCurrentIdEditProduct('');
    setNameProduct('');
    setPriceProduct(1000);
    setIdTypeProduct('');
    setIdTrademark('');
    setDescriptionProductMarkdown('rong');
    setDescriptionProductHTML('');
    setImageProduct([]);
    setListClassify([])
    setNameClassify('')
    setCountClassify('')
    setSttImageClassify('')
    setPriceClassify('')
    setListClassify([]);
    setAddOrEditClassify(true)
    setAddOrEditProduct(true)
    setIsSellProduct('')
  }

  const handleBlockProduct = async (isSell) => {
    setIsShowLoading(true);
    let res = await blockProduct(isSell, currentIdEditProduct);
    if (res && res.errCode === 0) {
      handleCancelEditProduct();
      setIsShowLoading(false);
      notify('br', 2, isSell === 'false' ? 'Đã khóa sản phẩm!' : 'Đã mở khóa sản phẩm!')
      getListProduct();
    }
    else {
      setIsShowLoading(false);
      notify('br', 3, res.errMessage || isSell === 'false' ? 'Khóa sản phẩm thất bại, có lỗi phía server!' : 'Mở khóa sản phẩm thất bại, có lỗi phía server!')
    }
  }

  const handleEditProduct = async () => {
    if (isShowLoading) return;

    if (!nameProduct || !priceProduct || !idTypeProduct || !idTrademark || !descriptionProductMarkdown
      || imageProducts.length < 2
    ) {
      notify('br', 4, 'Vui lòng điền đẩy đủ thông tin!');
    }
    else {
      let sl
      if (listClassify.length === 0) {
        sl = prompt('Nhập số lượng sản phẩm.')
        if (!sl || typeof (sl * 1) !== 'number') return;
      }

      //loading
      setIsShowLoading(true)
      let accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        location.reload()
        return
      }
      let data = {
        idProduct: currentIdEditProduct,
        nameProduct,
        priceProduct,
        idTypeProduct,
        idTrademark,
        contentHTML: descriptionProductHTML,
        contentMarkdown: descriptionProductMarkdown,
        listClassify,
        sl: sl,
        accessToken
      }
      // console.log('data:', data);
      let resEditProduct = await editProductById(data);
      if (resEditProduct && resEditProduct.errCode === 0) {

        let arrImgProduct = []
        imageProducts.forEach((item, index) => {
          if (item.file === null) {
            let tempObj = {
              url: item.data_url,
              num: index + 1
            }
            arrImgProduct.push(tempObj)
          }
        })

        // let resSwapImageProduct = await swapImageProduct({
        //   imageProducts: arrImgProduct,
        //   idProduct: currentIdEditProduct
        // })
        // if (resSwapImageProduct.errCode !== 0) {
        //   notify('br', 3, 'Cập nhật ảnh sản phẩm đã có lỗi xảy ra!')
        //   setIsShowLoading(false)
        //   return;
        // }


        let isErr = false
        let count = 0

        imageProducts.forEach(async (item, index) => {
          if (item.file !== null) {
            let form = new FormData()
            form.append('file', item.file, 'file')
            editImageProduct(form, index + 1, currentIdEditProduct).then((res) => {
              if (res.errCode === 0) count++
              else isErr = true
            })
          }
        })

        let slImage = imageProducts.filter((item) => {
          return item.file !== null
        })

        const interval = setInterval(() => {
          if (!isErr) {
            if (count === slImage.length) {
              setIsShowLoading(false)
              notify('br', 2, 'Update sản phẩm thành công!')
              handleCancelEditProduct();
              getListProduct();
              clearInterval(interval)
            }
          }
          else {
            clearInterval(interval)
            notify('br', 3, 'Có lỗi xảy ra!')
            setIsShowLoading(false)
          }
        }, 1000);


      }
      else {
        notify('br', 3, 'Cập nhật ảnh sản phẩm đã có lỗi xảy ra!')
        setIsShowLoading(false)
      }



    }
  }

  const handleOnchangTypeProductFromProduct = (e) => {
    setIdTypeProduct(e.target.value)
    setIdTrademark('')
  }

  const handleOnkeyDownAddProduct = (e) => {
    if (e.keyCode === 13 && addOrEditProduct) {
      handleAddProduct()
    }
  }

  const handleTest = async (item) => {
    console.log('Xóa', item);
    // let res = await deleteErrorProduct(item);
    // console.log(res);
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Mở chế độ full màn hình
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }

      document.documentElement.classList.add('fullscreen');
    } else {
      // Thoát chế độ full màn hình
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      document.documentElement.classList.remove('fullscreen');
    }
    setIsFullscreen(!isFullscreen);
  }

  const handleChangeTypeFillterProduct = (e) => {
    setCurrentPage(1)
    setIdFillterTypeProduct(e.target.value)
  }

  const handleChangeNameFillterProduct = (e) => {
    setCurrentPage(1)

    clearTimeout(idTimeOutFillter.current)

    idTimeOutFillter.current = setTimeout(() => {
      setNameFilterProduct(e.target.value)
    }, 500);

  }
  const handleOpenModalAddPromotion = (idProduct, promotion) => {
    setIdProductPromotion(idProduct);

    if (promotion.length !== 0) {
      setPersenPromotion(promotion[0].numberPercent)
      setTimePromotion('')
    }
    else {
      setPersenPromotion('')
      setTimePromotion('')
    }
    setIsOpenModalAddPromotion(true)
  }

  const countDownPromotion = (timestamp) => {
    if (timestamp === '0' || timestamp === 0) return 'Hết hạn giảm giá'

    let a = moment(new Date())
    let b = moment(new Date(+timestamp))

    let day = b.diff(a, 'days');
    let hour = b.diff(a, 'hours');
    let minute = b.diff(a, 'minutes')

    if (day === 0 && hour === 0) {
      return 'Hết hạn giảm giá'
    }
    else {
      return `${day}d ${hour - day * 24}h ${minute - (day * 24 * 60) - ((hour - day * 24) * 60)}p`
    }
  }

  const handleAddPromotion = async () => {
    if (!persentPromotion || !timePromotion) {
      notify('br', 4, "Vui lòng nhập đầy đủ thông tin!")
    }
    else {
      // setOpenLoading(true)
      let date = new Date().getTime() + (+timePromotion * 24 * 60 * 60 * 1000)

      let data = {
        idProduct: idProductPromotion,
        timePromotion: date,
        persentPromotion: persentPromotion
      }

      // console.log(new Date().getTime(), date);
      let res = await addPromotionByIdProduct(data);
      if (res && res.errCode === 0) {
        // setOpenLoading(false)
        setIsOpenModalAddPromotion(false)
        notify('br', 2, 'Thêm khuyến mãi thành công!');
        getListProduct();
      }
      else {
        notify('br', 3, err?.errMessage)
        // setOpenLoading(false)
      }
    }
  }

  //End Product

  return (
    <>
      <LoadingOverlay
        active={isShowLoading}
        spinner
        text='Đang xử lý...'
      >
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>

            {/* Sản phẩm */}
            <Col md='12'>
              <Card className="strpied-tabled-with-hover">
                <Card.Header className="mb-3">
                  <Card.Title as="h4">Thêm sản phẩm</Card.Title>
                  <p className="card-category">
                    Quản lý sản phẩm ở đây.
                  </p>
                </Card.Header>
                <Col md='12'>
                  <Row>
                    {/* Tên sản phẩm */}
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Tên sản phẩm</label>
                        <input value={nameProduct} onChange={(e) => setNameProduct(e.target.value)} className="form-control" onKeyDown={(e) => handleOnkeyDownAddProduct(e)} />
                      </div>
                    </Col>
                    {/* Giá sản phẩm */}
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Giá sản phẩm</label>
                        <CurrencyInput
                          className="form-control"
                          id="input-example"
                          name="price-product"
                          placeholder="Please enter a number"
                          defaultValue={priceProduct}
                          value={priceProduct}
                          allowNegativeValue={false}
                          allowDecimals={false}
                          step={1000}
                          prefix={'₫'}
                          onValueChange={(value, name) => setPriceProduct(value)}
                        />
                      </div>
                    </Col>
                    {/* Loại sản phẩm */}
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Loại sản phẩm</label>
                        <select value={idTypeProduct} onChange={e => handleOnchangTypeProductFromProduct(e)} style={{ textTransform: 'capitalize' }} className='form-control'>
                          <option hidden>-- Chọn loại sản phẩm --</option>
                          {
                            listTypeProduct && listTypeProduct.length > 0 &&
                            listTypeProduct.map(item => {
                              return (
                                <option key={item.id} value={item.id}>{item.nameTypeProduct}</option>
                              )
                            })
                          }
                        </select>
                      </div>
                    </Col>
                    {/* Thương hiệu */}
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Thương hiệu</label>
                        <select value={idTrademark} onChange={e => setIdTrademark(e.target.value)} style={{ textTransform: 'capitalize' }} className='form-control'>
                          <option hidden>-- Chọn thương hiệu --</option>
                          {
                            listTrademark && listTrademark.length > 0 &&
                            listTrademark.map(item => {
                              if (item.typeProduct.id === idTypeProduct)
                                return (
                                  <option key={item.id} value={item.id}>{item.nameTrademark}</option>
                                )
                            })
                          }
                        </select>
                      </div>
                    </Col>
                    {/* Mô tả sản phẩm */}
                    <Col md='12'>
                      <div className='form-group'>
                        <label>Mô tả sản phẩm</label>
                        <div className={isFullscreen ? 'wrap-editor full' : 'wrap-editor'}>
                          <div className="iconFullsceen">
                            <i className="fa-solid fa-expand" onClick={toggleFullscreen}></i>
                          </div>
                          <ReactQuill
                            theme="snow"
                            value={descriptionProductHTML}
                            modules={{
                              toolbar: [
                                [{ header: [1, 2, 3, 4, 5, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ script: 'sub' }, { script: 'super' }],
                                [{ indent: '-1' }, { indent: '+1' }],
                                [{ direction: 'rtl' }],
                                [{ size: ['small', false, 'large', 'huge'] }],
                                [{ color: [] }, { background: [] }],
                                [{ font: [] }],
                                [{ align: [] }],
                                ['clean', 'image', 'link', 'video'],
                              ],
                            }}
                            onChange={setDescriptionProductHTML}
                            placeholder="Nhập nội dung ở đây..."
                          />

                        </div>
                      </div>
                    </Col>
                    {/* Ảnh sản phẩm */}
                    <Col md='12'>
                      <div className='form-group image-product'>
                        <label>Ảnh sản phẩm (tối thiểu 2 ảnh)</label>
                        <ImageUploading
                          multiple
                          value={imageProducts}
                          onChange={onChangeImageProduct}
                          maxNumber={10}
                          dataURLKey="data_url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                          }) => (
                            // write your building UI
                            <div className="upload__image-wrapper">
                              <button
                                // style={isDragging ? { color: 'red' } : undefined}
                                // {...dragProps}
                                onClick={onImageUpload}
                                className='btn btn-info'
                              >
                                Upload
                              </button>
                              &nbsp;
                              <button className='btn btn-danger' onClick={onImageRemoveAll}>
                                Xóa tất cả ảnh
                              </button>
                              &nbsp; Còn trống <b>{10 - imageProducts.length}</b> ảnh
                              <div><b>(Định dạng: .jpg, .jpeg, .png, .webp)</b></div>
                              <div className='images-product-container mt-3'
                                style={isDragging ? { border: '1px solid red', backgroundColor: '#ccc' } : undefined}
                                {...dragProps}
                              >
                                {imageList.length === 0 && !isDragging &&
                                  <div className='no-image-product'>
                                    <img src={noImageProduct} alt="Không có ảnh sản phẩm" />
                                  </div>
                                }
                                {imageList.map((image, index) => (
                                  <div key={index} className="image-item">
                                    <img src={image['data_url']} alt="" width="140" />
                                    <div className='image-item-delete nc-icon nc-simple-remove' onClick={() => onImageRemove(index)}></div>
                                    <div className='image-item-wrap'>
                                      <div
                                        className="nc-icon nc-zoom-split"
                                        title="Xem ảnh"
                                        onClick={() => { setIndexReviewImage(index); setIsShowReviewImage(true) }}
                                      ></div>
                                      <div
                                        className='nc-icon nc-settings-tool-66'
                                        title="Thay đổi ảnh"
                                        onClick={() => onImageUpdate(index)}
                                      ></div>
                                    </div>

                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </ImageUploading>
                        {
                          isShowReviewImage &&
                          <Lightbox
                            mainSrc={imageProducts[indexReviewImage]['data_url']}
                            onCloseRequest={() => setIsShowReviewImage(false)}
                          />
                        }
                      </div>
                    </Col>
                    {/* Phân loại sản phẩm */}
                    <Col md='12'>
                      <Row>
                        <Col md='12'>
                          <div className='form-group classify-product'>
                            <label>Phân loại sản phẩm (màu sắc, kích thướt...)</label>
                          </div>
                        </Col>
                        <Col md='5'>
                          <div className='form-group'>
                            <label>Tên phân loại</label>
                            <input value={nameClassify}
                              onChange={e => setNameClassify(e.target.value !== 'default' ? e.target.value : '')}
                              className="form-control" />
                          </div>
                        </Col>
                        <Col md='3'>
                          <div className='form-group'>
                            <label>Số lượng sản phẩm</label>
                            <CurrencyInput
                              className="form-control"
                              id="input-count-classify"
                              name="count-classify"
                              placeholder="Nhập số lượng sản phẩm"
                              value={countClassify}
                              defaultValue={countClassify}
                              allowNegativeValue={false}
                              allowDecimals={false}
                              step={1}
                              onValueChange={(value, name) => setCountClassify(value)}
                            />
                          </div>
                        </Col>
                        <Col md='3'>
                          <div className='form-group'>
                            <label>STT ảnh</label>
                            <select value={sttImageClassify}
                              onChange={e => setSttImageClassify(e.target.value)} className="form-control">
                              <option value='' hidden>-- Chọn ảnh --</option>
                              <option value=''>None</option>
                              {
                                <RenderOptionImgClassify />
                              }
                            </select>
                          </div>
                        </Col>
                        <Col md='3'>
                          <div className='form-group'>
                            <label>Giá loại</label>
                            <CurrencyInput
                              className="form-control"
                              id="input-count-classify"
                              name="count-classify"
                              placeholder="Nhập giá phân loại"
                              value={priceClassify}
                              defaultValue={priceClassify}
                              allowNegativeValue={false}
                              allowDecimals={false}
                              step={1000}
                              prefix={'₫'}
                              onValueChange={(value, name) => setPriceClassify(value)}
                            />
                          </div>
                        </Col>

                        <Col md='12'>
                          {
                            addOrEditClassify ?
                              <button className="btn btn-primary" onClick={handleAddClassify}>Add</button>
                              :
                              <>
                                <button className="btn btn-warning" onClick={handleEditClassify}>
                                  Lưu
                                </button>
                                <button className="btn btn-danger mx-2" onClick={handleCancelEditClassify}>
                                  Hủy
                                </button>
                              </>
                          }
                        </Col>
                        <Col md='12'>
                          <div className='wrap-classify my-3'>
                            {listClassify.length === 0 &&
                              <div className='no-classify'>
                                Không có phân loại nào
                              </div>
                            }

                            {
                              listClassify.length > 0 &&
                              listClassify.map((item, index) => (
                                <div key={index} className='wrap-btn-classify'>
                                  <button className='btn btn-warning'
                                    onClick={() => handleClickClassify(item, index)}
                                  >
                                    {item.nameClassify}
                                  </button>
                                  <div className='nc-icon nc-simple-remove'
                                    onClick={() => handleDeleteClassify(index)}></div>
                                </div>
                              ))
                            }






                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md='12'>
                      {
                        addOrEditProduct ?
                          <button className="btn btn-primary" onClick={handleAddProduct}>
                            Thêm sản phẩm
                          </button>
                          :
                          <>
                            <button className="btn btn-warning" onClick={handleEditProduct}>
                              Lưu sản phẩm
                            </button>
                            <button className="btn btn-danger mx-2" onClick={handleCancelEditProduct}>
                              Hủy
                            </button>
                            {
                              isSellProduct === 'true' ?
                                <button className="btn btn-danger"
                                  onClick={() => handleBlockProduct('false')}>
                                  Khóa sản phẩm
                                </button> :
                                <button className="btn btn-danger"
                                  onClick={() => handleBlockProduct('true')}>
                                  Tắt khóa sản phẩm
                                </button>
                            }
                          </>
                      }
                    </Col>
                  </Row>
                </Col>
                <div style={{ padding: '20px 0' }}></div>
              </Card>
            </Col>

            {/* Danh sach */}
            <Col md='12'>
              <Card className="strpied-tabled-with-hover">
                <Card.Body className="table-full-width table-responsive px-0">
                  <Col md='6'>
                    <select value={idFillterTypeProduct} className="form-control" onChange={(e) => handleChangeTypeFillterProduct(e)}>
                      <option value={'all'}>Tất cả</option>
                      {
                        listTypeProduct?.map(item => (
                          <option key={item.id} value={item.id}>{item.nameTypeProduct}</option>
                        ))
                      }
                    </select>
                    <input className="form-control mt-3" placeholder="Tên sản phẩm..." onChange={(e) => handleChangeNameFillterProduct(e)} />
                  </Col>
                  <Table className="table-hover table-striped mt-2">
                    <thead>
                      <tr>
                        <th className="border-0">ID</th>
                        <th className="border-0">Tên sản phẩm</th>
                        <th className="border-0">Giá</th>
                        <th className="border-0">Loại sản phẩm</th>
                        <th className="border-0">Thương hiệu</th>
                        <th className="border-0">Số lượng</th>
                        <th className="border-0">Trạng thái</th>
                        <th className="border-0">Thời gian khuyễn mãi</th>
                        <th className="border-0">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listProducts.length > 0 &&
                        listProducts.map((item) => {
                          return (
                            <tr key={item.id}>
                              <td>{item.id}</td>
                              <td style={{ textTransform: 'capitalize' }}>{item.nameProduct}</td>
                              <td>{item.priceProduct}</td>
                              <td>{item.typeProduct?.nameTypeProduct}</td>
                              <td>{item.trademark.nameTrademark}</td>
                              <td>
                                {
                                  item['classifyProduct-product'].reduce((c, item) => {
                                    return c + item.amount
                                  }, 0)
                                }
                              </td>
                              <td>
                                {
                                  item.isSell === 'true' ? "Còn bán" : "Nghĩ bán"
                                }
                              </td>
                              {
                                item.promotionProducts.length === 0 ?
                                  <>
                                    <td>Hết hạn giảm giá</td>
                                  </>
                                  :
                                  <>
                                    <td>
                                      {
                                        countDownPromotion(item.promotionProducts[0].timePromotion)
                                      }
                                    </td>
                                  </>
                              }
                              <td>
                                <Row>
                                  <Col md="12">
                                    <button className="btn btn-warning p-1"
                                      onClick={() => handleSetUpEditProduct(item)}
                                      style={{ fontSize: '12px', width: '100%' }}
                                    >
                                      Sửa
                                    </button>
                                  </Col>
                                  <Col md='12'>
                                    <button className="btn btn-danger p-1"
                                      onClick={() => handleTest(item.id)}
                                      style={{ fontSize: '12px', width: '100%' }}
                                    >Xóa</button>
                                  </Col>
                                  <Col md='12'>
                                    <a href={`${process.env.REACT_APP_LINK_FONTEND}/product/${item.id}`} target="_blank">
                                      <button className="btn btn-primary p-1"
                                        style={{ fontSize: '12px', width: '100%' }}
                                      >
                                        Xem
                                      </button>
                                    </a>
                                  </Col>
                                  <Col md='12'>
                                    <button className="btn btn-danger p-1"
                                      onClick={() => handleOpenModalAddPromotion(item.id, item.promotionProducts)}
                                      style={{ fontSize: '12px', width: '100%' }}
                                    >
                                      Thêm khuyến mãi
                                    </button>
                                  </Col>
                                </Row>



                              </td>
                            </tr>
                          )
                        })
                      }


                    </tbody>
                  </Table>
                </Card.Body>
                <Col md='12'>
                  <div>
                    <PaginationExampleShorthand onChange={onchangePageProduct} count={countPages} page={currentPage} />
                  </div>
                </Col>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md='12'>
              <Modal isOpen={isOpenModalAddPromotion}>
                <ModalHeader toggle={() => setIsOpenModalAddPromotion(false)}>Thêm khuyến mãi</ModalHeader>
                <ModalBody>
                  <div className='form-group'>
                    <label>Phần trăm (%)</label>
                    <CurrencyInput
                      className="form-control"
                      id="input-count-classify"
                      name="count-classify"
                      placeholder="Nhập phần trăm giảm giá"
                      value={persentPromotion}
                      defaultValue={persentPromotion}
                      allowNegativeValue={false}
                      allowDecimals={false}
                      step={1}
                      maxLength={2}
                      suffix={'%'}
                      onValueChange={(value, name) => setPersenPromotion(value)}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Thời gian (ngày)</label>
                    <CurrencyInput
                      className="form-control"
                      id="input-count-classify"
                      name="count-classify"
                      placeholder="Nhập số ngày giảm giá"
                      value={timePromotion}
                      defaultValue={timePromotion}
                      allowNegativeValue={false}
                      allowDecimals={false}
                      step={1}
                      maxLength={2}
                      onValueChange={(value, name) => setTimePromotion(value)}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button className="btn btn-primary" onClick={() => handleAddPromotion()}>Lưu</button>
                  <button className="btn btn-danger" onClick={() => setIsOpenModalAddPromotion(false)}>Hủy</button>
                </ModalFooter>
              </Modal>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>
    </>
  );
}

export default TableProduct;
