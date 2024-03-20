import React, { useEffect, useState } from "react";
import moment from "moment";
import { CheckAdminLogin } from '../services/adminService'
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
  getListBlogAdminByPage,
  deleteBlogVideoAdmin,
  getListReportBlogAdmin, skipReportBlogAdmin, handleCheckLoginAdmin

} from "services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';


function BlogManager() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [listBlog, setListBlog] = useState([])
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
    getListBlog()
  }, [currentPage])

  useEffect(() => {
    getListReport()
  }, [currentPage2])

  let getListBlog = async () => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListBlogAdminByPage({
      accessToken,
      page: currentPage
    })

    if (res?.errCode === 0) {
      setListBlog(res.data)
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

    let res = await getListReportBlogAdmin({
      accessToken,
      page: currentPage2
    })

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

  const handleDeleteBlogAdmin = async (idBlog) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let note = prompt('Nhập lý do xóa bài viết này')
    if (!note) return

    let res = await deleteBlogVideoAdmin({
      accessToken,
      idBlog,
      note
    })

    if (res?.errCode === 0) {
      getListBlog()
      getListReport()
      notify('br', 2, 'Đã xóa bài viết')
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }


  const handleSkipReport = async (idReportBlog) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await skipReportBlogAdmin({
      accessToken,
      idReportBlog
    })

    if (res?.errCode === 0) {
      getListReport()
      notify('br', 2, 'success')
    }
    else {
      notify('br', 3, res?.errMessage || 'Error')
    }
  }


  const handleChangeInputId = async (e) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListBlogAdminByPage({
      accessToken,
      page: currentPage2,
      idSearch: e.target.value
    })

    if (res?.errCode === 0) {
      setListBlog(res.data)
      let countTam = (res.count - 1) / 10 + 1
      setCountPage(countTam)
    }
  }

  const handleChangeInputContent = async (e) => {
    let accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      location.reload()
      return
    }

    let res = await getListBlogAdminByPage({
      accessToken,
      page: currentPage2,
      contentSearch: e.target.value
    })

    if (res?.errCode === 0) {
      setListBlog(res.data)
      let countTam = (res.count - 1) / 10 + 1
      setCountPage(countTam)
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
                  <Card.Title as="h4">Quản lý bài viết</Card.Title>
                  <p className="card-category">
                    Quản lý các bài viết mới ở đây.
                  </p>
                </Card.Header>

                <Row>
                  <Col md='6'>
                    <input className="form-control" placeholder="ID bài viết"
                      onChange={(e) => handleChangeInputId(e)}
                    />
                  </Col>
                  <Col md='6'>
                    <input className="form-control" placeholder="Nội dung bài viết"
                      onChange={(e) => handleChangeInputContent(e)}
                    />
                  </Col>
                </Row>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">ID</th>
                        <th className="border-1">Tác giả</th>
                        <th>SL Xem</th>
                        <th>SL Thích</th>
                        <th>SL bình luận</th>
                        <th>SL Chia sẻ</th>
                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listBlog?.map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                              <a href={`${process.env.REACT_APP_LINK_FONTEND}/blogs/blog-user/${item.User?.id}`} target="_blank">
                                {item.User?.firstName}
                              </a>
                            </td>
                            <td>{item.viewBlog}</td>
                            <td>{item.amountLike}</td>
                            <td>{item.amountComment}</td>
                            <td>{item.amountShare}</td>
                            <td>
                              <button className="btn btn-primary">
                                <a href={`${process.env.REACT_APP_LINK_FONTEND}/blogs/detail-blog/${item.id}`} target="_blank">
                                  Xem
                                </a>
                              </button>
                              <button className="btn btn-danger"
                                onClick={() => handleDeleteBlogAdmin(item.id)}
                              >
                                Xóa
                              </button>
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
                        <th className="border-1">Id blog</th>
                        <th className="border-1">Người báo cáo</th>
                        <th>Nội dung</th>

                        <th className="border-1">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listReport?.map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.blog?.id}</td>
                            <td>{item.User?.firstName}</td>
                            <td>{item.content}</td>
                            <td>
                              <button className="btn btn-primary">
                                <a href={`${process.env.REACT_APP_LINK_FONTEND}/blogs/detail-blog/${item.blog?.id}`} target="_blank">
                                  Xem
                                </a>
                              </button>
                              <button className="btn btn-warning"
                                onClick={() => handleSkipReport(item.id)}
                              >
                                Bỏ qua
                              </button>
                              <button className="btn btn-danger"
                                onClick={() => handleDeleteBlogAdmin(item.blog?.id)}
                              >
                                Xóa bài viết
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

export default BlogManager;
