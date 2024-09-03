import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./SecondFloor.css"; // Import custom CSS

function SecondFloor() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [allottedSeats, setAllottedSeats] = useState([]);
  const [remainingSeats, setRemainingSeats] = useState([]);
  const totalSeats = 100;

  const handleRowClick = (item) => {
    navigate(`/details/${item._id}`, { state: { item, monthLabels: months } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/students-api/get-students/2`);
        setData(response.data);
        setMonths(generateMonthLabels());
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) generateSeats(totalSeats);
    data.sort((a, b) => parseInt(a.cabinNo) - parseInt(b.cabinNo));
    console.log(data)
  }, [data]);

  const generateSeats = (n) => {
    const arr = data.map((item) => item.cabinNo);
    const allSeats = Array.from({ length: n }, (_, i) => String(i + 1));
    const unallocatedSeats = allSeats.filter((seat) => !arr.includes(seat));
    arr.sort((a, b) => parseInt(a) - parseInt(b));
    setAllottedSeats(arr);
    setRemainingSeats(unallocatedSeats);
  };

  const generateMonthLabels = () => {
    const labels = [];
    const currentDate = new Date();
    for (let i = -5; i <= 2; i++) {
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

  const handleCheckboxClick = async (studentId, monthIndex) => {
    const updatedData = data.map((student) => {
      if (student._id === studentId) {
        const updatedPayments = student.payments;
        if (!updatedPayments[monthIndex]) {
          updatedPayments[monthIndex] = true;
          axios
            .post(`/students-api/update-payment/${studentId}`, { monthIndex })
            .then((response) => {
              alert(response.data.message);
            })
            .catch((error) => {
              console.error("Error updating payment:", error);
            });
        }
        return { ...student, payments: updatedPayments };
      }
      return student;
    });
    setData(updatedData);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
  };

  const handleSave = async () => {
    if (selectedItem) {
      setData((prevData) =>
        prevData.map((item) =>
          item._id === selectedItem._id ? selectedItem : item
        )
      );
      await axios
        .post(
          `/students-api/update-student-seat/${selectedItem._id}`,
          selectedItem
        )
        .then((response) => {
          alert("Student details updated successfully");
        })
        .catch((error) => {
          console.error("Error updating student:", error);
          alert("Student update failed");
        });
      setShow(false);
    }
  };

  const handleDeallocate = () => {
    if (selectedItem) {
      setSelectedItem((prevItem) => ({
        ...prevItem,
        floorNo: "",
        cabinNo: "",
      }));
    }
  };

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center text-primary">Second Floor AC</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <h2 className="text-success">Allocated Seats:</h2>
          <div className="seat-list">
            {allottedSeats.map((item, index) => (
              <span key={index} className="badge bg-primary me-2">
                {item}
              </span>
            ))}
          </div>
        </Col>
        <Col md={6}>
          <h2 className="text-danger">Remaining Seats:</h2>
          <div className="seat-list">
            {remainingSeats.map((item, index) => (
              <span key={index} className="badge bg-secondary me-2">
                {item}
              </span>
            ))}
          </div>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="table">
        <thead>
          <tr>
            <th>Cabin No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Payments</th>
            <th>Date of Joining</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Cabin No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Payments</th>
            <th>Date of Joining</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
          <tr>
            <th>Cabin No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Payments</th>
            <th>Date of Joining</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.cabinNo}</td>
              <td className="text-primary" onClick={() => handleRowClick(item)}>
                {item.name}
              </td>
              <td>{item.mobileNumber}</td>
              <td>
                {months.map((month, index) => (
                  <div key={index} className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={item.payments[index] === true}
                      onChange={() => handleCheckboxClick(item._id, index)}
                    />
                    <label className="form-check-label ms-2">{month}</label>
                  </div>
                ))}
              </td>
              <td>{item.dateOfJoining}</td>
              <td>{item.address}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(item)}>
                  Change Seat
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Edit Student Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedItem && (
            <div>
              <div className="mb-3">
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Floor:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedItem.floorNo}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      floorNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Cabin No:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedItem.cabinNo}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      cabinNo: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedItem.mobileNumber}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      mobileNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address:</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedItem.address}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                variant="danger"
                onClick={handleDeallocate}
                className="me-2"
              >
                Deallocate Seat
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default SecondFloor;
