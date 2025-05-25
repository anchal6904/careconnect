import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaPlus, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import './DoctorSchedule.css';

const DoctorSchedule = ({ doctorId, onScheduleUpdate, doctorData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workingHours, setWorkingHours] = useState({});
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [timeRanges, setTimeRanges] = useState([]);
  const [maxDate, setMaxDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });

  const timeRangeOptions = [
    { label: 'Morning Shift (9:00 AM - 12:00 PM)', value: '09:00-12:00' },
    { label: 'Afternoon Shift (1:00 PM - 4:00 PM)', value: '13:00-16:00' },
    { label: 'Evening Shift (4:00 PM - 7:00 PM)', value: '16:00-19:00' },
    { label: 'Night Shift (7:00 PM - 10:00 PM)', value: '19:00-22:00' }
  ];

  // Initialize schedule from doctor's data
  useEffect(() => {
    if (doctorData?.available_days && doctorData?.available_hours) {
      const availableDays = doctorData.available_days.split(',');
      const availableHours = doctorData.available_hours.split(',');
      
      const today = new Date();
      const initialHolidays = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (availableDays.includes(dayOfWeek)) {
          initialHolidays[dateKey] = {
            date: dateKey,
            isHoliday: false,
            timeRanges: availableHours.map(hours => {
              const [start, end] = hours.split('-');
              return { startTime: start, endTime: end };
            })
          };
        } else {
          initialHolidays[dateKey] = {
            date: dateKey,
            isHoliday: true,
            timeRanges: []
          };
        }
      }
      
      setWorkingHours(initialHolidays);
    } else {
      // Initialize empty schedule if no data exists
      const today = new Date();
      const initialHolidays = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        initialHolidays[dateKey] = {
          date: dateKey,
          isHoliday: true,
          timeRanges: []
        };
      }
      
      setWorkingHours(initialHolidays);
    }
  }, [doctorData]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = date.toISOString().split('T')[0];
    const existingSchedule = workingHours[dateKey];
    
    if (existingSchedule && !existingSchedule.isHoliday) {
      setTimeRanges(existingSchedule.timeRanges.map(range => ({
        range: `${range.startTime}-${range.endTime}`
      })));
    } else {
      setTimeRanges([]);
    }
    
    setShowTimeModal(true);
  };

  const handleAddTimeRange = () => {
    setTimeRanges([...timeRanges, { range: '' }]);
  };

  const handleRemoveTimeRange = (index) => {
    setTimeRanges(timeRanges.filter((_, i) => i !== index));
  };

  const handleTimeRangeChange = (index, value) => {
    const newTimeRanges = [...timeRanges];
    newTimeRanges[index] = { range: value };
    setTimeRanges(newTimeRanges);
  };

  const handleTimeRangeSubmit = (e) => {
    e.preventDefault();
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    if (timeRanges.length === 0) {
      return;
    }

    setWorkingHours(prev => {
      const newHours = {
        ...prev,
        [dateKey]: {
          date: dateKey,
          isHoliday: false,
          timeRanges: timeRanges.map(range => ({
            startTime: range.range.split('-')[0],
            endTime: range.range.split('-')[1]
          }))
        }
      };
      
      // Call the update function with the new schedule
      onScheduleUpdate(newHours);
      
      return newHours;
    });
    
    setShowTimeModal(false);
    setTimeRanges([]);
  };

  const handleDeleteTimeRange = (dateKey) => {
    setWorkingHours(prev => {
      const newHours = {
        ...prev,
        [dateKey]: {
          ...prev[dateKey],
          isHoliday: true,
          timeRanges: []
        }
      };
      
      localStorage.setItem(`doctorSchedule_${doctorId}`, JSON.stringify(newHours));
      onScheduleUpdate(newHours);
      
      return newHours;
    });
  };

  const handleQuickSchedule = () => {
    const today = new Date();
    const schedule = {};
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      schedule[dateKey] = {
        date: dateKey,
        isHoliday: false,
        timeRanges: timeRanges.map(range => ({
          startTime: range.range.split('-')[0],
          endTime: range.range.split('-')[1]
        }))
      };
    }
    
    setWorkingHours(schedule);
    localStorage.setItem(`doctorSchedule_${doctorId}`, JSON.stringify(schedule));
    onScheduleUpdate(schedule);
    setShowTimeModal(false);
    setTimeRanges([]);
  };

  const isFirstDayOfWeek = (date) => {
    const today = new Date();
    return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  };

  const tileClassName = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const hours = workingHours[dateKey];
    
    if (!hours) return 'disabled-day';
    if (hours.isHoliday) return 'holiday-day';
    return 'working-day';
  };

  const tileContent = ({ date }) => {
    const dateKey = date.toISOString().split('T')[0];
    const hours = workingHours[dateKey];
    
    if (hours && !hours.isHoliday) {
      return (
        <div className="working-hours-indicator">
          <FaClock />
        </div>
      );
    }
    return null;
  };

  const tileDisabled = ({ date }) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);
    return date < today || date > maxDate;
  };

  return (
    <div className="schedule-section">
      <div className="schedule-header">
        <h2>Schedule Management</h2>
        <p>Set your working hours for the next 7 days</p>
      </div>

      <Row>
        <Col md={8}>
          <Card className="calendar-card">
            <Card.Body>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={tileContent}
                onClickDay={handleDateClick}
                tileDisabled={tileDisabled}
                minDate={new Date()}
                maxDate={maxDate}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="schedule-summary">
            <Card.Body>
              <h5>Working Hours Summary</h5>
              <div className="working-hours-list">
                {Object.entries(workingHours)
                  .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                  .map(([date, hours]) => (
                    <div key={date} className={`working-hours-item ${hours.isHoliday ? 'holiday' : ''}`}>
                      <div className="date-info">
                        <h6>{new Date(date).toLocaleDateString()}</h6>
                        {!hours.isHoliday && (
                          <>
                            {hours.timeRanges.map((range, index) => (
                              <p key={index}>
                                {timeRangeOptions.find(opt => 
                                  opt.value === `${range.startTime}-${range.endTime}`
                                )?.label.split(' ')[0] || ''} Shift
                                ({range.startTime} - {range.endTime})
                              </p>
                            ))}
                          </>
                        )}
                        {hours.isHoliday && (
                          <p className="text-danger">Holiday</p>
                        )}
                      </div>
                      {!hours.isHoliday && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTimeRange(date)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showTimeModal} onHide={() => setShowTimeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Working Hours for {selectedDate.toLocaleDateString()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTimeRangeSubmit}>
            {timeRanges.map((range, index) => (
              <div key={index} className="time-range-container">
                <div className="time-range-header">
                  <h6 className="time-range-title">Shift {index + 1}</h6>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveTimeRange(index)}
                  >
                    <FaTrash />
                  </Button>
                </div>
                <Form.Select
                  className="time-range-select"
                  value={range.range}
                  onChange={(e) => handleTimeRangeChange(index, e.target.value)}
                  required
                >
                  <option value="">Select a shift</option>
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            ))}

            <Button
              type="button"
              variant="outline-primary"
              className="add-time-range-btn"
              onClick={handleAddTimeRange}
            >
              <FaPlus className="me-2" />
              Add Shift
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isFirstDayOfWeek(selectedDate) && (
            <Button
              type="button"
              variant="success"
              onClick={handleQuickSchedule}
              disabled={timeRanges.length === 0}
            >
              <FaCalendarAlt className="me-2" />
              Apply to Next 7 Days
            </Button>
          )}
          <div>
            <Button variant="secondary" className="me-2" onClick={() => setShowTimeModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={timeRanges.length === 0}
              onClick={handleTimeRangeSubmit}
            >
              Save Hours
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorSchedule; 