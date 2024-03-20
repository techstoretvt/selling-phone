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
  editImageProduct, swapImageProduct, deleteErrorProduct
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

// const mdParser = new MarkdownIt(/* Markdown-it options */);



function TrademarkPage() {
  const notificationAlertRef = React.useRef(null);
  const inputAddTrademark = React.useRef();

  const [listTypeProduct, setListTypeProduct] = useState([]);


  const [nameTrademark, setNameTrademark] = useState('');
  const [valueSelectTrademark, setValueSelectTrademark] = useState('')
  const [listTrademark, setListTrademark] = useState([]);
  const [typeBtnAddTrademark, setTypeBtnAddTrademark] = useState(true);
  const [idEditTrademark, setIdEditTrademark] = useState('');
  const [nameTrademarkSearch, setNameTrademarkSearch] = useState('')


  const [isShowLoading, setIsShowLoading] = useState(false);


  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])

  useEffect(() => {
    getListTrademarks()
  }, [valueSelectTrademark])

  useEffect(() => {
    getListTypeProduct();
  }, [])
  const getListTypeProduct = async () => {
    let res = await getTypeProduct()
    if (res && res.errCode === 0) {
      setListTypeProduct(res.data)
    }
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

  const handleAddTrademark = async () => {
    if (!nameTrademark) {
      notify('br', 4, 'Vui lòng nhập tên thương hiệu!');
      return;
    }
    if (!valueSelectTrademark) {
      notify('br', 4, 'Vui lòng chọn loại sản phẩm!');
      return;
    }
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let data = {
      idTypeProduct: valueSelectTrademark,
      nameTrademark,
      accessToken
    }

    let res = await addTrademark(data)
    if (res && res.errCode === 0) {
      notify('br', 2, 'Đã thêm thương hiệu mới!');
      setNameTrademark('');
      // setValueSelectTrademark('');
      inputAddTrademark.current.focus();
      getListTrademarks();
    }
    else if (res && res.errCode === 2) {
      notify('br', 4, 'Thương hiệu đã tồn tại!');
    }
    else {
      notify('br', 3, res ? res.errMessage : 'Có lỗi phía server!');
    }

  }

  const handleSetUpEditTrademark = (item) => {
    setTypeBtnAddTrademark(false);
    setNameTrademark(item.nameTrademark);
    setValueSelectTrademark(item.idTypeProduct);
    setIdEditTrademark(item.id);
    inputAddTrademark.current.focus();
  }

  const handleCancelEditTrademark = () => {
    setTypeBtnAddTrademark(true);
    setNameTrademark('');
    setValueSelectTrademark('')
    setIdEditTrademark('');
  }

  const handleEditTrademark = async () => {
    if (!idEditTrademark) {
      notify('br', 3, 'Lỗi không tìm thấy id thương hiệu, vui lòng báo cáo lại cho phái quản trị viên!');
      return;
    }
    if (!nameTrademark) {
      notify('br', 4, 'Không để trống tên thương hiệu!');
      return;
    }
    if (!valueSelectTrademark) {
      notify('br', 4, 'Vui lòng chọn loại sản phẩm!');
      return;
    }
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let data = {
      id: idEditTrademark,
      idTypeProduct: valueSelectTrademark,
      nameTrademark,
      accessToken
    }

    let res = await editTrademark(data);

    if (res && res.errCode === 0) {
      handleCancelEditTrademark();
      notify('br', 2, 'Đã sửa thương hiệu!');
      getListTrademarks();
    }
    else if (res && res.errCode === 3) {
      notify('br', 4, 'Thương hiệu đã tồn tại!');
    }
    else {
      notify('br', 3, res ? res.errMessage : 'Có lỗi phía server');
    }

  }

  const handleKeyDownAddTrademark = (e) => {
    if (e.keyCode === 13) {
      if (typeBtnAddTrademark)
        handleAddTrademark();
      else
        handleEditTrademark();
    }
  }
  //End Trademark

  //Product


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


            {/* Thương hiệu */}
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Thêm thương hiệu</Card.Title>
                  <p className="card-category">
                    Here is a subtitle for this table
                  </p>
                </Card.Header>
                <Col md="12">
                  <Row>
                    <Col md='6'>
                      <div className='form-group mt-3'>
                        <label>

                          Tên thương hiệu
                        </label>
                        <input ref={inputAddTrademark} value={nameTrademark} onChange={(e) => setNameTrademark(e.target.value)} className="form-control" onKeyDown={(e) => handleKeyDownAddTrademark(e)} />
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group mt-3'>
                        <label>Loại sản phẩm</label>
                        <select value={valueSelectTrademark} className="form-control" style={{ textTransform: 'capitalize' }}
                          onChange={(e) => setValueSelectTrademark(e.target.value)}
                        >
                          <option value='' hidden>-- Chọn loại sản phẩm --</option>
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
                    <Col md="12">
                      {
                        typeBtnAddTrademark ?
                          <button className="btn btn-primary" onClick={handleAddTrademark}>Thêm</button>
                          :
                          <>
                            <button className="btn btn-warning" onClick={handleEditTrademark}>Lưu</button>
                            <button className="btn btn-danger mx-2" onClick={handleCancelEditTrademark}>Hủy</button>
                          </>
                      }
                    </Col>
                  </Row>
                </Col>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">ID</th>
                        <th className="border-0">
                          <input className="form-control" placeholder="Nhập tên thương hiệu"
                            onChange={(e) => setNameTrademarkSearch(e.target.value)}
                          />
                          Tên thương hiệu
                        </th>
                        <th className="border-0">Loại sản phẩm</th>
                        <th className="border-0">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listTrademark && listTrademark.length > 0 &&
                        listTrademark.map(item => {

                          if (valueSelectTrademark) {
                            if (valueSelectTrademark === item.typeProduct?.id && item.nameTrademark.includes(nameTrademarkSearch)) {
                              return (
                                <tr key={item.id} style={{ textTransform: 'capitalize' }}>
                                  <td>{item.id}</td>
                                  <td>{item.nameTrademark}</td>
                                  <td>{item.typeProduct?.nameTypeProduct}</td>
                                  <td>
                                    <button className="btn btn-warning" onClick={() => handleSetUpEditTrademark(item)}>Sửa</button>
                                    <button className="btn btn-danger mx-2">Xóa</button>
                                  </td>
                                </tr>
                              )
                            }
                          }
                          else {
                            if (item.nameTrademark.includes(nameTrademarkSearch))
                              return (
                                <tr key={item.id} style={{ textTransform: 'capitalize' }}>
                                  <td>{item.id}</td>
                                  <td>{item.nameTrademark}</td>
                                  <td>{item.typeProduct?.nameTypeProduct}</td>
                                  <td>
                                    <button className="btn btn-warning" onClick={() => handleSetUpEditTrademark(item)}>Sửa</button>
                                    <button className="btn btn-danger mx-2">Xóa</button>
                                  </td>
                                </tr>
                              )

                          }
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

export default TrademarkPage;
