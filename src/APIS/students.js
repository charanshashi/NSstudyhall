/* eslint-disable no-undef */
const exp = require("express")
const manageStudents = exp.Router()
const expressAsyncHandler = require("express-async-handler")
const { ObjectId } = require('mongodb');

manageStudents.post('/update-previous-student', async (req, res) => {
  const updatedDetails = req.body;
  const studentId=updatedDetails._id;
  delete updatedDetails._id;
  console.log(updatedDetails)
  const studentObj = req.app.get("studentObj");
  try {
      const student = await studentObj.findOne({ _id: new ObjectId(studentId) });
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }
      const result = await studentObj.updateOne(
          { _id: new ObjectId(studentId) },
          { $set: updatedDetails }
      );
      if (result.modifiedCount === 1) {
          return res.status(200).json({ message: 'Student updated successfully' });
      } else {
         return res.status(400).json({ message: 'Student update failed' });
      }
  } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

manageStudents.post('/update-student-data/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const updatedDetails = req.body;
  console.log(updatedDetails)
  delete updatedDetails._id; // Contains all updated details
  const studentObj = req.app.get("studentObj");

  try {
      const student = await studentObj.findOne({ _id: new ObjectId(studentId) });
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }
      const result = await studentObj.updateOne(
          { _id: new ObjectId(studentId) },
          { $set: updatedDetails }
      );
      if (result.modifiedCount === 1) {
          return res.status(200).json({ message: 'Student updated successfully' });
      } else {
         return res.status(400).json({ message: 'Student update failed' });
      }
  } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});
manageStudents.post('/update-student-seat/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const updatedDetails = req.body;
    delete updatedDetails._id; // Contains all updated details
    const studentObj = req.app.get("studentObj");

    try {
        const student = await studentObj.findOne({ _id: new ObjectId(studentId) });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

      if (updatedDetails.floorNo && updatedDetails.cabinNo) {
        const existingStudent = await studentObj.findOne({
            floorNo: updatedDetails.floorNo,
            cabinNo: updatedDetails.cabinNo,
        });

        if (existingStudent) {
            return res.status(400).json({ message: 'Cabin is already allotted. Please remove the previous student.' });
        }
    }
        const result = await studentObj.updateOne(
            { _id: new ObjectId(studentId) },
            { $set: updatedDetails }
        );
        if (result.modifiedCount === 1) {
            return res.status(200).json({ message: 'Student updated successfully' });
        } else {
           return res.status(400).json({ message: 'Student update failed' });
        }
    } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
manageStudents.post('/get-student/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { monthIndex } = req.body;
  const studentObj = req.app.get("studentObj");

  try {
      // Find the student by ID
      const student = await studentObj.findOne({ _id: new ObjectId(studentId) });
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }
      return res.status(200).json(student);

  } catch (error) {
      console.error('Error updating payment:', error);
      return  res.status(500).json({ message: 'Internal server error' });
  }
});
// Route to update payment status
manageStudents.post('/update-payment/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { monthIndex } = req.body;
    const studentObj = req.app.get("studentObj");

    try {
        // Find the student by ID
        const student = await studentObj.findOne({ _id: new ObjectId(studentId) });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update the payment status for the specific month
        const updateField = {};
        updateField[`payments.${monthIndex}`] = true;

        const result = await studentObj.updateOne(
            { _id: new ObjectId(studentId) },
            { $set: updateField }
        );

        if (result.modifiedCount === 1) {
          return res.status(200).json({ message: 'Payment updated successfully' });
        } else {
          return  res.status(400).json({ message: 'Payment update failed' });
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        return  res.status(500).json({ message: 'Internal server error' });
    }
});

manageStudents.get('/get-all-students', async (req, res) => {
  const studentObj = req.app.get("studentObj");
  const students = await studentObj.find({}).toArray(function (err, result) {
      if (err) throw err;
  });
  return res.status(201).json(students);

})

manageStudents.get('/get-students/:floor', async (req, res) => {
  const floor = req.params.floor;
  const studentObj = req.app.get("studentObj");
  try {
      const students = await studentObj.find({ floorNo: floor }).toArray();
      return  res.status(200).json(students);
  } catch (err) {
    return  res.status(500).send({ message: "Error retrieving students", error: err.message });
  }
});


manageStudents.post('/add-student', async (req, res) => {
    const data = req.body;
  const studentObj = req.app.get("studentObj");
  const { name,floorNo, cabinNo, dateOfJoining, mobileNumber,address,payments} = data;
  try {
    const existingStudent = await studentObj.findOne({ name: name, mobileNumber: mobileNumber });
    if (existingStudent) {
      return res.status(409).json({ message: 'Student with this name and mobile number already exists.' });
    }
    const studentDocument = {
      name: name,
      floorNo : floorNo,
      cabinNo: cabinNo,
      dateOfJoining: dateOfJoining,
      mobileNumber: mobileNumber,
      address:address,
      payments : payments
    };
    const result = await studentObj.insertOne(studentDocument);
    return res.status(201).json({ message: 'Student added successfully!', studentId: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to add student' });
  }
});

module.exports = manageStudents;