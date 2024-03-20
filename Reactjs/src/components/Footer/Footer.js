
import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { nameWeb } from '../../utils/constant'

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>
            <ul className="footer-menu">
              <li>
                <a href={`${process.env.REACT_APP_LINK_FONTEND}`} >
                  Home
                </a>
              </li>
              <li>
                <a href={`${process.env.REACT_APP_LINK_FONTEND}`} >
                  Company
                </a>
              </li>
              <li>
                <a href={`${process.env.REACT_APP_LINK_FONTEND}/short-video/foryou`} >
                  Short video
                </a>
              </li>
              <li>
                <a href={`${process.env.REACT_APP_LINK_FONTEND}/blogs/all`} >
                  Blog
                </a>
              </li>
            </ul>
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
              <b>{nameWeb}</b>, made with
              love for a better web
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
