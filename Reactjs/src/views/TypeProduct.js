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
import { Collapse, CardBody } from 'reactstrap';

import {
  getTypeProduct, addTypeProduct, editTypeProduct,
  getTrademarks, addTrademark, editTrademark,
  cloudinaryUpload, addNewProduct, getProductByPage, blockProduct, editProductById,
  editImageProduct
} from "services/adminService";
import NotificationAlert from "react-notification-alert";
import PaginationExampleShorthand from "components/Commons/Pagination";
import CurrencyInput from 'react-currency-input-field';


import '../assets/css/TableProduct.scss'
import ImageUploading from 'react-images-uploading';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import noImageProduct from '../assets/img/no-image-product.png'
import LoadingOverlay from 'react-loading-overlay-ts';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useRef } from "react";




function TypeProductPage() {
  const notificationAlertRef = React.useRef(null);
  const inputAddType = React.useRef();
  const inputImageTypeProduct = React.useRef();

  const [nameTypeProduct, setNameTypeProduct] = useState('');
  const [listTypeProduct, setListTypeProduct] = useState([]);
  const [typeBtnAddTypeProduct, setTypeBtnAddTypeProduct] = useState(true);
  const [idEditTypeProductCurrent, setIdEditTypeProductCurrent] = useState('');
  const [urlImageTypeProduct, setUrlImageTypeProduct] = useState('');
  const [nameTypeSearch, setNameTypeSearch] = useState('')
  const [fileImageTypeProduct, setFileImageTypeProduct] = useState('');

  const [isShowLoading, setIsShowLoading] = useState(false);


  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])

  useEffect(() => {
    getListTypeProduct();
  }, [])



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

  const handleAddTypeProduct = async () => {
    if (!nameTypeProduct || !fileImageTypeProduct) {
      notify('br', 4, "Vui lòng nhập tên loại và ảnh sản phẩm!")
      inputAddType.current.focus();
    }
    else {
      let accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        location.reload()
        return
      }
      let form = new FormData()
      form.append('file', fileImageTypeProduct)
      form.append('demo', 'nội dung demo')
      let res = await addTypeProduct({ nameTypeProduct, accessToken, file: form })
      if (res && res.errCode === 0) {
        notify('br', 2, "Thêm loại sản phẩm thành công.")
        setNameTypeProduct('')
        setUrlImageTypeProduct('')
        setFileImageTypeProduct('')
        inputImageTypeProduct.current.value = ''
        getListTypeProduct();
        inputAddType.current.focus();
      }
      else {
        notify('br', 3, res ? res.errMessage : "Đã có lỗi xảy ra!")
        inputAddType.current.focus();
      }
    }

  }

  const handleKeyDownAddType = (event) => {
    if (event.keyCode === 13) {
      if (typeBtnAddTypeProduct)
        handleAddTypeProduct()
      else
        handleEditTypeProduct();
    }
  }

  const handleSetUpEditTypeProduct = (item) => {
    setTypeBtnAddTypeProduct(false);
    setNameTypeProduct(item.nameTypeProduct);
    setUrlImageTypeProduct(item.imageTypeProduct)
    setIdEditTypeProductCurrent(item.id);
    setFileImageTypeProduct('');
    inputAddType.current.focus();
  }
  const handleCancelEditTypeProduct = () => {
    setTypeBtnAddTypeProduct(true);
    setNameTypeProduct('');
    setUrlImageTypeProduct('')
    setFileImageTypeProduct('');
    setIdEditTypeProductCurrent('');
  }

  const handleEditTypeProduct = async () => {
    if (!idEditTypeProductCurrent) {
      notify('br', 3, "Có lỗi xảy ra vui lòng thử lại sau hoặc báo cáo lại với quản trị viên!");
      return;
    }
    if (!nameTypeProduct) {
      notify('br', 4, "Tên loại sản phẩm không được để trống!");
      return;
    }

    let form = new FormData()
    form.append('file', fileImageTypeProduct)

    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let data = {
      id: idEditTypeProductCurrent,
      nameTypeProduct,
      form,
      accessToken
    }

    let res = await editTypeProduct(data);
    if (res && res.errCode === 0) {
      notify('br', 2, "Thay đổi loại sản phẩm thành công!");
      getListTypeProduct();
      getListTrademarks()
      handleCancelEditTypeProduct();
    }
    else {
      notify('br', 3, res ? res.errMessage : 'Thay đổi thất bại!');
    }
  }
  const handleOnchangeImage = (e) => {
    let url = URL.createObjectURL(e.target.files[0])
    setUrlImageTypeProduct(url)
    setFileImageTypeProduct(e.target.files[0])
  }


  //End TypeProduct



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
            {/* Loại sản phẩm */}
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Thêm loại sản phẩm</Card.Title>
                  <p className="card-category">
                    Quản lý loại sản phẩm ở đây.
                  </p>
                </Card.Header>
                <Col md='12'>
                  <div className='form-group mt-3'>
                    <label>Tên loại sản phẩm</label>
                    <input ref={inputAddType} value={nameTypeProduct} onChange={(e) => setNameTypeProduct(e.target.value)} className="form-control"
                      onKeyDown={(event) => handleKeyDownAddType(event)}
                    />
                  </div>
                  <div className='form-group mt-3'>
                    <label>Ảnh loại sản phẩm</label>
                    <input ref={inputImageTypeProduct} type='file' className="form-control-file"
                      onChange={(e) => handleOnchangeImage(e)} />
                    <img src={urlImageTypeProduct} alt="" style={{ width: '140px' }} />
                  </div>
                  {
                    typeBtnAddTypeProduct ?
                      <button
                        className="btn btn-primary mt-2"
                        onClick={handleAddTypeProduct}
                      >
                        Thêm
                      </button> :
                      <>
                        <button
                          className="btn btn-warning mt-2"
                          onClick={handleEditTypeProduct}
                        >
                          Lưu
                        </button>
                        <button
                          className="btn btn-danger mt-2 mx-2"
                          onClick={handleCancelEditTypeProduct}
                        >
                          Hủy
                        </button>
                      </>
                  }


                </Col>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">ID</th>
                        <th className="border-0">
                          <input className="form-control" placeholder="Tìm theo tên"
                            onChange={(e) => setNameTypeSearch(e.target.value)}
                          />
                          Tên loại sản phẩm
                        </th>
                        <th className="border-0">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listTypeProduct && listTypeProduct.length > 0 &&
                        listTypeProduct.map(item => {
                          if (item.nameTypeProduct.includes(nameTypeSearch))
                            return (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td style={{ textTransform: 'capitalize' }}>{item?.nameTypeProduct}</td>
                                <td>
                                  <button className="btn btn-warning" onClick={() => handleSetUpEditTypeProduct(item)}>Sửa</button>
                                  <button className="btn btn-danger mx-2">Xóa</button>
                                </td>
                              </tr>
                            )
                        })
                      }

                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>

          </Row>
        </Container>
      </LoadingOverlay>
    </>
  );
}

export default TypeProductPage;
