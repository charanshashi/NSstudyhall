import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Allocation.css"; // Import custom CSS

const Allocation = () => {
  const [formData, setFormData] = useState({
    name: "",
    floorNo: "",
    cabinNo: "",
    dateOfJoining: "",
    mobileNumber: "",
    address: "",
    payments: {},
  });

  const generateMonthLabels = () => {
    const labels = [];
    const currentDate = new Date();

    for (let i = -4; i <= 1; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i
      );
      labels.push(
        date.toLocaleString("default", { month: "long", year: "numeric" })
      );
    }

    return labels;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate payment data for the months
    const monthLabels = generateMonthLabels();
    const paymentsData = {};
    monthLabels.forEach((label) => {
      paymentsData[label] = false;
    });

    // Set the payments data in the formData state
    const updatedFormData = { ...formData, payments: paymentsData };

    // Submit form data to the backend
    try {
      const response = await axios.post(
        `/students-api/add-student`,
        updatedFormData
      );
      alert(response.data.message);
      console.log("Form Submitted:", updatedFormData);
      if (response.status !== 409) {
        // Reset form data after submission
        setFormData({
          name: "",
          floorNo: "",
          cabinNo: "",
          dateOfJoining: "",
          mobileNumber: "",
          address: "",
          payments: {},
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Container className="form-container mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Allocate a New Student</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} className="form-label">
                    Name:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter student name"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} className="form-label">
                    Floor No:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      name="floorNo"
                      value={formData.floorNo}
                      onChange={handleChange}
                      placeholder="Enter floor number"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} className="form-label">
                    Cabin No:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      name="cabinNo"
                      value={formData.cabinNo}
                      onChange={handleChange}
                      placeholder="Enter cabin number"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} className="form-label">
                    Date of Joining:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      name="dateOfJoining"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} className="form-label">
                    Mobile Number:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      required
                      placeholder="Enter mobile number"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={4} className="form-label">
                    Address:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  </Col>
                </Form.Group>
                <Button className="w-100 mt-3" variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Allocation;
