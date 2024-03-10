import Link from "next/link";
import React from "react";
import logoImg from "@/assets/logo.png";
import styles from "./main-header.module.css";
import Image from "next/image";
import MainHeaderBackground from "./main-header-background";
import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          <Image src={logoImg} alt="A plate with food on it" priority />
          NextLevel Food
        </Link>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink href={"/meals"}> Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href={"/community"}>Foodies community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
