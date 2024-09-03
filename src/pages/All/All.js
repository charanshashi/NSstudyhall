import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./All.css"; // Import custom CSS
import { Button, Offcanvas, Table, Container, Row, Col, Form } from "react-bootstrap";

function All() {
  const [data, setData] = useState([]);
  const [allocateStudent, setAllocateStudent] = useState(null); // State to track student being allocated
  const [floorNo, setFloorNo] = useState("");
  const [cabinNo, setCabinNo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/students-api/get-all-students`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (item) => {
    navigate(`/details/${item._id}`, { state: { item } });
  };

  const handleallocate = (student) => {
    setAllocateStudent(student); // Set the student being allocated
  };

  const handleSaveAllocation = async(student) => {
    // Handle the allocation logic, such as sending a request to update the student's floor and cabin
    console.log("Allocated student:", allocateStudent);
    console.log("Floor:", floorNo);
    console.log("Cabin:", cabinNo);
    student.cabinNo=cabinNo;
    student.floorNo=floorNo;
    console.log(student);
    try {
      const response = await axios.post(
        `/students-api/update-previous-student`,
        student
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    
    // After allocation, you might want to reset the state
    setAllocateStudent(null);
    setFloorNo("");
    setCabinNo("");
  };

  const renderFloorData = (floor, title) => (
    <div className="floor-container">
      <h2 className="floor-title">{title}</h2>
      {allocateStudent && (
        <div className="allocation-form">
          <h3>Allocate {allocateStudent.name}</h3>
          <Form>
            <Form.Group controlId="formFloorNo">
              <Form.Label>Floor No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Floor No"
                value={floorNo}
                onChange={(e) => setFloorNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formCabinNo">
              <Form.Label>Cabin No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Cabin No"
                value={cabinNo}
                onChange={(e) => setCabinNo(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={()=>handleSaveAllocation(allocateStudent)}>
              Save Allocation
            </Button>
          </Form>
        </div>
      )}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Allocate</th>
          </tr>
        </thead>
        <tbody>
          {groupedData[floor] ? (
            groupedData[floor].map((student) => (
              <tr key={student._id} className="student-row">
                <td onClick={() => handleRowClick(student)}>{student.name}</td>
                <td onClick={() => handleRowClick(student)}>{student.mobileNumber}</td>
                <td onClick={() => handleRowClick(student)}>{student.address}</td>
                <td>
                  <Button variant="primary" onClick={() => handleallocate(student)}>
                    Allocate
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* Render input fields if a student is being allocated */}
    
    </div>
  );

  const groupByFloor = (data) => {
    return data.reduce((acc, student) => {
      const floor = student.floorNo;
      if (!acc[floor]) {
        acc[floor] = [];
      }
      acc[floor].push(student);
      return acc;
    }, {});
  };

  const groupedData = groupByFloor(data);

  return (
    <div className="all-students-container">
      <h1 className="main-title">All Students Data</h1>
      {/* Uncomment if needed */}
      {/* {renderFloorData('1', 'First Floor AC')}
      {renderFloorData('2', 'Second Floor AC')}
      {renderFloorData('3', 'Third Floor Non-AC')} */}
      {renderFloorData("", "Previous Members")}
    </div>
  );
}

export default All;
