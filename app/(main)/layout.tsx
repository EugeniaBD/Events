"use client";
import Header from "@/features/header";
import React from "react";
import "../globals.css";

const Layout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="p-4 bg-slate-50 h-full">{children}</main>
    </>
  );
};

export default Layout;
