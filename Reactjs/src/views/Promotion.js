import React, { useEffect, useState } from "react";
import { CheckAdminLogin, handleCheckLoginAdmin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
// react-bootstrap components
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
  getProductPromotion, addPromotionByIdProduct, getListProductPromotion, createEventPromotion,
  uploadImageCoverPromotion, getListEventPromotion, editEventPromotionById, getContentEventPromotionAdmin,
  deleteEventProdmotionAdmin
} from "services/adminService";
import NotificationAlert from "react-notification-alert";
import PaginationExampleShorthand from "components/Commons/Pagination";
import CurrencyInput from 'react-currency-input-field';
import { DatePicker, Select } from 'antd';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import '../assets/css/Promotion.scss'


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';
import LoadingOverlay from 'react-loading-overlay-ts';
import moment from 'moment';

const optionPromotions = () => {
  let arr = []
  for (let i = 0; i < 99; i++) {
    let obj = {
      value: i + 1,
      label: `-${i + 1}%`
    }
    arr.push(obj)
  }

  return arr


}


function Promotion() {
  const notificationAlertRef = React.useRef(null);

  const [typeSwap, setTypeSwap] = useState('1');
  const [currentPage, setCurrentPage] = useState(1);
  const [countPage, setCountPage] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [isOpenModalChoosePromotion, setIsOpenModalChoosePromotion] = useState(false);

  const [openLoading, setOpenLoading] = useState(false)
  const [firstContent, setFirstContent] = useState('')
  const [lastContent, setLastContent] = useState('')
  const [urlCover, setUrlCover] = useState('')
  const [fileCover, setFileCover] = useState('')
  const [listProductPromotion, setListProductPromotion] = useState([])
  const [nameEvent, setNameEvent] = useState('')
  const [timeStart, setTimeStart] = useState('')
  const [timeEnd, setTimeEnd] = useState('')
  const [valueSearch, setValueSearch] = useState('')
  const [listEvent, setListEvent] = useState([])
  const [idEditEvent, setIdEditEvent] = useState('')
  const [nameEventSearch, setNameEventSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('2')
    getListProductPromotions()
    getListEventPromotions()
  }, [])

  useEffect(() => {
    getListProduct();
  }, [typeSwap, currentPage])


  const getListProduct = async () => {
    let res = await getProductPromotion({
      currentPage: currentPage,
      typeSwap: typeSwap
    })
    if (res && res.errCode === 0) {
      setCountPage(parseInt(res.count / 11) + 1);
      setListProduct(res.data)
    }
  }

  const getListProductPromotions = async () => {
    let res = await getListProductPromotion()
    // console.log(res);
    if (res?.data?.products) {
      let arr = res.data.products.map((item, index) => ({
        id: item.id,
        nameProduct: item.nameProduct,
        numberPercent: +item.promotionProduct.numberPercent,
        isChoose: false,
        nameTrademark: item.trademark.nameTrademark,
        nameTypeProduct: item.typeProduct.nameTypeProduct
      }))
      setListProductPromotion(arr)
    }
  }

  const getListEventPromotions = async () => {
    let res = await getListEventPromotion()
    console.log(res);
    if (res?.errCode === 0)
      setListEvent(res.data)
    else
      notify('br', 3, res?.errMessage)
  }

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



  const handleUploadCover = (e) => {
    console.log(e);

    let file = e.target.files[0]
    if (!file.type.includes('image')) {
      setFileCover('')
      e.target.value = ''
      return
    }
    URL.revokeObjectURL(urlCover)
    let url = URL.createObjectURL(file)
    setUrlCover(url)
    setFileCover(file)
  }

  const handleToggleChooseProduct = (index) => {
    let arr = [...listProductPromotion]
    arr[index].isChoose = !arr[index].isChoose

    setListProductPromotion(arr)
  }

  const handleChangePersent = (value, index) => {
    console.log(value);
    let arr = [...listProductPromotion]
    arr[index].numberPercent = value

    setListProductPromotion(arr)
  }

  const handleChangeAllProductPromotion = (value) => {
    let arr = [...listProductPromotion]
    arr = arr.map(item => {
      if (item.isChoose)
        return {
          ...item,
          numberPercent: value
        }
      return item
    })
    setListProductPromotion(arr)
  }


  const handleAddEventPromotion = async () => {
    if (!nameEvent) {
      notify('br', 4, 'Vui lòng nhập tên sự kiện')
      return
    }
    if (!timeStart && !timeEnd) {
      notify('br', 4, 'Vui lòng chọn thời gian sự kiện')
      return
    }

    if (!fileCover) {
      notify('br', 4, 'Vui lòng chọn ảnh bìa')
      return
    }
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }



    let arrProduct = []
    listProductPromotion.forEach(item => {
      if (item.isChoose)
        arrProduct.push({
          id: item.id,
          numberPercent: item.numberPercent
        })
    })

    if (arrProduct.length < 5) {
      notify('br', 4, 'Vui lòng chọn ít nhất 5 sản phẩm cho sự kiện')
      return
    }




    let data = {
      accessToken,
      nameEvent,
      timeStart,
      timeEnd,
      firstContent,
      lastContent,
      arrProduct: JSON.stringify(arrProduct)
    }
    // console.log(data);

    // return
    setLoading(true)
    let form = new FormData()
    form.append('file', fileCover)
    let res = await createEventPromotion(data)
    console.log(res);

    if (res?.errCode === 0) {
      uploadImageCoverPromotion(form, { idEventPromotion: res.idEventPromotion })

      setNameEvent('')
      setTimeEnd('')
      setTimeStart('')
      setFileCover('')
      setUrlCover('')
      setFirstContent('')
      setLastContent('')
      setLoading(false)

      let arr = listProductPromotion.map(item => ({
        ...item,
        isChoose: false,
      }))
      setListProductPromotion(arr)

      notify('br', 2, 'Đã thêm sự kiện')
    }
    else if (res?.errCode !== -1) {
      notify('br', 4, res?.errMessage || 'Có lỗi xảy ra vui lòng kiểm tra và thử lại sau!')
      setLoading(false)
    }
    else {
      setLoading(false)
    }

  }

  const handleChangeDatePromotion = (value) => {
    let timeStart = new Date(value[0].$d).getTime()
    let timeEnd = new Date(value[1].$d).getTime()

    console.log(timeStart, timeEnd);
    setTimeStart(timeStart)
    setTimeEnd(timeEnd)

  }

  const handleSetUpEditEvent = async (item) => {
    let res = await getContentEventPromotionAdmin({
      idEventPromotion: item.id
    })

    if (res.errCode === 0) {
      setFirstContent(res.data.firstContent)
      setLastContent(res.data.lastContent)
    }
    setIdEditEvent(item.id)
    setNameEvent(item.nameEvent)
    setTimeStart(item.timeStart)
    setTimeEnd(item.timeEnd)

    setFileCover('')

    URL.revokeObjectURL(urlCover)
    setUrlCover('')

    let arr = listProductPromotion.map(item => ({
      ...item,
      isChoose: false,
    }))
    setListProductPromotion(arr)




  }

  const handleCancelEditEvent = () => {
    setIdEditEvent('')
    setNameEvent('')
    setTimeStart('')
    setTimeEnd('')
    setFirstContent('')
    setLastContent('')
    setFileCover('')

    URL.revokeObjectURL(urlCover)
    setUrlCover('')

    let arr = listProductPromotion.map(item => ({
      ...item,
      isChoose: false,
    }))
    setListProductPromotion(arr)
  }

  const handleEditEvent = async () => {
    if (!nameEvent) {
      notify('br', 4, 'Vui lòng nhập tên sự kiện')
      return
    }
    if (!timeStart && !timeEnd) {
      notify('br', 4, 'Vui lòng chọn thời gian sự kiện')
      return
    }

    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }


    let data = {
      accessToken,
      nameEvent,
      timeStart,
      timeEnd,
      firstContent,
      lastContent,
      idEventPromotion: idEditEvent
    }
    setLoading(true)
    let res = await editEventPromotionById(data)
    if (res?.errCode === 0) {
      getListEventPromotions()
      handleCancelEditEvent()
      notify('br', 2, 'Đã chỉnh sửa thành công')
      setLoading(false)
    }
    else {
      setLoading(false)
    }

  }

  const getTimeEvent = (timestamp) => {
    const date = new Date(+timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);

    const dateString = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    return dateString;
  }

  const handleDeleteEvent = async (item) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await deleteEventProdmotionAdmin({
      accessToken,
      idEvent: item.id
    })
    if (res?.errCode === 0) {
      getListEventPromotions()
    }
  }

  return (
    <div className='Promotion-container'>
      <LoadingOverlay
        active={openLoading}
        spinner
        text='Đang xử lý...'
      >
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />

          {/* khuyễn mãi theo sự kiện */}
          <Row>
            <Col md='12'>
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Thêm sự kiện khuyến mãi</Card.Title>
                  <p className="card-category">
                    Tạo sự kiện khuyến mãi
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Row>
                    <Col md='6'>
                      <div className="form-group p-2">
                        <label>Nhập tên sự kiện</label>
                        <input
                          value={nameEvent}
                          onChange={(e) => setNameEvent(e.target.value)}
                          className="form-control" placeholder="Tên sự kiện" />
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className="form-group p-2">
                        <label>Thời gian sự kiện</label>
                        <RangePicker showTime
                          onChange={handleChangeDatePromotion}
                          value={timeStart !== '' && timeEnd !== '' && [dayjs.unix(timeStart / 1000), dayjs.unix(timeEnd / 1000)]}
                          format={'DD/MM/YYYY hh:mm:ss'}
                        />
                      </div>
                    </Col>
                    <Col md='12'>
                      <div className="form-group p-2">
                        <label>Ảnh bìa sự kiện (1107x630)</label>
                        <input type='file' accept="image/*" className="form-control" onChange={(e) => handleUploadCover(e)} />
                        {
                          urlCover &&
                          <img src={urlCover} width={200} height={200} />
                        }
                      </div>
                    </Col>
                    <Col md='12'>
                      <div className="form-group p-2">
                        <label>Nội dung phần đầu</label>
                        <ReactQuill
                          theme="snow"
                          value={firstContent}
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
                          onChange={setFirstContent}
                          placeholder="Nhập nội dung ở đây..."
                        />
                      </div>
                    </Col>
                    <Col md='12'>
                      <div className="form-group p-2">
                        <label>Danh sách sản phẩm</label>
                        <br />
                        <button style={{ height: '40px' }} className="btn btn-primary"
                          onClick={() => setIsOpenModalChoosePromotion(true)}
                        >Chọn sản phẩm</button>
                        <Table className="table-hover table-striped">
                          <thead>
                            <tr>
                              <th className="border-0">Tên sản phẩm</th>
                              <th className="border-0" >
                                Khuyến mãi&nbsp;&nbsp;&nbsp;
                                <Select
                                  defaultValue={10}
                                  style={{
                                    width: 100,
                                  }}
                                  onChange={handleChangeAllProductPromotion}
                                  options={optionPromotions()}
                                />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              listProductPromotion.map((item, index) => {
                                if (item.isChoose) {
                                  return (
                                    <tr key={item.id}>
                                      <td>
                                        <a href={`${process.env.REACT_APP_LINK_FONTEND}/product/${item.id}`} target="_blank">{item.nameProduct}</a>
                                      </td>
                                      <td>
                                        <Select
                                          value={item.numberPercent}
                                          style={{
                                            width: 100,
                                          }}
                                          onChange={(value) => handleChangePersent(value, index)}
                                          options={optionPromotions()}
                                        />
                                      </td>
                                    </tr>
                                  )
                                }
                              })
                            }

                          </tbody>
                        </Table>
                      </div>

                    </Col>
                    <Col md='12'>
                      <div className="form-group p-2">
                        <label>Nội dung phần cuối</label>
                        <ReactQuill
                          theme="snow"
                          value={lastContent}
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
                          onChange={setLastContent}
                          placeholder="Nhập nội dung ở đây..."
                        />
                        {
                          !idEditEvent ?
                            <>
                              {
                                !loading ?
                                  <button className="btn btn-primary mt-3"
                                    onClick={handleAddEventPromotion}
                                  >Thêm sự kiện</button> :
                                  <div className="btn btn-primary mt-3">
                                    Loading...
                                  </div>
                              }
                            </>
                            :
                            <>
                              {
                                !loading ?
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleEditEvent}
                                  >
                                    Lưu
                                  </button> :
                                  <button
                                    className="btn btn-primary"
                                  >
                                    Loading...
                                  </button>
                              }

                              <button
                                className="btn btn-danger"
                                onClick={handleCancelEditEvent}
                              >
                                Hủy
                              </button>
                            </>
                        }
                      </div>
                    </Col>
                    <Col md='12'>
                      <div style={{ borderTop: '5px solid #000', marginTop: '100px' }}></div>
                      <input className="form-control" style={{ width: '200px', border: '1px solid #000', margin: '10px' }}
                        placeholder="Nhập tên sự kiện"
                        onChange={(e) => setNameEventSearch(e.target.value)}
                      />
                      <Table className="table-hover table-striped">
                        <thead>
                          <tr>
                            <th className="border-0">
                              Tên sự kiện</th>
                            <th>Ảnh</th>
                            <th className="border-0" >Bắt đầu</th>
                            <th className="border-0" >Kết thúc</th>

                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            listEvent?.map(item => {
                              if (item.nameEvent.includes(nameEventSearch))
                                return (
                                  <tr key={item.id}>
                                    <td>{item?.nameEvent}</td>
                                    <td>
                                      <img src={item.cover} width={100} />
                                    </td>
                                    <td>{getTimeEvent(item.timeStart)}</td>
                                    <td>{getTimeEvent(item.timeEnd)}</td>
                                    <td>
                                      <button
                                        className="btn btn-warning"
                                        onClick={() => handleSetUpEditEvent(item)}
                                      >Chỉnh sửa</button>

                                      <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteEvent(item)}
                                      >
                                        Xóa
                                      </button>
                                    </td>
                                  </tr>
                                )
                            })
                          }

                        </tbody>
                      </Table>
                    </Col>


                    <Modal isOpen={isOpenModalChoosePromotion} toggle={() => { setIsOpenModalChoosePromotion(false); setValueSearch('') }}
                      size="lg"
                    >
                      <ModalHeader toggle={() => { setIsOpenModalChoosePromotion(false); setValueSearch('') }}>Chọn sản phẩm</ModalHeader>
                      <ModalBody>
                        <input type="search" className="form-control"
                          value={valueSearch}
                          placeholder="Tìm sản phẩm"
                          onChange={(e) => setValueSearch(e.target.value)} />
                        <Table className="table-hover table-striped">
                          <thead>
                            <tr>
                              <th></th>
                              <th className="border-0">Tên sản phẩm</th>
                              <th className="border-0" >Loại sản phẩm</th>
                              <th>Thương hiệu</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              listProductPromotion.map((item, index) => {
                                if (item.nameProduct.includes(valueSearch))
                                  return (
                                    <tr key={item.id}>
                                      <td>
                                        <input
                                          checked={item.isChoose}
                                          type="checkbox"
                                          onChange={() => handleToggleChooseProduct(index)}
                                        />
                                      </td>
                                      <td>{item.nameProduct}</td>
                                      <td>{item.nameTypeProduct}</td>
                                      <td>{item.nameTrademark}</td>
                                    </tr>
                                  )
                              })
                            }

                          </tbody>
                        </Table>
                      </ModalBody>
                    </Modal>

                  </Row>
                </Card.Body>


              </Card>
            </Col>
          </Row>




        </Container>
      </LoadingOverlay>
    </div>
  );
}

export default Promotion;
