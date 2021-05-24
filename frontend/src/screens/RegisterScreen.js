import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../actions/userActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Axios from "axios";
import toast, { Toaster } from "../../node_modules/react-hot-toast/dist/index";

export default function RegisterScreen(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorUpload, setErrorUpload] = useState("");
  const [image, setImage] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const redirect = props.location.search
    ? props.location.search.split("=")[1]
    : "/";

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if (password.length < 6) {
      toast.error("mật khẩu ít nhất 6 kí tự");
      return;
    }
    if(!password.match(upperCaseLetters))
    {
      toast.error("mật khẩu cần chứa ký tự viết hoa");
      return;
    }
    if(!password.match(lowerCaseLetters))
    {
      toast.error("mật khẩu cần chứa ký tự viết thường");
      return;
    }
    if(!password.match(numbers))
    {
      toast.error("mật khẩu cần chứa ký tự là chữ số");
      return;
    }
   
    if (password)
      if (password !== confirmPassword) {
        toast.error("mật khẩu nhập lại không khớp");
        return;
      } else {
        dispatch(register(name, email, password, image, userName));
      }
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads", bodyFormData);
      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Tạo tài khoản</h1>
        </div>
        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <div>
          <label htmlFor="name">Họ tên</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="userName">Tên Người bán</label>
          <input
            type="text"
            id="userName"
            placeholder="nhập tên đăng nhập"
            required
            onChange={(e) => setUserName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">địa chỉ Email</label>
          <input
            type="email"
            id="email"
            placeholder="nhập email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="nhập lại mật khẩu"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="image">hình ảnh</label>
          <input
            id="image"
            type="text"
            placeholder="Link ảnh"
            value={image}
            disabled={true}
            onChange={(e) => setImage(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="imageFile">File- ảnh</label>
          <input
            type="file"
            id="imageFile"
            label="Choose Image"
            onChange={uploadFileHandler}
          ></input>
          {loadingUpload && <LoadingBox></LoadingBox>}
          {errorUpload && (
            <MessageBox variant="danger">{errorUpload}</MessageBox>
          )}
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Đăng ký
          </button>
        </div>
        <div>
          <label />
          <div>
            Đã có tài khoản?{" "}
            <Link to={`/signin?redirect=${redirect}`}>Đăng nhập</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
