import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";

import { CheckAdminLogin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
import {
  createNewKeyword, createNewUserAdmin, getListTypeUser, lockUserAdmin, handleCheckLoginAdmin
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';


function ListPurchase() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const [listUser, setListUser] = useState([])
  const [nameSearch, setNameSearch] = useState('')

  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('1')
  }, [])

  useEffect(() => {
    handleGetListUser()
  }, [nameSearch])

  const handleGetListUser = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await getListTypeUser({
      accessToken,
      nameUser: nameSearch
    })
    if (res?.errCode === 0) {
      setListUser(res.data)
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


  const handleCreateNewUser = async () => {
    if (!username || !pass) {
      notify('br', 4, 'Vui lòng điền đầy đủ thông tin!')
      return
    }

    let data = {
      username,
      pass
    }

    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await createNewUserAdmin({
      accessToken,
      username,
      pass
    })
    if (res?.errCode === 0) {
      notify('br', 2, 'Succeed!')
      setUsername('')
      setPass('')
    }
    else if (res?.errCode === 3) {
      notify('br', 4, 'Tài khoản này đã tồn tại!')
    }
    else {
      notify('br', 3, res?.errMessage || 'Error!')
    }

  }

  const handelLockUser = async (idUser, status) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      notify('br', 4, 'Không thể thực hiện!')
      window.location.reload()
      return
    }
    console.log(typeof status);
    let statusLock
    if (status === 'true' || status === 'false')
      statusLock = status
    else if (typeof status === 'number') {
      let timestamp = new Date().getTime() + (status * 3600000)
      statusLock = timestamp.toString()
    }
    else {

      notify('br', 4, 'Dữ liệu vửa nhập không đúng định dạng!')
      return
    }


    let res = await lockUserAdmin({
      accessToken,
      idUser,
      status: statusLock
    })
    console.log(res);

    if (res?.errCode === 0) {
      handleGetListUser();
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }

  const handleClickLockUser = (item) => {
    let status = prompt('"true" mở khóa tài khoản\n"false" khóa vô thời hạn\n"nhập-sô" Khóa theo giờ')
    console.log(status);
    if (status !== 'true' && status !== 'false')
      status = status * 1

    handelLockUser(item.id, status)
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
            {/* List keyword */}
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Tạo tài khoản admin</Card.Title>
                  <p className="card-category">
                    Tài khoản quản trị chỉ được tạo ra ở đây
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Col md="6">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control" />

                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        value={pass}
                        type="password"
                        onChange={(e) => setPass(e.target.value)}
                        className="form-control" />

                    </div>
                  </Col>
                  <Col md="12">
                    <button className="btn btn-primary"
                      onClick={handleCreateNewUser}

                    >Thêm</button>
                  </Col>
                </Card.Body>
              </Card>

              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  {/* <Card.Title as="h4">Tạo tài khoản admin</Card.Title>
                  <p className="card-category">
                    Tài khoản quản trị chỉ được tạo ra ở đây
                  </p> */}
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <input className="form-control"
                    style={{ margin: '5px', width: '200px' }}
                    placeholder="Nhập tên"
                    onChange={(e) => setNameSearch(e.target.value)}
                  />
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">ID</th>
                        <th className="border-1">Tên</th>
                        <th className="border-1">Email</th>
                        <th className="border-1">Trang thái</th>
                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listUser?.map(item => {
                          return (
                            <tr key={item.id}>
                              <td>{item.id}</td>
                              <td>{item.firstName}</td>
                              <td>{item.email}</td>
                              <td>{item.statusUser}</td>
                              <td>
                                <button className="btn btn-danger"
                                  style={{ fontSize: '12px', padding: '4px', width: '100%' }}
                                  onClick={(e) => handleClickLockUser(item)}
                                >
                                  Khóa
                                </button>
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
    </>
  );
}

export default ListPurchase;
