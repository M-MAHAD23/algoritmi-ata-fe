import React from 'react';
import DynamicTable from './DynamicTable';
import Panel from '../../layout/Panel';
import Batches from './../../pages/Admin/Batches';

// Example data for different entities
const batchesData = [
    { BatchName: 'Batch 1', StartDate: '2024-01-01', EndDate: '2024-06-01', Status: 'Active' },
    { BatchName: 'Batch 2', StartDate: '2024-07-01', EndDate: '2024-12-01', Status: 'Inactive' },
];

const usersData = [
    { Name: 'Alice', Role: 'Student', Email: 'alice@example.com', Status: 'Active' },
    { Name: 'Bob', Role: 'Teacher', Email: 'bob@example.com', Status: 'Active' },
];

const quizData = [
    { QuizName: 'Quiz 1', DueDate: '2024-03-15', TotalMarks: 100, Status: 'Open' },
    { QuizName: 'Quiz 2', DueDate: '2024-04-20', TotalMarks: 50, Status: 'Closed' },
];

// Rendering different tables with different headers and data
const Tables = () => {
    return (
        <>
            <Batches />
            <Teachers />
            {/* <DynamicTable title="Batches" headers={['BatchName', 'StartDate', 'EndDate', 'Status']} data={batchesData} />
                <DynamicTable title="Users" headers={['Name', 'Role', 'Email', 'Status']} data={usersData} />
                <DynamicTable title="Quizzes" headers={['QuizName', 'DueDate', 'TotalMarks', 'Status']} data={quizData} /> */}
        </>
    );
};

export default Tables;
