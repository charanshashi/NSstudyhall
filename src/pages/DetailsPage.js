import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function DetailsPage() {
  const location = useLocation();
  const { item } = location.state;
  const [remarks, setRemarks] = useState(item.remarks || '');

  const handleRemarksSave = () => {
    item.remarks=remarks;
    axios.post(`/students-api/update-student-data/${item._id}`,item)
      .then(response => {
        console.log('Remarks updated successfully:', response.data);
        alert('Remarks saved successfully');
      })
      .catch(error => {
        console.error('Error updating remarks:', error);
      });
  };
  const handleRemarksNone=()=>{
    setRemarks(item.remarks);
  }

  return (
    <div>
      <h2>Details for {item.name}</h2>
      <p>ID: {item._id}</p>
      <p>Date of Joining: {item.dateOfJoining}</p>
      <p>Phone: {item.mobileNumber}</p>
      <p>Address: {item.address}</p>

      <div>
        <strong>Payments:</strong>
        {Object.entries(item.payments).reverse().map(([month, status], index) => (
        <div key={index}>
          <p>{month} : {status ? 'Paid' : 'Not Paid'}</p>
          <hr />
        </div>
      ))}
      </div>
      <div>
        <strong>Remarks:</strong>
        <textarea 
          value={remarks} 
          onChange={(e) => setRemarks(e.target.value)} 
          rows="4" 
          cols="50"
        />
        <br />
        <button onClick={handleRemarksSave}>Save Remarks</button>
        <button onClick={handleRemarksNone}>Undo Remarks</button>
      </div>
    </div>
  );
}

export default DetailsPage;

