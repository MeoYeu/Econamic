import React, { useEffect, useState,useRef, useContext } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { listTopSellers } from "../actions/userActions";
import { Link } from "react-router-dom";
import ListProductScreen from "./ListProductScreen";
import { NameConText } from "./GlobalState";
import { Modal, Button, Input, Row, Col } from "antd";
export default function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page, count } = productList;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const state = useContext(NameConText);
  const socket = state.socket;
  const setMessage = state.setMessage;
  const setListUser=state.setListUser;
  const listuser=state.listuser
  const message = state.message;
  const [chatItem, setChatItem] = useState();
  const [tinnhan, setTinnhan] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userTopSellersList = useSelector((state) => state.userTopSellersList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userTopSellersList;
  const ch = useRef("");

  useEffect(() => {
    dispatch(listProducts({}));
    dispatch(listTopSellers());
  }, [dispatch]);
  const [room, setRoom] = useState()
  useEffect(() => {
    if (socket && userInfo) {
      socket.emit("home", userInfo);
     
    }
  }, [socket, userInfo]);
  function onchangeInputChat(e) {
    setChatItem(e.target.value);
  }
  const onkeypresshandl = (e) => {
    if (e.key === "Enter") {
      setTinnhan([...tinnhan, e.target.value]);
      socket.emit("getmsg", { msg: e.target.value, userInfo }
      );
     
    }
  };
  socket &&
    socket.on("sendmsg", (data) => {
     
      let check=listuser.every((user) => user._id !== data.sender._id);
      
      if(!check)
      {
        
      }else{
        setListUser([...listuser,data.sender])
        setMessage(message+1);
        setTinnhan([...tinnhan,data.msg])
        
     
      }
    });

  return (
    <div>
      <h2>Top nhãn hàng</h2>

      {loadingSellers ? (
        <LoadingBox></LoadingBox>
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && (
            <MessageBox>Không có sản phẩm cần tìm</MessageBox>
          )}
          <Carousel
            showArrows={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay
          >
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller.seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2>Sản phẩm mới</h2>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && (
            <MessageBox>Kkhông có sản phẩm cần tìm</MessageBox>
          )}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>
        </>
      )}
      <Modal
          title="Nhắn tin"
          visible={isModalVisible}
          footer={null}
          
        >
          <div style={{ height: "200px", border: "1px solid" }}>
            {tinnhan &&
              tinnhan.map((item, index) => {
                return (
                  <div key={index}>
                    <li>{item}</li>
                  </div>
                );
              })}
          </div>
          <Row>
            <Col span={22}>
              <Input
                ref={ch}
                placeholder="tin nhắn"
                onChange={(e) => onchangeInputChat(e)}
                onKeyPress={onkeypresshandl}
              />
            </Col>
            <Col span={2}>
              <Button
                
                style={{ marginLeft: "6px" }}
                type="primary"
                shape="square"
                
              />
            </Col>
          </Row>
        </Modal>
    </div>
  );
}
