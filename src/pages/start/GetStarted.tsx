import { memo, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AOS from "aos";
import "../../../node_modules/aos/dist/aos.css";

import { CenterLogo } from "../../components/logo";
import { NavHamburger } from "../../components/Nav";
import FadeIn from "../../components/common/FadeIn";
import SocialMedia from "../../components/common/SocialMedia";
import Wrap from "../../components/common/Wrap";
import { ENABLE_KYC_ONBOARDING } from "../../config";

const TributeCube = memo(() => {
  return (
    <div
      className="cube"
      data-testid="cube"
      data-aos="fade-up"
      data-aos-delay="150"
    >
      <div className="cube__segment--top"></div>
      <div className="cube__segment--left"></div>
      <div className="cube__segment--right"></div>
    </div>
  );
});

function GetStartedHeader() {
  return (
    <div data-testid="get-started-header" className="landing__header">
      <SocialMedia />
      <NavHamburger />
    </div>
  );
}

export default function GetStarted() {
  /**
   * Their hooks
   */

  const history = useHistory();

  /**
   * Effects
   */

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 40,
      delay: 120,
      mirror: false,
      once: true,
    });
  }, []);

  /**
   * Render
   */

  return (
    <>
      <Wrap className="section-wrapper">
        <FadeIn>
          <h1 style={{ textAlign: "center", fontSize: "4rem" }}>Salon</h1>

          <div className="landing">
            <div className="landing__subtitle">
              The art world's DAO.
              <br />
              Collecting contemporary art together.
            </div>

            <div className="landing__button">
              <button
                className="button"
                onClick={() => {
                  history.push(ENABLE_KYC_ONBOARDING ? "/join" : "/join");
                }}
              >
                Join
              </button>
            </div>
          </div>
        </FadeIn>
      </Wrap>
    </>
  );
}
