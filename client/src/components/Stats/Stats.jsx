import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUserMd, FaHospital, FaFlask, FaAward } from 'react-icons/fa';
import './Stats.css';

const Stats = () => {
  useEffect(() => {
    const loadPureCounter = async () => {
      const { default: PureCounter } = await import('@srexi/purecounterjs');
      new PureCounter({
        selector: '.purecounter',
        start: 0,
        end: 0,
        duration: 1.5,
        delay: 10,
        once: false,
        repeat: false,
        decimals: 0,
        legacy: true,
        filesizing: false,
        currency: false,
        separator: false,
      });
    };

    loadPureCounter();
  }, []);

  const stats = [
    { icon: <FaUserMd />, count: 85, label: 'Doctors' },
    { icon: <FaHospital />, count: 18, label: 'Departments' },
    { icon: <FaFlask />, count: 12, label: 'Research Labs' },
    { icon: <FaAward />, count: 150, label: 'Awards' }
  ];

  return (
    <section className="stats-section">
      <Container>
        <Row className="justify-content-center">
          {stats.map((stat, index) => (
            <Col key={index} md={6} lg={3} className="mb-4">
              <div className="stat-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="icon-wrapper">
                  {stat.icon}
                </div>
                <h2>
                  <span
                    className="purecounter"
                    data-purecounter-start="0"
                    data-purecounter-end={stat.count}
                    data-purecounter-duration="1.5"
                  >
                    0
                  </span>
                </h2>
                <p>{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Stats; 