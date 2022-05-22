import "@styles/globals.css";
import "antd/dist/antd.css";
import React from "react";
import propTypes from "prop-types";

function Application({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default Application;

Application.propTypes = {
  Component: propTypes.Component,
  pageProps: propTypes.number,
};
