import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";

import { CheckAdminLogin, handleCheckLoginAdmin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
import {
  createNewKeyword, getListKeyWord, editKeywordSearch, deleteKeyWordSearchAdmin
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';


function ListPurchase() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [valueInput, setValueInput] = useState('')
  const [listKeyWord, setListKeyWord] = useState([])
  const [nameKeywordSearch, setNameKeyWordSearch] = useState('')
  const [currentIdKeyWord, setCurrentIdKeyword] = useState('')

  const history = useHistory();
  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])

  useEffect(() => {
    handleGetListKeyWord()
  }, [nameKeywordSearch])

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

  const handleGetListKeyWord = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await getListKeyWord({
      accessToken,
      nameKeyword: nameKeywordSearch
    })
    // console.log(res);

    if (res?.errCode === 0) {
      setListKeyWord(res.data)
    }
  }

  const handleAddKeyWord = async () => {
    if (!valueInput) {
      notify("br", 4, 'Vui lòng nhập keyword')
      return
    }
    else {
      let res = await createNewKeyword({
        nameKeyword: valueInput
      })
      if (res && res.errCode === 0) {
        setValueInput('')
        notify("br", 2, 'Đã thêm từ khóa tìm kiếm')
      }
      else {
        console.log(res);
        notify("br", 3, 'Có lỗi xảy ra!')
      }
    }
  }

  const handleOnkeyDown = (e) => {
    if (e.keyCode === 13)
      handleAddKeyWord()
  }

  const handeSetUpedit = (item) => {
    setValueInput(item.keyword)
    setCurrentIdKeyword(item.id)
  }

  const handleEditKeyWord = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await editKeywordSearch({
      accessToken,
      idKeyWord: currentIdKeyWord,
      nameKeyword: valueInput
    })
    if (res?.errCode === 0) {
      handleGetListKeyWord()
      setValueInput('')
      setCurrentIdKeyword('')
    }
  }

  const handleDeleteKeywordSearch = async (id) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }
    let res = await deleteKeyWordSearchAdmin({
      accessToken,
      idKeyWord: id
    })
    if (res?.errCode === 0) {
      handleGetListKeyWord()
    }

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
                  <Card.Title as="h4">Quản lý từ khóa tìm kiếm</Card.Title>
                  <p className="card-category">
                    Người theo hương hoa mây mù giăng lối
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Col md="6">
                    <div className="form-group">
                      <label>Tên từ khóa</label>
                      <input
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                        onKeyDown={handleOnkeyDown}
                        className="form-control" />

                    </div>
                  </Col>
                  <Col md="12">
                    {
                      currentIdKeyWord ?
                        <>
                          <button className="btn btn-warning"
                            onClick={handleEditKeyWord}
                          >Sửa</button>
                          <button className="btn btn-primary"
                            onClick={() => { setCurrentIdKeyword(''); setValueInput('') }}
                          >Hủy</button>



                        </> :
                        <button className="btn btn-primary"
                          onClick={handleAddKeyWord}

                        >Thêm</button>
                    }
                  </Col>
                </Card.Body>
              </Card>
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  {/* <Card.Title as="h4">Quản lý từ khóa tìm kiếm</Card.Title>
                  <p className="card-category">
                    Người theo hương hoa mây mù giăng lối
                  </p> */}
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <input className="form-control" style={{ width: '200px', padding: '4px' }} placeholder="Nhập tên từ khóa"
                    onChange={(e) => setNameKeyWordSearch(e.target.value)}
                  />
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">Tên từ khóa</th>
                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listKeyWord?.map(item => (
                          <tr key={item.id}>
                            <td>
                              {item.keyword}
                            </td>
                            <td>
                              <button className="btn btn-warning"
                                style={{ fontSize: '12px', padding: '4px', width: '100%' }}
                                onClick={() => handeSetUpedit(item)}
                              >
                                Sửa
                              </button>
                              <button className="btn btn-danger"
                                style={{ fontSize: '12px', padding: '4px', width: '100%' }}
                                onClick={() => handleDeleteKeywordSearch(item.id)}
                              >
                                Xóa
                              </button>
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

export default ListPurchase;
