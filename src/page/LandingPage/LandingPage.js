import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.product.loading);
  const productList = useSelector((state) => state.product.productList);
  const [query] = useSearchParams();
  const name = query.get("name");
  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);

  return (
    <Container>
       {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>No registered products!</h2>
            ) : (
              <h2>No products match '{name}'</h2>
            )}
          </div>
          )}
        </Row>
      )}
    </Container>
  );
};

export default LandingPage;
