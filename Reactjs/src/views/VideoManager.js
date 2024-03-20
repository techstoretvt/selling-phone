import React, { useEffect, useState } from "react";
import moment from "moment";
import { CheckAdminLogin, handleCheckLoginAdmin } from '../services/adminService'
import { useHistory } from 'react-router-dom';
// react-bootstrap components
import PaginationExampleShorthand from "components/Commons/Pagination";
import {
  Card,
  Table,
  Container,
  Row,
  Col
} from "react-bootstrap";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import {
  getListVideoAdminbyPage, deleteShortVideoAdmin,
  getListReportVideoAdmin, skipReportVideoAdmin

} from "services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';


function VideoManager() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [listVideo, setListVideo] = useState([])
  const [listReport, setListReport] = useState([])
  const [countPage, setCountPage] = useState(1)
  const [countPage2, setCountPage2] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  const history = useHistory();

  useEffect(() => {
    handleCheckLoginAdmin('2')
  }, [])

  useEffect(() => {
    getListVideo()
  }, [currentPage])


  useEffect(() => {
    getListReport()
  }, [countPage2])

  const getListVideo = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListVideoAdminbyPage({
      page: currentPage,
      accessToken
    })
    if (res?.errCode === 0) {
      setListVideo(res.data)

      let countTam = (res.count - 1) / 10 + 1
      setCountPage(countTam)
    }


  }


  const getListReport = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListReportVideoAdmin({
      accessToken,
      page: currentPage2
    })
    // console.log(res);

    if (res?.errCode === 0) {
      setListReport(res.data)
      let countTam = (res.count - 1) / 10 + 1
      setCountPage2(countTam)
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


  const onchangePageProduct = (rest, value) => {
    setCurrentPage(value)
  }

  const onchangePageProduct2 = (rest, value) => {
    setCurrentPage2(value)
  }

  const handleChangeInputId = async (e) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListVideoAdminbyPage({
      page: currentPage,
      accessToken,
      idSearch: e.target.value
    })
    if (res?.errCode === 0) {
      setListVideo(res.data)

      let countTam = (res.count - 1) / 10 + 1
      setCountPage(countTam)
    }
  }

  const handleChangeInputTitle = async (e) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListVideoAdminbyPage({
      page: currentPage,
      accessToken,
      titleSearch: e.target.value
    })
    if (res?.errCode === 0) {
      setListVideo(res.data)

      let countTam = (res.count - 1) / 10 + 1
      setCountPage(countTam)
    }
  }

  const handleDeleteShortVideo = async (idShortVideo) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let note = prompt('Lý do xóa video này')
    if (!note) return

    let res = await deleteShortVideoAdmin({
      accessToken,
      idShortVideo,
      note
    })
    if (res?.errCode === 0) {
      notify('br', 2, 'Đã xóa video')
      getListVideo()
      getListReport()
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }

  const handleSkipReportVideo = async (idReportVideo) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await skipReportVideoAdmin({
      accessToken,
      idReportVideo
    })

    if (res?.errCode === 0) {
      getListReport()
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }

  return (
    <>
      <LoadingOverlay
        active={isShowLoading}
        spinner
        text='Đang xử lý...'
      >
        {/* List video */}
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Quản lý video</Card.Title>
                  <p className="card-category">
                    Quản lý các video mới ở đây.
                  </p>
                </Card.Header>
                <Row>
                  <Col md='6'>
                    <input className="form-control" placeholder="ID video"
                      onChange={(e) => handleChangeInputId(e)}
                    />
                  </Col>
                  <Col md='6'>
                    <input className="form-control" placeholder="Tiêu đề video"
                      onChange={(e) => handleChangeInputTitle(e)}
                    />
                  </Col>
                </Row>

                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">ID</th>
                        <th className="border-1">Tiêu đề</th>
                        <th>Ảnh bìa</th>
                        <th>SL Thích</th>
                        <th>SL bình luận</th>
                        <th>Tác giả</th>
                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listVideo?.map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.content}</td>
                            <td>
                              <a href={`${process.env.REACT_APP_LINK_FONTEND}/short-video/foryou?isv=${item.id}`} target="_blank">
                                <img src={item.urlImage} width={50} />
                              </a>
                            </td>
                            <td>{item.countLike}</td>
                            <td>{item.countComment}</td>
                            <td>
                              <a href={`${process.env.REACT_APP_LINK_FONTEND}/short-video/${item.User?.id}`} target="_blank">
                                {item.User?.firstName}
                              </a>
                            </td>
                            <td>
                              <button className="btn btn-primary">
                                <a href={`${process.env.REACT_APP_LINK_FONTEND}/short-video/foryou?isv=${item.id}`} target="_blank">
                                  Xem
                                </a>
                              </button>
                              <button className="btn btn-danger"
                                onClick={() => handleDeleteShortVideo(item.id)}
                              >Xóa video</button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                  <PaginationExampleShorthand
                    onChange={onchangePageProduct}
                    count={countPage}
                    page={currentPage}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>


        {/* List report */}
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            {/* List bill */}
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Đơn báo cáo video</Card.Title>
                  <p className="card-category">
                    Các đơn báo cáo về video từ người dùng
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">Id video</th>
                        <th className="border-1">Người báo cáo</th>
                        <th>Nội dung</th>
                        <th>Ảnh bìa video</th>
                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listReport?.map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.shortVideo.id}</td>
                            <td>{item.User.firstName + ' (' + item.User.id + ")"}</td>
                            <td>{item.content}</td>
                            <td>
                              <img src={item.shortVideo.urlImage} width={50} />
                            </td>
                            <td>
                              <button className="btn btn-primary">
                                <a href={`${process.env.REACT_APP_LINK_FONTEND}/short-video/foryou?isv=${item.shortVideo.id}`} target="_blank">
                                  Xem
                                </a>
                              </button>
                              <button className="btn btn-warning"
                                onClick={() => handleSkipReportVideo(item.id)}
                              >
                                Bỏ qua
                              </button>
                              <button className="btn btn-danger"
                                onClick={() => handleDeleteShortVideo(item.shortVideo.id)}
                              >
                                Xóa video
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </Table>
                  <PaginationExampleShorthand
                    onChange={onchangePageProduct2}
                    count={countPage2}
                    page={currentPage2}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>

    </>
  );
}

export default VideoManager;
