import React from "react";
import Year from "../components/Year";
import HomeBanner from "../components/HomeBanner";
function Home() {
  return (
    <>
      <div className="home">
        <HomeBanner />

        <Year name="الصف الأول الثانوى" Year="1" />
        <Year name="الصف الثانى الثانوى" Year="2" />
        <Year name="الصف الثالث الثانوى" Year="3" />
      </div>
    </>
  );
}

export default Home;
