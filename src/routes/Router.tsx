import { Route, Routes, Navigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ECommerce from '../pages/Dashboard/ECommerce';
import Profile from '../pages/Profile';
import Submit from '../components/Student/Submit';
import Tables from '../components/Tables/Tables';
import Panel from '../layout/Panel';
import Landing from '../pages/Landing/Landing';
import Batches from '../pages/Admin/Batches';
import Teachers from '../pages/Admin/Teachers';
import Students from '../pages/Admin/Students';
import BatchDetails from '../pages/Admin/BatchDetails';
import Quizzes from '../pages/Admin/Quzziz';
import TeacherBatches from '../pages/Teacher/TeacherBatches';
import ActiveBatch from '../pages/Teacher/ActiveBatch';
import BatchQuizzes from '../pages/Teacher/BatchQuizzes';
import StudentQuiz from '../pages/Student/StudentQuiz';
import ChatBot from '../pages/Student/ChatBot';
import { useEffect, useState } from 'react';

function Router() {
    const [userInfo, setUserInfo] = useState(null)
    const user = localStorage.getItem('userInfo');

    useEffect(() => {

        setUserInfo(user)

    }, [user])
    // Check if userInfo exists in localStorage


    return (
        <Routes>
            {/* Non-Panel Routes */}
            <Route index element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Redirect to / if no userInfo and not on sign-in or sign-up */}
            <Route path="/submit" element={userInfo ? <Submit /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={userInfo ? <ECommerce /> : <Navigate to="/" />} />

            {/* Routes with Panel wrapper */}
            {/* Admin */}
            <Route path="batches" element={userInfo ? <Batches /> : <Navigate to="/" />} />
            <Route path="teachers" element={userInfo ? <Teachers /> : <Navigate to="/" />} />
            <Route path="students" element={userInfo ? <Students /> : <Navigate to="/" />} />
            <Route path="quizzes" element={userInfo ? <Quizzes /> : <Navigate to="/" />} />

            {/* Teacher */}
            <Route path="allBatchesWhereTeacherInvolved" element={userInfo ? <TeacherBatches /> : <Navigate to="/" />} />
            <Route path="activeBatch" element={userInfo ? <ActiveBatch /> : <Navigate to="/" />} />
            <Route path="batchQuizzes" element={userInfo ? <BatchQuizzes /> : <Navigate to="/" />} />

            {/* Student */}
            <Route path="studentQuiz" element={userInfo ? <StudentQuiz /> : <Navigate to="/" />} />
            <Route path="chatbot" element={userInfo ? <ChatBot /> : <Navigate to="/" />} />

            <Route path="/batch/:id" element={userInfo ? <BatchDetails /> : <Navigate to="/" />} />
            <Route path="tables" element={userInfo ? <Tables /> : <Navigate to="/" />} />
            <Route path="profile" element={userInfo ? <Profile /> : <Navigate to="/" />} />
        </Routes>
    );
}

export default Router;
