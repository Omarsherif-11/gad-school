import React from "react";
import Year from "../components/Year";

function Home() {
  return (
    <>
      <div className="home">
        <Year name="الصف الدراسي الأول" Year="1" />
        <Year name="الصف الدراسي الثاني" Year="2" />
        <Year name="الصف الدراسي الثالث" Year="3" />
      </div>
    </>
  );
}

export default Home;
