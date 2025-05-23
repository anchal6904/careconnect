import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { BsStarFill, BsStarHalf, BsStar, BsQuote } from 'react-icons/bs';
import 'swiper/css';
import 'swiper/css/pagination';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: "Dr. Saul Goodman",
    role: "Cardiologist",
    rating: 5,
    comment: "Proin feugiat facilisis purus, consequat sem cure digni ssim. Donec porttitora entum suscipit rhoncus. Excellent platform for medical appointments.",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Patient",
    rating: 4,
    comment: "The booking process was seamless and the doctors were very professional. Saved me hours of waiting time at the clinic.",
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    name: "Dr. Priya Patel",
    role: "Neurologist",
    rating: 5,
    comment: "This platform has helped me manage my appointments better and reduced no-shows significantly.",
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Patient",
    rating: 5,
    comment: "Found the perfect specialist for my condition within minutes. The video consultation feature works flawlessly.",
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  },{
    id: 5,
    name: "Dr. Saul Goodman",
    role: "Cardiologist",
    rating: 5,
    comment: "Proin feugiat facilisis purus, consequat sem cure digni ssim. Donec porttitora entum suscipit rhoncus. Excellent platform for medical appointments.",
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 6,
    name: "Sarah Johnson",
    role: "Patient",
    rating: 4,
    comment: "The booking process was seamless and the doctors were very professional. Saved me hours of waiting time at the clinic.",
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  }
];

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<BsStarFill key={i} className="star-filled" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<BsStarHalf key={i} className="star-half" />);
    } else {
      stars.push(<BsStar key={i} className="star-empty" />);
    }
  }

  return <div className="stars">{stars}</div>;
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials section">
      <Container>
        <Row className="align-items-center">
          <Col lg={5} className="info" data-aos="fade-up" data-aos-delay="100">
            <h3>Patient Reviews</h3>
            <p>
              Read what our patients and healthcare providers have to say about their experience with our medical platform.
            </p>
          </Col>

          <Col lg={7} data-aos="fade-up" data-aos-delay="200">
            <Swiper
              modules={[Autoplay, Pagination]}
              loop={true}
              speed={600}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              slidesPerView="auto"
              pagination={{
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
              }}
              className="testimonials-slider"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="testimonial-item">
                    <div className="d-flex">
                      <img 
                        src={testimonial.image}
                        className="testimonial-img flex-shrink-0" 
                        alt={testimonial.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=1977cc&color=fff`;
                        }}
                      />
                      <div>
                        <h3>{testimonial.name}</h3>
                        <h4>{testimonial.role}</h4>
                        <RatingStars rating={testimonial.rating} />
                      </div>
                    </div>
                    <p>
                      <BsQuote className="quote-icon-left" />
                      <span>{testimonial.comment}</span>
                      <BsQuote className="quote-icon-right" />
                    </p>
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-pagination"></div>
            </Swiper>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials; 