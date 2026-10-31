import React from "react";
import "./LandingPage.css";
import titLogo from "./assets/tit-logo.png";

export default function LandingPage({ onLogin, onSignup }) {
  return (
    <div className="landing-page">
    <nav>
      <a className="brand" href="#" aria-label="Learn Code home">
        <span className="brand-mark" aria-hidden="true">
          &lt;/&gt;
        </span>
        <span className="brand-name">Learn Code</span>
      </a>
      <div className="navlinks">
        <a href="#solution">
          What you get
        </a>
        <a href="#journey">
          How it works
        </a>
        <a href="#ai">
          AI Mentor
        </a>
        <a href="#about">
          About
        </a>
      </div>
      <div className="navright">
        <button className="login" type="button" onClick={onLogin}>
          Log in
        </button>
        <button className="btn" type="button" onClick={onSignup}>
          Get Started ↗
        </button>
      </div>
    </nav>
    <main>
      <section className="hero" id="home">
        <div>
          <div className="pill">
            <i className="pulse"></i>
             ONE PLATFORM. YOUR COMPLETE PREPARATION.
          </div>
          <h1>
            Learn how to
            <br />
            code. 
            <span className="purple">
              Grow your
              <br />
              skills.
            </span>
          </h1>
          <p className="lead">
            Learn programming, practise coding, ask your AI Mentor for help, and prepare for placements — all in one place.
          </p>
          <div className="actions">
            <button className="btn" type="button" onClick={onSignup}>
              Start your learning journey ↗
            </button>
            <a className="textlink" href="#solution">
              See what you can do 
              <b>
                →
              </b>
            </a>
          </div>
          <div className="hero-note">
            <span className="check">
              ✓
            </span>
             Start as a beginner. Build skills for your future.
          </div>
        </div>
        <div className="journey-visual" aria-label="Learn Code learning journey">
          <div className="journey-glow"></div>
          <div className="journey-heading">
            <span className="journey-star" aria-label="Learn Code logo">
              {"</>"}
            </span>
            <div>
              <strong>
                Your journey, made simple
              </strong>
              <small>
                One step at a time
              </small>
            </div>
          </div>
          <div className="journey-line"></div>
          <article className="journey-card jc-one">
            <div className="journey-icon purple-icon">
              {"</>"}
            </div>
            <div className="journey-copy">
              <span className="journey-step">
                STEP 01
              </span>
              <strong>
                Learn the basics
              </strong>
              <small>
                Start with simple lessons
              </small>
            </div>
            <span className="journey-check">
              ✓
            </span>
          </article>
          <article className="journey-card jc-two">
            <div className="journey-icon blue-icon">
              ⌨
            </div>
            <div className="journey-copy">
              <span className="journey-step">
                STEP 02
              </span>
              <strong>
                Practice coding
              </strong>
              <small>
                Solve questions and build skills
              </small>
            </div>
            <span className="journey-check">
              ✓
            </span>
          </article>
          <article className="journey-card jc-three">
            <div className="journey-icon pink-icon">
              ✦
            </div>
            <div className="journey-copy">
              <span className="journey-step">
                STEP 03
              </span>
              <strong>
                Get help from AI
              </strong>
              <small>
                Ask questions and learn from mistakes
              </small>
            </div>
            <span className="journey-check">
              ✦
            </span>
          </article>
          <article className="journey-card jc-four">
            <div className="journey-icon green-icon">
              ↗
            </div>
            <div className="journey-copy">
              <span className="journey-step">
                STEP 04
              </span>
              <strong>
                Get ready for jobs
              </strong>
              <small>
                Prepare for tests and interviews
              </small>
            </div>
            <span className="journey-check">
              →
            </span>
          </article>
          <div className="journey-note">
            <span>
              ✧
            </span>
             Learn at your own pace. Keep getting better.
          </div>
        </div>
      </section>
      <section className="problem">
        <div className="section center">
          <div className="eyebrow">
            THE STUDENT CHALLENGE
          </div>
          <h2>
            Getting ready for placements can be hard.
          </h2>
          <p className="section-intro">
            Study notes, coding practice and interview questions are often on different websites. It is not always easy to know what to learn next or how you are improving.
          </p>
          <div className="problem-grid">
            <article className="problem-card">
              <div className="num">
                01 / TOO MANY PLACES
              </div>
              <h3>
                Everything is in different places
              </h3>
              <p>
                Notes, coding questions and interview practice are spread across many websites.
              </p>
            </article>
            <article className="problem-card">
              <div className="num">
                02 / NO CLEAR DIRECTION
              </div>
              <h3>
                Not sure what to learn next?
              </h3>
              <p>
                Without a clear plan, it is easy to feel lost or skip important topics.
              </p>
            </article>
            <article className="problem-card">
              <div className="num">
                03 / LITTLE PERSONAL GUIDANCE
              </div>
              <h3>
                Practising but still feeling stuck?
              </h3>
              <p>
                Sometimes you need a hint, a simple explanation or help to understand your mistakes.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="solution" id="solution">
        <div className="solution-head">
          <div className="eyebrow">
            YOUR COMPLETE STUDENT TOOLKIT
          </div>
          <h2>
            Learn, practise and prepare — in one place.
          </h2>
          <p className="section-intro">
            Study a topic, try questions, get help when you need it and see how far you have come.
          </p>
        </div>
        <div className="solution-grid">
          <article className="solution-card">
            <div className="ico">
              {"</>"}
            </div>
            <h3>
              Learn programming step by step
            </h3>
            <p>
              Start with the basics and learn each topic in a simple way.
            </p>
          </article>
          <article className="solution-card">
            <div className="ico">
              ⌨
            </div>
            <h3>
              Practise coding & DSA
            </h3>
            <p>
              Solve coding questions, run your code and get better at problem-solving.
            </p>
          </article>
          <article className="solution-card" id="ai">
            <div className="ico">
              ✦
            </div>
            <h3>
              Get help from your AI Mentor
            </h3>
            <p>
              Ask questions, get hints and understand your mistakes with help from AI.
            </p>
          </article>
          <article className="solution-card">
            <div className="ico">
              ▦
            </div>
            <h3>
              Master core CS subjects
            </h3>
            <p>
              Learn DBMS, Operating Systems, Computer Networks, OOP and other key subjects.
            </p>
          </article>
          <article className="solution-card">
            <div className="ico">
              ◷
            </div>
            <h3>
              Improve aptitude & reasoning
            </h3>
            <p>
              Practise maths and reasoning questions for company tests.
            </p>
          </article>
          <article className="solution-card">
            <div className="ico">
              ↗
            </div>
            <h3>
              Get interview and placement ready
            </h3>
            <p>
              Revise technical topics and practise questions asked in job interviews.
            </p>
          </article>
        </div>
      </section>
      <section className="path" id="journey">
        <div className="path-inner">
          <div>
            <div className="eyebrow" style={{color: "#aaa7ff"}}>
              A CLEARER WAY FORWARD
            </div>
            <h2>
              Know what to learn.
              <br />
              Know your next step.
            </h2>
            <p>
              Follow four simple steps: learn a topic, practise it, get help and track your progress.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <b>
                STEP 01
              </b>
              <strong>
                Learn
              </strong>
              <small>
                Learn the topic in simple steps.
              </small>
            </div>
            <div className="step">
              <b>
                STEP 02
              </b>
              <strong>
                Practise
              </strong>
              <small>
                Try questions and use what you learned.
              </small>
            </div>
            <div className="step">
              <b>
                STEP 03
              </b>
              <strong>
                Improve
              </strong>
              <small>
                Get hints and learn from mistakes.
              </small>
            </div>
            <div className="step">
              <b>
                STEP 04
              </b>
              <strong>
                Track
              </strong>
              <small>
                Check your progress and keep going.
              </small>
            </div>
          </div>
        </div>
      </section>
      <section className="cta" id="start">
        <div className="cta-box">
          <div>
            <h2>
              Take the first step towards your goal.
            </h2>
            <p>
              Learn something new today. Keep practising and get ready for what comes next.
            </p>
          </div>
          <button className="btn" type="button" onClick={onSignup}>
            Start Learning  ↗
          </button>
        </div>
      </section>
      <section className="about-college" id="about">
        <div className="about-inner">
          <div className="about-label">
            ABOUT THIS PROJECT
          </div>
          <h2>
            Built as a student-focused learning platform.
          </h2>
          <p>
            Learn Code is designed to help students learn programming, practise problem-solving, understand core subjects and prepare for placement opportunities — all in one place.
          </p>
          <div className="college-card">
            <div className="college-emblem">
             <img
  src={titLogo}
  alt="Technocrats Institute logo"
/>
            </div>
            <div className="college-copy">
              <span>
                COLLEGE
              </span>
              <h3>
                Technocrats Institute of Technology & Science
              </h3>
              <p>
                Bhopal, Madhya Pradesh, India
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer>
      © 2026 Learn Code · Learn. Practise. Grow.
    </footer>
    </div>
  );
}
