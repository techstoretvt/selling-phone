import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col, Table
} from "react-bootstrap";

import { CheckAdminLogin, handleCheckLoginAdmin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
import {
  getListUserAdmin, lockUserAdmin
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';


function LockAccount() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [nameUser, setNameUser] = useState('')
  const [listUser, setListUser] = useState([])

  const history = useHistory();
  const idTimeOut = useRef()

  useEffect(() => {
    handleCheckLoginAdmin('2')
    getListUser()
  }, [])

  const getListUser = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    let res = await getListUserAdmin({
      accessToken,
      nameUser
    })
    console.log(res);
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


  const getAvatarUser = (item) => {
    if (!item) return
    if (item.avatarUpdate) {
      return item.avatarUpdate
    }
    if (item.typeAccount === 'web') {
      if (item.avatar) {
        return item.avatar
      }
      else {
        return process.env.REACT_APP_LINK_FONTEND + '/images/user/no-user-image.jpg'
      }
    }

    if (item.typeAccount === 'google') {
      return item.avatarGoogle
    }
    if (item.typeAccount === 'facebook') {
      return item.avatarFacebook
    }

    if (item.typeAccount === 'github') {
      return item.avatarGithub
    }

    return process.env.REACT_APP_LINK_FONTEND + '/images/user/no-user-image.jpg'
  }

  const onChangeNameUser = async (e) => {
    setNameUser(e.target.value)

    clearTimeout(idTimeOut.current)

    idTimeOut.current = setTimeout(async () => {
      let accessToken = localStorage.getItem('accessToken')
      if (!accessToken) return

      let res = await getListUserAdmin({
        accessToken,
        nameUser: e.target.value
      })
      console.log(res);
      if (res?.errCode === 0) {
        setListUser(res.data)
      }
    }, 500);


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
      getListUser();
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
                  <Card.Title as="h4">Quản lý người dùng</Card.Title>
                  <p className="card-category">
                    Chỉ dành cho quản trị viên
                  </p>
                </Card.Header>
                <Col md='12'>
                  <Row>
                    <Col md='6' className="my-3">
                      <input value={nameUser}
                        onChange={(e) => onChangeNameUser(e)}
                        className="form-control" placeholder="Tên user..."
                        style={{ border: '1px solid #000' }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">FirstName</th>
                        <th className="border-0">LastName</th>
                        <th className="border-0">SDT</th>
                        <th className="border-0">Gender</th>
                        <th className="border-0">Avatar</th>
                        <th className="border-0">TypeAccount</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listUser?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.sdt || 'Khong co'}</td>
                            <td>{item.gender}</td>
                            <td>
                              <img src={getAvatarUser(item)}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>{item.typeAccount}</td>
                            <td>{item.statusUser}</td>
                            <td>
                              <button className="btn btn-danger"
                                onClick={() => handleClickLockUser(item)}
                              >Khóa user</button>
                            </td>
                          </tr>
                        ))
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

export default LockAccount;
