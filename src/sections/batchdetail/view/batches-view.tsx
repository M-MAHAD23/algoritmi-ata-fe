import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';

// Mock data for batch details with multiple instructors
const batchData = {
  batchNo: '1234',
  batchName: 'Advanced React Development',
  instructors: ['John Doe', 'Jane Smith'],
  students: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
  assignments: ['Assignment 1', 'Assignment 2', 'Assignment 3'],
};

export function BatchDetail() {
  const [batchInfo] = useState(batchData);

  const handleViewStudent = (studentName) => {
    console.log("Viewing student:", studentName);
    // Add logic to view student details
  };

  const handleViewAssignment = (assignmentName) => {
    console.log("Viewing assignment:", assignmentName);
    // Add logic to view assignment details
  };

  const handleViewInstructor = (instructorName) => {
    console.log("Viewing instructor:", instructorName);
    // Add logic to view instructor details
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Batch Detail
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 1000, mt: 5 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Batch Detail
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Batch Details */}
          <Typography variant="subtitle1">Batch No: {batchInfo.batchNo}</Typography>
          <Typography variant="subtitle1">Batch Name: {batchInfo.batchName}</Typography>

          {/* Instructors List Table */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Instructors
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="instructor table">
              <TableHead>
                <TableRow>
                  <TableCell>Instructor Name</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchInfo.instructors.map((instructor, index) => (
                  <TableRow key={index}>
                    <TableCell>{instructor}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewInstructor(instructor)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Student List Table */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Students
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="student table">
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchInfo.students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewStudent(student)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Assignments List Table */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Assignments
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table aria-label="assignment table">
              <TableHead>
                <TableRow>
                  <TableCell>Assignment Name</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batchInfo.assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assignment}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewAssignment(assignment)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
