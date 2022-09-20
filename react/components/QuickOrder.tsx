import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql";
import GET_PRODUCT from "../graphql/getProductBySku.graphql";

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const [addToCart] = useMutation(UPDATE_CART);
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT);

  const handleChange = (event: any) => setInputText(event.target.value);

  const searchProduct = (event: any) => {
    event.preventDefault();
    if (!inputText) alert("Oiga, ingrese algo");
    else {
      console.log("Al final estamos buscando:", inputText);
      setSearch(inputText);
      addProductToCart();
    };
  };

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    });
  };

  useEffect(() => {
    console.log("El resultado de mi producto es", product, search)
    if (product) {
      let skuId = parseInt(inputText);
      addToCart({
        variables: {
          salesChannel: "1",
          items: [{
            id: skuId,
            quantity: 1,
            seller: "1"
          }]
        }
      })
      .then(() => {
        window.location.href = "/"
      })
    };
  }, [product, search]);

  return (
    <div>
      <h2>Compra rápida de VTEX IO</h2>
      <form onSubmit={searchProduct}>
        <label htmlFor="sku">Ingresa el número de SKU</label>
        <input id="sku" type="text" onChange={handleChange} />
        <input type="submit" value="Añadir el carrito" />
      </form>
    </div>
  );
};

export default QuickOrder;
