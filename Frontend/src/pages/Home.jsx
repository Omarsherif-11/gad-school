import React from "react";
import Year from "../components/Year";

function Home() {
  return (
    <>
      <div className="home">
        <Year name="الصف الأول الثانوى" Year="1" />
        <Year name="الصف الثانى الثانوى" Year="2" />
        <Year name="الصف الثالث الثانوى" Year="3" />
      </div>
    </>
  );
}

export default Home;
