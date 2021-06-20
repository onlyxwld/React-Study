import React from "react";
import classNames from "classnames";
import "./assets/scss/HomeSlider.scss";

type CitiesSliderProps = {
  slides: {
    title: string;
    description: string;
    img_path: string;
  }[];
  video: string;
};
type CitiesSliderState = {
  activeSlide: number;
  prevSlide: number;
  sliderReady: boolean;
};

class CitiesSlider extends React.Component<
  CitiesSliderProps,
  CitiesSliderState
> {
  IMAGE_PARTS = 10;

  changeTO: any;
  AUTOCHANGE_TIME = 6000;

  state: CitiesSliderState = {
    activeSlide: -1,
    prevSlide: -1,
    sliderReady: false,
  };

  componentWillUnmount() {
    window.clearTimeout(this.changeTO);
  }

  componentDidMount() {
    this.runAutochangeTO();
    setTimeout(() => {
      this.setState({ activeSlide: 0, sliderReady: true });
    }, 0);
  }

  runAutochangeTO() {
    this.changeTO = setTimeout(() => {
      this.changeSlides(1);
      this.runAutochangeTO();
    }, this.AUTOCHANGE_TIME);
  }

  changeSlides(change) {
    const { length } = this.props.slides;
    const prevSlide = this.state.activeSlide;
    let activeSlide = prevSlide + change;
    if (activeSlide < 0) activeSlide = length - 1;
    if (activeSlide >= length) activeSlide = 0;
    this.setState({ activeSlide, prevSlide });
  }

  render() {
    const { activeSlide, prevSlide, sliderReady } = this.state;
    return (
      <div className={classNames("slider", { "s--ready": sliderReady })}>
        <p className="slider__top-heading"></p>
        <div className="slider__slides">
          {this.props.slides.map((slide, index) => (
            <div
              className={classNames("slider__slide", {
                "s--active": activeSlide === index,
                "s--prev": prevSlide === index,
              })}
              key={index}
            >
              <div className="slider__slide-content">
                <h3 className="slider__slide-subheading">{slide.title}</h3>
                <h2 className="slider__slide-heading">
                  {slide.description.split(" ").map((l, idx) => (
                    <span key={idx}>{l}&nbsp;</span>
                  ))}
                </h2>
                <div className="slider__slide-readmore">
                  <div>
                    <a
                      className="play-btn"
                      data-fancybox
                      href={`uploads/slider/${this.props.video}`}
                      style={{ width: "70px", height: "70px" }}
                    >
                      <div className="btn-circle play-animation" />
                      <div className="btn-circle play-animation animation-short" />
                      <div className="play-icon">
                        <i className="fas fa-play" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="slider__slide-parts">
                {[...Array(this.IMAGE_PARTS).fill(null)].map((x, i) => (
                  <div className="slider__slide-part" key={i}>
                    <div
                      className="slider__slide-part-inner"
                      style={{ backgroundImage: `url(${slide.img_path})` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          className="slider__control"
          onClick={() => this.changeSlides(-1)}
        />
        <div
          className="slider__control slider__control--right"
          onClick={() => this.changeSlides(1)}
        />
      </div>
    );
  }
}

export default CitiesSlider;
