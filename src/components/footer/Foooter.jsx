import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import logo from "../../img/logo.png";
import vk from "../../img/VK.png";
import github from "../../img/github.png";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} className="text-center text-md-left">
            <a href="/"><img className="logo" src={logo} alt="MAP" /></a>
          </Col>
          <Col xs={12} md={6} className="text-center text-md-right">
            <div className="social d-flex justify-content-center justify-content-md-end">
              <a href="/"><img src={vk} alt="VK" className="social-icon" /></a>
              <a href="/"><img src={github} alt="Github" className="social-icon" /></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
