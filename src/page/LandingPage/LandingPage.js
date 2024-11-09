import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {loading, productList, totalPageNum} = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
    limit: query.get("limit") || 8,
  });


  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.name === ""){
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate(`?${query}`);

  }, [navigate, searchQuery]);

  useEffect(() => {
    setSearchQuery({
      name: query.get("name") || "",
      page: query.get("page") || 1,
      limit: query.get("limit") || 8,
    });
    dispatch(
       getProductList({
        name: query.get("name") || "",
        page: query.get("page") || 1,
        limit: query.get("limit") || 8,
       })
     );
  }, [query]);


  // 페이지 버튼 함수
  const handlePrevPage = () => {
    if(searchQuery.page <= 1){
      return;
    }
    setSearchQuery({...searchQuery, page: parseInt(searchQuery.page) - 1});
  };

  const handleNextPage = () => {
    if(searchQuery.page >= totalPageNum){
      return;
    }
    setSearchQuery({...searchQuery, page: parseInt(searchQuery.page) + 1});
  };
  

  return (
    <Container>
       {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
        {searchQuery.name && (
          <div className="mt-4 mb-3">
            <h5>
              "{searchQuery.name}"
              <span className="text-muted ms-2">
                (Total {productList.length} items)
              </span>
            </h5>
          </div>
        )}
        <Row>  
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {searchQuery.name === "" ? (
              <h2>No registered products!</h2>
            ) : (
              <h2>No products match '{searchQuery.name}'</h2>
            )}
          </div>
          )}
        </Row>
        <div className="d-flex justify-content-center align-items-center gap-4 my-5">
          <button 
            className="btn btn-outline-dark"
            onClick={handlePrevPage}
            disabled={searchQuery.page <= 1}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <span>Page {searchQuery.page} / {totalPageNum}</span>
          <button 
            className="btn btn-outline-dark"
            onClick={handleNextPage}
            disabled={searchQuery.page >= totalPageNum}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        </>
      )}
    </Container>
  );
};

export default LandingPage;
