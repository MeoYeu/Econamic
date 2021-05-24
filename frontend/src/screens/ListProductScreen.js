import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { Link ,useParams} from "react-router-dom";
import Rating from "../components/Rating";

function ListProductScreen(props) {
    const  dispatch = useDispatch();
    
  const { pageNumber = 1 } = useParams();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products,pages,page,count } = productList;
  const sellerMode = props.match.path.indexOf('/seller') >= 0;
  useEffect(() => {
    
    dispatch(
      listProducts({ seller: sellerMode , pageNumber })
    );
  }, [
    
    dispatch,
    props.history,
    sellerMode,
   
    pageNumber,
  ]);
  
 return (
    
    <>
        {products && products.map((product) => (
           <div key={product._id} className="card">
           <Link to={`/product/${product._id}`}>
             <img className="medium" src={product.image} alt={product.name} />
           </Link>
           <div className="card-body">
             <Link to={`/product/${product._id}`}>
               <h2>{product.name}</h2>
             </Link>
             <Rating
               rating={product.rating}
               numReviews={product.numReviews}
             ></Rating>
             <div className="row">
               <div className="price">${product.price}</div>
               <div>
                 <Link to={`/seller/${product._id}`}>
                   {product.name}
                 </Link>
               </div>
             </div>
           </div>
         </div>
       
        )
        )}
        <div className='row center pagination'>
         {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={`/listproduct/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
         </div>
    </>
 );
}

export default ListProductScreen
