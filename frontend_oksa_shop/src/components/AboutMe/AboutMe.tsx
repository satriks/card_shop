import React from "react";
import aboutMeImg from "../../assets/aboutMe/me.png";
import line from "../../assets/aboutMe/line.png";
import "./AboutMe.scss";

type Props = {};

export default function AboutMe({}: Props) {
  return (
    <div className="about_wrapper">
      <img className="about_line" src={line} alt="" />
      <div className="about">
        <div className="about_text">
          <h2>Обо мне</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel
            neque at felis posuere viverra. Nulla facilisi. Sed vel justo vel mi
            dapibus tempus. Donec facilisis felis at justo lobortis, non
            porttitor odio vestibulum. Nullam vel lacus at nunc rutrum
            scelerisque. Nulla facilisi. Donec nec odio vel justo fringilla
            facilisis. Sed non velit et ligula sagittis commodo vel vel justo.
            Quisque non lacus at velit fermentum interdum. Sed vel neque at
            felis posuere viverra.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel
            neque at felis posuere viverra. Nulla facilisi. Sed vel justo vel mi
            dapibus tempus. Donec facilisis felis at justo lobortis, non
            porttitor odio vestibulum. Nullam vel lacus at nunc rutrum
            scelerisque. Nulla facilisi. Donec nec odio vel justo fringilla
            facilisis. Sed non velit et ligula sagittis commodo vel vel justo.
            Quisque non lacus at velit fermentum interdum. Sed vel neque at
            felis posuere viverra.
          </p>
        </div>
        <div>
          <img className="about_img" src={aboutMeImg} alt="" />
        </div>
      </div>
      <img className="about_line" src={line} alt="" />
    </div>
  );
}
