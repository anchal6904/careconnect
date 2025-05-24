import React from 'react';
import { Card } from 'react-bootstrap';
import './DashboardStats.css';

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-cards">
      {stats.map((stat, index) => (
        <Card key={index} className="dashboard-card">
          <Card.Body>
            <h6 className="card-title">{stat.title}</h6>
            <h2 className="dashboard-stat">{stat.value}</h2>
            {stat.icon && <div className="stat-icon">{stat.icon}</div>}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats; 