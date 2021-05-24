import React,{Fragment,useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Input, Button, Form, Table, Popconfirm, message, Modal, InputNumber, Card, Tooltip } from "antd";
import { dispatch } from '../../node_modules/react-hot-toast/dist/index';
import { fetchtinhthanh} from "../actions/tinhthanhaction";
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
function TinhThanh() {
  const dispatch=useDispatch();
  const tinhthanhs= useSelector((state) => state.tinhthanhReducer);
  const { loading, error, tentinh, page, pages,success } =tinhthanhs;
 
  
      useEffect(() => {
        dispatch(fetchtinhthanh({}))
  
      }, [dispatch])
     
      



    return (
        <div>
  {!loading && tentinh.length>0? (
       
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {tentinh.length === 0 && <MessageBox>Kkhông có tỉnh thành cần tìm</MessageBox>}
          <div className="row center">
            {tentinh?.map((item,index) => (

             <li>{item.tentinh}</li>

            ))}
            
          </div>
        </>
      )}
        </div>
    )
}

export default TinhThanh
