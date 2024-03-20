import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";

import { CheckAdminLogin, handleCheckLoginAdmin, checkStatusServer } from '../services/adminService'
import { useHistory } from 'react-router-dom';
import {
  createNewKeyword, getListKeyWord, editKeywordSearch, deleteKeyWordSearchAdmin
} from "../services/adminService";
import NotificationAlert from "react-notification-alert";

import LoadingOverlay from 'react-loading-overlay-ts';


const listServer = [
  {
    name: 'Server Music App',
    link: 'https://techstoretvtserver2.onrender.com',
    status: 0,
    loading: false
  },
  {
    name: 'Server Chatbot',
    link: 'https://demo-chatbot-9rjf.onrender.com',
    status: 0,
    loading: false
  }
]


function ListPurchase() {
  const notificationAlertRef = React.useRef(null);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [servers, setServers] = useState(listServer)



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

  const handleStartServer = async (item, index) => {
    console.log('vao');
    if (item.loading) return
    let res = await checkStatusServer(item.link)
    let newArr = [...servers]
    newArr[index].loading = true
    setServers(newArr)
    console.log('loading', servers);
    if (res) {
      newArr[index].status = 1
      newArr[index].loading = false
      setServers(newArr)
    }
    else {
      newArr[index].status = 0
      newArr[index].loading = false
      setServers(newArr)
    }

    setInterval(() => {
      handleStartServer(item, index)
    }, 60000 * 5);
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
                  <Card.Title as="h4">Quản lý Server</Card.Title>
                  <p className="card-category">
                    Người theo hương hoa mây mù giăng lối
                  </p>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Col md="6">
                    {
                      servers?.map((item, index) => {
                        return (
                          <div key={index} style={{ display: 'flex', gap: '20px' }}>
                            <div>{item.name}:</div>
                            <button onClick={() => handleStartServer(item, index)}>
                              {
                                item.loading ? 'Loading...' : 'Start'
                              }
                            </button>
                            <div>Status: {item.status === 1 ? 'Running' : 'Stop'}</div>
                          </div>
                        )
                      })
                    }
                  </Col>

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
