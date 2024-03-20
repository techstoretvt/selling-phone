import React, { useEffect, useState } from "react";
import moment from "moment";
import { CheckAdminLogin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
// react-bootstrap components
import {
  Card,
  Table,
  Container,
  Row,
  Col
} from "react-bootstrap";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {
  getListBillsByType,
  confirmBillById,
  cancelBillById, getListBillByTypeAdmin, updateStatusBillAdmin,
  getDetailBillByIdAdmin, handleCheckLoginAdmin
} from "services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';
import provinces from '../services/provinces.json'


function ListPurchase() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [listBills, setListBills] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [currentBillId, setCurrentBillId] = useState(null);
  const [isStartConfirm, setIsStartConfirm] = useState(false);
  const [isStartCancel, setIsStartCancel] = useState(false);
  const [status, setStatus] = useState(1)
  const history = useHistory();
  const [listDetailBill, setListDetailBill] = useState([])
  const [addressBill, setAddressBill] = useState('')
  const [idBillSearch, setIdBillSearch] = useState('')


  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])
  useEffect(() => {
    getListBill();
  }, [status, idBillSearch])


  const getListBill = async () => {
    let res = await getListBillByTypeAdmin({
      type: status,
      page: 1,
      idBill: idBillSearch
    });
    // console.log(res);
    if (res) {
      setListBills(res.data)

    }

  }

  const handleGetListDetailBill = async (idBill) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await getDetailBillByIdAdmin({
      accessToken,
      idBill
    })

    console.log(res);
    if (res?.errCode === 0) {
      setIsOpenModal(true)
      setListDetailBill(res.data.listProduct)
      setAddressBill(res.data.adderssBill)
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

  const renderStatusBill = (idStatusBill) => {
    if (idStatusBill === 1) return "Hóa đơn mới"
    if (idStatusBill === 3 || idStatusBill === 2.99) return 'Hoàn thành'
    if (idStatusBill === 4) return 'Đã hủy'
    if (idStatusBill >= 2 && idStatusBill < 2.99) return 'Đang tiến hành'
  }


  const handelConfirmBill = async (idBill) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await updateStatusBillAdmin({
      accessToken,
      idBill,
      status: 'confirm'
    })

    if (res?.errCode === 0) {
      notify('br', 2, 'Đã xác nhận đơn hàng')
      getListBill()
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }

  const handelCancelBill = async (idBill) => {
    let note = prompt('Lý do hủy đơn?')
    if (!note) return
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await updateStatusBillAdmin({
      accessToken,
      idBill,
      status: 'cancel',
      noteCancel: note
    })

    if (res?.errCode === 0) {
      notify('br', 2, 'Đã hủy đơn hàng')
      getListBill()
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }

  const handleUpdateStatusBill = async (idBill) => {
    let note = prompt('Mô tả cho lần cập nhật này')
    if (!note) return
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await updateStatusBillAdmin({
      accessToken,
      idBill,
      status: 'change',
      nameStatus: note
    })

    if (res?.errCode === 0) {
      notify('br', 2, 'Đã cập nhật đơn hàng')
      getListBill()
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }

  const handleSuccessBill = async (idBill) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await updateStatusBillAdmin({
      accessToken,
      idBill,
      status: 'success'
    })

    if (res?.errCode === 0) {
      getListBill()
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }


  const handleOnchangeIdBillSearch = (idBill) => {
    setIdBillSearch(idBill)
  }

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
            {/* List bill */}
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Quản lý đơn hàng</Card.Title>
                  <p className="card-category">
                    Quản lý các đơn hàng mới ở đây.
                  </p>
                </Card.Header>
                <Col md='12'>
                  <select value={status} className="form-control" onChange={(e) => { setStatus(e.target.value); setIdBillSearch('') }}>
                    <option value={1}>Chưa duyệt</option>
                    <option value={2}>Đang tiến hành</option>
                    <option value={3}>Đã giao</option>
                    <option value={4}>Đã hủy</option>
                  </select>
                </Col>
                <Col md='12'>Số lượng đơn {listBills.length}</Col>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">
                          <Row>
                            <Col md='2'>
                              Mã
                            </Col>
                            <Col md='10'>

                              <input className="form-control" placeholder="Tìm theo mã đơn..."
                                value={idBillSearch} onChange={(e) => handleOnchangeIdBillSearch(e.target.value)}

                              />
                            </Col>
                          </Row>
                        </th>
                        <th className="border-1">Thời gian</th>
                        <th>Trạng thái</th>
                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>

                      {
                        listBills.length > 0 &&
                        listBills.map((item, index) => {
                          let date = new Date(+item.timeBill)
                          let date2 = moment(date, 'DD-MM-YYYY');
                          return (
                            <tr key={item.id}>
                              <td >
                                {item.id}
                              </td>
                              <td>{date2.toString()}</td>
                              <td>{renderStatusBill(item.idStatusBill)}</td>
                              <td>
                                <button className="btn btn-default"
                                  onClick={() => handleGetListDetailBill(item.id)}
                                  style={{ padding: '0', fontSize: '14px', width: '100%' }}
                                >Xem chi tiết</button>
                                {
                                  item.idStatusBill === 1 &&
                                  <>
                                    <button className="btn btn-primary"
                                      style={{ padding: '0', fontSize: '14px', width: '100%' }}
                                      onClick={() => handelConfirmBill(item.id)}
                                    >Duyệt đơn</button>
                                    <button className="btn btn-danger"
                                      style={{ padding: '0', fontSize: '14px', width: '100%' }}
                                      onClick={() => handelCancelBill(item.id)}
                                    >Hủy đơn</button>
                                  </>
                                }
                                {
                                  item.idStatusBill >= 2 && item.idStatusBill < 2.99 &&
                                  <>
                                    <button className="btn btn-primary"
                                      style={{ padding: '0', fontSize: '14px', width: '100%' }}
                                      onClick={() => handleUpdateStatusBill(item.id)}
                                    >Cập nhật trạng thái</button>
                                    <button className="btn btn-primary"
                                      style={{ padding: '0', fontSize: '14px', width: '100%' }}
                                      onClick={() => handleSuccessBill(item.id)}
                                    >Đã giao</button>
                                    <button className="btn btn-danger"
                                      style={{ padding: '0', fontSize: '14px', width: '100%' }}
                                      onClick={() => handelCancelBill(item.id)}
                                    >Hủy đơn</button>
                                  </>
                                }
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
        </Container>
      </LoadingOverlay>
      <Modal centered={false} size="lg" isOpen={isOpenModal} toggle={() => setIsOpenModal(false)}>
        <ModalHeader toggle={() => setIsOpenModal(false)}>
          Chi tiết đơn hàng
        </ModalHeader>
        <ModalBody>

          <Row>
            <Col md='12'>
              <b>Địa chỉ nhận hàng</b>
              <div style={{ textTransform: 'capitalize' }}>
                {

                  addressBill?.fullname + ' - ' +
                  addressBill?.sdt
                }
              </div>
              <div>
                {

                  addressBill?.addressText?.charAt(0).toUpperCase() + addressBill?.addressText?.slice(1)
                }
              </div>
              <div>
                {
                  isOpenModal &&
                  provinces[+addressBill?.country]?.districts[+addressBill?.district].name + ' - ' +
                  provinces[+addressBill?.country]?.name
                }
              </div>
            </Col>
            <Col md='12'>
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th className="border-1">Ảnh sản phẩm</th>
                    <th className="border-1">Tên sản phẩm</th>
                    <th className="border-1">Phân loại</th>
                    <th className="border-1">Đơn giá</th>
                    <th className="border-1">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    listDetailBill && listDetailBill.length > 0 &&
                    listDetailBill?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <img width={100}
                              src={item.product && item.product['imageProduct-product'] && item.product['imageProduct-product'][0]?.imagebase64}
                            />

                          </td>
                          <td>
                            <a href={`${process.env.REACT_APP_LINK_FONTEND}/product/${item.product?.id}?name=${item.product?.nameProduct}`} target="_blank">
                              {item.product.nameProduct}
                            </a>
                          </td>
                          <td>
                            {
                              item.classifyProduct?.nameClassifyProduct !== 'default' ?
                                item.classifyProduct?.nameClassifyProduct :
                                '---'
                            }
                          </td>
                          <td>
                            {item.product?.priceProduct}
                          </td>
                          <td>
                            {
                              item.amount
                            }
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </Col>
          </Row>

        </ModalBody>
        <ModalFooter>
          <div className="btn btn-danger" onClick={() => setIsOpenModal(false)}>Thoát</div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ListPurchase;
