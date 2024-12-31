"use client";
import React from "react";
import "../globals.css";

const Layout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
