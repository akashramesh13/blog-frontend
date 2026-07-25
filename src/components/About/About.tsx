import React, { useEffect } from "react";
import "./About.scss";

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <div className="about-page__header">
        <h1>About Pixel Pursuit</h1>
      </div>
      
      <div className="about-page__content">
        <p className="drop-cap">
          We live in an era defined by rapid technological acceleration, where the lines between the digital and physical worlds blur more with each passing day. Pixel Pursuit is a magazine dedicated to exploring this very intersection—where software engineering meets philosophy, and where design informs human psychology.
        </p>

        <h2>Our Mission</h2>
        <p>
          Founded on the belief that code is as much a medium for human expression as art or literature, we strive to elevate the discourse surrounding technology. We believe that understanding the tools we build is essential to understanding ourselves. Our essays delve into the profound questions underlying everyday software, challenging the notion that technology is purely functional.
        </p>

        <p>
          Through rigorous analysis, deep-dive technical explorations, and thoughtful cultural commentary, Pixel Pursuit aims to equip readers with the context necessary to navigate the modern digital landscape. We want to empower developers, designers, and thinkers to build not just with efficiency, but with empathy and profound intentionality.
        </p>

        <h2>The Author</h2>
        <p>
          Akash Ramesh is a software engineer and writer who is deeply fascinated by the architecture of the web and the systems that power human connection. With a background in building complex, user-centric applications, he seeks to bridge the gap between abstract computer science concepts and tangible, everyday human experiences.
        </p>

        <div className="about-page__footer">
          <p>
            Connect across the web:
          </p>
          <div className="about-page__links">
            <a href="https://akashramesh.in" target="_blank" rel="noopener noreferrer">Portfolio</a>
            <a href="https://github.com/akashramesh13" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
