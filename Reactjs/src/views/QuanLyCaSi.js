import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Table } from "react-bootstrap";

import {
  ThemCaSiService,
  layDsCaSiService,
  suaCaSiService,
  xoaCaSiService,
  handleCheckLoginAdmin,
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from "react-loading-overlay-ts";
import { Button, Modal, Input, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { TextArea } = Input;

function QuanLyCaSi() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [tenCaSi, SetTenCaSi] = useState("");
  const [moTa, SetMoTa] = useState("");
  const [dsCaSi, setDsCaSi] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [fileAnh, setFileAnh] = useState("");
  const [urlAnh, setUrlAnh] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    layDsCaSi();
  }, []);

  useEffect(() => {
    handleCheckLoginAdmin("2");
  }, []);

  const layDsCaSi = async () => {
    let res = await layDsCaSiService();
    console.log(res);
    if (res?.errCode === 0) {
      setDsCaSi(res.data);
    } else {
      notify("br", 3, res.errMessage);
    }
  };

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
          <div>{content}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const themCaSi = async () => {
    if (!tenCaSi || !moTa || !fileAnh || loading) {
      return;
    }
    let data = {
      tenCaSi,
      moTa,
    };
    setLoading(true);
    let form = new FormData();
    form.append("file", fileAnh);
    let res = await ThemCaSiService(form, data);
    console.log(res);
    if (res?.errCode === 0) {
      let newArr = [...dsCaSi];
      newArr.push(res.data);
      setDsCaSi(newArr);
      setOpenModal(false);
      SetTenCaSi("");
      SetMoTa("");
      setFileAnh("");
      setUrlAnh("");
    } else {
      notify("br", 3, res.errMessage);
      setOpenModal(false);
    }
    setLoading(false);
  };

  const handleXoaCaSi = async (id) => {
    notify("br", 4, "Tình năng xóa đã tạm khóa!")
    return;
    let res = await xoaCaSiService({ id });
    if (res?.errCode === 0) {
      let newArr = [...dsCaSi];
      newArr = newArr.filter((item) => item.id !== id);
      setDsCaSi(newArr);
    } else {
      notify("br", 3, res.errMessage);
    }
  };

  const handleSuaCaSi = async () => {
    if (!idEdit) {
      return;
    }

    let res = await suaCaSiService({
      id: idEdit,
      tenCaSi,
      moTa,
    });

    console.log(res);

    if (res?.errCode === 0) {
      let newArr = [...dsCaSi];
      newArr = newArr.map((item) => {
        if (item.id === idEdit) {
          return res.data;
        }
        return item;
      });
      setDsCaSi(newArr);
    } else {
      notify("br", 3, res.errMessage);
    }
    SetTenCaSi("");
    SetMoTa("");
    setOpenModal2(false);
    setIdEdit("");
  };

  const onUploadImage = async (files) => {
    let file = files[0];
    if (!file || !file.type.includes("image")) {
      return;
    }
    console.log(file);
    setFileAnh(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      setUrlAnh(reader.result);
    });
  };

  return (
    <>
      <LoadingOverlay active={isShowLoading} spinner text="Đang xử lý...">
        <Container fluid>
          <NotificationAlert ref={notificationAlertRef} />
          <Row>
            {/* List keyword */}
            <Col md="12">
              <Card
                className="strpied-tabled-with-hover"
                style={{ padding: "10px" }}
              >
                <Card.Header>
                  <b>
                    Danh Sách Ca Sĩ
                  </b>
                  <p className="card-category">
                    Phải biết nhận thua để có cơ hội chiến thắng ở lần sau
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <input
                      className="form-control"
                      style={{ width: "200px", padding: "4px" }}
                      placeholder="Tìm kiếm ..."
                      value={valueSearch}
                      onChange={(e) => setValueSearch(e.target.value)}
                    />
                    <Button
                      type="primary"
                      onClick={() => {
                        setOpenModal(true);
                      }}
                    >
                      New
                    </Button>
                  </div>
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-1">STT</th>
                        <th className="border-1">Tên ca sĩ</th>
                        <th className="border-1">Ảnh</th>
                        <th className="border-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {dsCaSi?.map((item, index) => {
                        if (item.tenCaSi.toLowerCase().includes(valueSearch))
                          return (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.tenCaSi}</td>
                              <td>
                                <img
                                  src={item.anh}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                  }}
                                />
                              </td>
                              <td>
                                <i
                                  className="fa-solid fa-pencil"
                                  style={{
                                    color: "#e67914",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setOpenModal2(true);
                                    setIdEdit(item.id);
                                    SetTenCaSi(item.tenCaSi);
                                    SetMoTa(item.moTa);
                                  }}
                                ></i>
                                <i
                                  className="fa-solid fa-trash-can"
                                  onClick={() => handleXoaCaSi(item.id)}
                                  style={{
                                    color: "red",
                                    marginLeft: "14px",
                                    cursor: "pointer",
                                  }}
                                ></i>
                              </td>
                            </tr>
                          );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </LoadingOverlay>

      <Modal
        title="Thêm ca sĩ"
        style={{
          top: 20,
        }}
        open={openModal}
        onOk={() => themCaSi()}
        onCancel={() => setOpenModal(false)}
      >
        <Spin spinning={loading}>
          <Input
            size="large"
            placeholder="Tên ca sĩ"
            prefix={<UserOutlined />}
            value={tenCaSi}
            onChange={(e) => SetTenCaSi(e.target.value)}
          />
          <label
            style={{
              width: "100px",
              height: "100px",
              border: "1px solid #000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {!urlAnh && (
              <>
                <i className="fa-solid fa-plus"></i>
                <div>Ảnh bìa</div>
              </>
            )}
            {urlAnh && (
              <img
                src={urlAnh}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                }}
              />
            )}

            <input
              type="file"
              hidden
              onChange={(e) => onUploadImage(e.target.files)}
            />
          </label>
          <TextArea
            rows={4}
            style={{ marginTop: "20px" }}
            value={moTa}
            onChange={(e) => SetMoTa(e.target.value)}
          />
        </Spin>
      </Modal>

      <Modal
        title="Sửa ca sĩ"
        style={{
          top: 20,
        }}
        open={openModal2}
        onOk={() => handleSuaCaSi()}
        onCancel={() => {
          setOpenModal2(false);
          setIdEdit("");
          SetTenCaSi("");
          SetMoTa("");
        }}
      >
        <Spin spinning={loading}>
          <Input
            size="large"
            placeholder="Tên ca sĩ"
            prefix={<UserOutlined />}
            value={tenCaSi}
            onChange={(e) => SetTenCaSi(e.target.value)}
          />
          <TextArea
            rows={4}
            style={{ marginTop: "20px" }}
            value={moTa}
            onChange={(e) => SetMoTa(e.target.value)}
          />
        </Spin>
      </Modal>
    </>
  );
}

export default QuanLyCaSi;
