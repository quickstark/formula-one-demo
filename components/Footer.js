import React from "react";
import styles from "@styles/Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        Made with{" "}
        <img src="/netliheart.svg" alt="Netlify Logo" className={styles.logo} />{" "}
        for you
      </footer>
    </>
  );
}
