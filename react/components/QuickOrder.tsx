import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";                 // * (Dependencia) Consulta y mutación a una app Apollo
import UPDATE_CART from "../graphql/updateCart.graphql";                  // * (Mutation ~ GraphQL)
import GET_PRODUCT from "../graphql/getProductBySku.graphql";             // * (Query ~ GraphQL)
import styles from "./styles.css";

/**
 * Este componente sirve para hacer una consulta por SKU, y cuando esta se realice; agregarla al carrito y llevarnos al checkout a pagar
 * @returns formulario de consulta
 */

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");                           // Manejador del valor del input
  const [search, setSearch] = useState("");                                 // Manejador de lo que se va a buscar

  const [addToCart] = useMutation(UPDATE_CART);                             // Mutación GraphQL que me va a agregar el producto al carrito
  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT);    // Consulta GraphQL que me trae los datos del producto para enviarlo al carrito

  const handleChange = (event: any) => setInputText(event.target.value);    // Manejador del inputText

  const searchProduct = (event: any) => {                  // * Esta función lo que va a ser es que va a agregarme el producto al carrito
    event.preventDefault();
    if (!inputText) alert("Por favor ingresa un SKU");    // Si accionan el form y está vacío
    else setSearch(inputText); addProductToCart();        // Lógiva para que agregue el producto al carrito
  };

  const addProductToCart = () => {    // * Esta función me va a buscar la información que necesito por el SKU que se le pasa
    getProductData({
      variables: {
        sku: inputText
      }
    });
  };

  useEffect(() => {                               // * El useEffect se va a disparar si hay un producto que coincida con el SKU pasado y me va a redirigir
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
          window.location.href = "/checkout";
        });
    };
  }, [product, search]);

  return (
    <div className={`${styles.quick__order}`}>
      <h1 className={`${styles["quick__order--title"]}`}>Quick Order</h1>
      <form onSubmit={searchProduct} className={`${styles["quick__order--form"]}`}>
        <label htmlFor="sku" className={`${styles.form__label}`}>Ingresa el número de SKU deseado:</label>
        <input placeholder="SKU..." id="sku" type="text" onChange={handleChange} className={`${styles.form__input}`} />
        <input type="submit" value="Añadir el carrito" className={`${styles.form__submit}`} />
      </form>
    </div>
  );
};

export default QuickOrder;
