import React, { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createReview, detailsProduct } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productConstants";
import { Modal, Button, Input, Row, Col } from "antd";
import { SendOutlined } from "@ant-design/icons";
import io from "socket.io-client";
import toast, { Toaster } from "../../node_modules/react-hot-toast/dist/index";
import { NameConText } from "./GlobalState";
import axios from "axios";
import Message from "./Message";

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const { TextArea } = Input;
  const [chatItem, setChatItem] = useState();
  const ch = useRef("");
  const [sanpham, setsanpham] = useState();
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const state = useContext(NameConText);
  const socket = state.socket;
  const ScollRef = useRef();
  const beta = useRef(false);
  const [recei, setRecei] = useState();
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;
  const [newMessage, setNewMessage] = useState();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [state, setstate] = useState([]);
  const [message, setmessage] = useState([]);
  const [conversation, setConversation] = useState([]);
  const showModal = (e) => {
    e.preventDefault();
    if (!userInfo) {
      props.history.push("/signin");
    }
    socket.emit("createchat", { userInfo, productId });

    setIsModalVisible(true);
  };

  useEffect(() => {
    if (product != undefined) setsanpham(product);
  }, [product, productId]);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (successReviewCreate) {
      setRating("");
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);
  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (comment != "" && rating) {
      socket.emit("createComment", {
        productId,
        comment,
        rating,
        name: userInfo.name,
      });
      toast.success("review thành công");
    } else {
      toast.error("nhận xét và đánh giá");
      return;
    }
  };
  socket &&
    socket.on("sendmsg", (data) => {
     
      setmessage([...message, data.msg]);
      setRecei(data.sender);
    });

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (msg) => {
        setsanpham(msg);
      });
      return () => socket.off("sendCommentToClient");
    }
  }, [comment]);

  const sendHandle = (e) => {
    e.preventDefault();
  };
  socket &&
    socket.on("guinua",async (data) => {
     
     await setmessage([
        ...message,
        { text: data.msg, sender: data.userInfo, createdAt: Date.now() },
      ]);
    });
  const onkeypresshandl = async (e) => {
    if (e.key === "Enter") {
      socket.emit("getmsg", {
        msg: e.target.value,
        productId,
        userInfo,
      });

      setmessage([
        ...message,
        { text: e.target.value, sender: userInfo._id, createdAt: Date.now() },
      ]);
      const product = await axios.get(`/api/products/${productId}`);
    }
  };

  function onchangeInputChat(e) {
    setChatItem(e.target.value);
  }
  useEffect(() => {
    if (ScollRef && ScollRef.current)
      ScollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [message]);
 

  return (
    <div>
      <div>
        <Toaster />
      </div>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Link to="/">
            <h2>Trở về</h2>
          </Link>
          <div className="row top">
            <div className="col-2">
              <img
                className="large"
                src={sanpham && sanpham.image}
                alt={sanpham && sanpham.name}
              ></img>
            </div>
            <div className="col-1">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <Rating
                    src={product.image}
                    rating={sanpham && sanpham.rating}
                    numReviews={sanpham && sanpham.numReviews}
                  ></Rating>
                </li>
                <li>Pirce : ${product.price}</li>
                <li>
                  mô tả:
                  <p>{product.description}</p>
                </li>
              </ul>
            </div>

            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    Người bán:{}
                    <h2>
                      <Link to={`/seller/${sanpham && sanpham._id}`}>
                        {sanpham && sanpham.name}
                      </Link>
                    </h2>
                    <Rating
                      rating={sanpham && sanpham.rating}
                      numReviews={sanpham && sanpham.numReviews}
                    ></Rating>
                  </li>
                  <li>
                    <div className="row">
                      <div>Gía</div>
                      <div className="price">${product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Trạng thái</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">còn hàng</span>
                        ) : (
                          <span className="danger">Không sẵn</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product && product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div>số lượng</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[
                                ...Array(
                                  sanpham && sanpham.countInStock
                                ).keys(),
                              ].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </li>
                    </>
                  )}

                  <button onClick={addToCartHandler} className="primary block">
                    Thêm vào giỏ hàng
                  </button>
                </ul>
              </div>
            </div>
          </div>
          <div>
            {userInfo ? (
              <form className="form" onSubmit={submitHandler}>
                <div>
                  <h2>Viết đánh giá</h2>
                </div>
                <div>
                  <label htmlFor="rating">Chất lượng</label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 *</option>
                    <option value="2">2 *</option>
                    <option value="3">3 *</option>
                    <option value="4">4 *</option>
                    <option value="5">5 *</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label />
                  <button className="primary" type="submit">
                    Submit
                  </button>
                </div>
                <div>
                  {loadingReviewCreate && <LoadingBox></LoadingBox>}
                  {errorReviewCreate && (
                    <MessageBox variant="danger">
                      {errorReviewCreate}
                    </MessageBox>
                  )}
                </div>
              </form>
            ) : (
              <MessageBox>
                Hãy <Link to="/signin">Đăng nhập</Link> để viết đánh giá
              </MessageBox>
            )}
            <div>
            <Button type="primary" ref={beta} onClick={showModal}>
              Message
            </Button>
              </div>
            <Modal
              title="Nhắn tin"
              visible={isModalVisible}
              footer={null}
              onOk={handleOk}
              onCancel={handleCancel}
            
            >
                <div className="scroll" >
                {message &&
                  message.map((item, index) => (
                    <div key={index+1}>
                        <Message 
                          
                          message={item && item}
                          own={item?.sender === userInfo._id}
                          recei={recei}
                        ></Message>
                    </div>
                  ))}
                </div>
             
             
              
                <Row>
                  <Col span={22}>
                    <Input
                      ref={ch}
                      placeholder="tin nhắn"
                      onChange={(e) => onchangeInputChat(e)}
                      onKeyPress={onkeypresshandl}
                      value={newMessage}
                    />
                  </Col>
                  <Col span={2}>
                    <Button
                      onClick={sendHandle}
                      style={{ marginLeft: "6px" }}
                      type="primary"
                      shape="square"
                      icon={<SendOutlined />}
                    />
                  </Col>
                </Row>
              
            </Modal>
              
            
          </div>
          <div>
            <h2 id="reviews">Reviews</h2>
            {sanpham && sanpham.reviews.length === 0 && (
              <MessageBox>không có lượt đánh giá</MessageBox>
            )}
            <ul>
              {sanpham &&
                sanpham.reviews.map((review) => (
                  <li key={review._id}>
                    <strong>{review.name}</strong>
                    <div>
                      <Rating rating={review.rating} caption=" "></Rating>
                    </div>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
              <li></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
