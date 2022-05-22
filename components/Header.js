import React from "react";
import propTypes from "prop-types";

export default function Header({ title }) {
  return <h1 className="title">{title}</h1>;
}

Header.propTypes = {
  title: propTypes.string,
};
