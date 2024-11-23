import { Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from '../common/PageNotFound'; // Ensure you import the PageNotFound component
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ECommerce from '../pages/Dashboard/ECommerce';
import Profile from '../pages/Profile';
import Submit from '../components/Student/SubmitModal';
import Tables from '../components/Tables/Tables';
import Panel from '../layout/Panel';
import Landing from '../pages/Landing/Landing';
import Batches from '../pages/Admin/Batches';
import Teachers from '../pages/Admin/Teachers';
import Students from '../pages/Admin/Students';
import Quizzes from '../pages/Admin/Quzziz';
import TeacherBatches from '../pages/Teacher/TeacherBatches';
import ActiveBatch from '../pages/Teacher/ActiveBatch';
import BatchQuizzes from '../pages/Teacher/BatchQuizzes';
import { AnimatePresence } from 'framer-motion';

// Student
import StudentQuiz from '../pages/Student/StudentQuiz';
import QuizResults from '../pages/Student/QuizResults';
import ChatBot from '../pages/Student/ChatBot';
import { useGetUserInfo } from '../hooks/hooks';
import QuizSubmission from '../pages/Teacher/QuizSubmission';
import BatchDetails from '../pages/Admin/BatchDetails';

// Wrapper to handle private routes
const PrivateRoute = ({ element }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo ? element : <Navigate to="/" />;
};

function Router() {
    useGetUserInfo(); // Call the hook here

    return (
        <AnimatePresence>
            <Routes>
                {/* Public Routes */}
                <Route index element={<Landing />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Private Routes */}
                <Route path="/submit" element={<PrivateRoute element={<Submit />} />} />
                <Route path="/dashboard" element={<PrivateRoute element={<ECommerce />} />} />

                {/* Admin */}
                <Route
                    path="batches"
                    element={<PrivateRoute element={<Batches />} />}
                />
                <Route
                    path="/batch-details"
                    element={<BatchDetails />} />

                <Route
                    path="teachers"
                    element={<PrivateRoute element={<Teachers />} />}
                />
                <Route
                    path="students"
                    element={<PrivateRoute element={<Students />} />}
                />
                <Route
                    path="quizzes"
                    element={<PrivateRoute element={<Quizzes />} />}
                />

                {/* Teacher */}
                <Route
                    path="teacher-batches"
                    element={<PrivateRoute element={<TeacherBatches />} />}
                />
                <Route
                    path="teacher-active-batch"
                    element={<PrivateRoute element={<ActiveBatch />} />}
                />
                <Route
                    path="/quiz-submission"
                    element={<PrivateRoute element={<QuizSubmission />} />}
                />
                <Route
                    path="/quiz-results"
                    element={<PrivateRoute element={<QuizResults />} />}
                />

                {/* Both */}
                <Route
                    path="chatbot"
                    element={<PrivateRoute element={<ChatBot />} />}
                />

                {/* Student */}
                <Route
                    path="student-quiz"
                    element={<PrivateRoute element={<StudentQuiz />} />}
                />
                <Route
                    path="/student/quiz/results"
                    element={<PrivateRoute element={<QuizResults />} />}
                />
                <Route
                    path="/batch"
                    element={<PrivateRoute element={<BatchDetails />} />}
                />
                <Route
                    path="tables"
                    element={<PrivateRoute element={<Tables />} />}
                />
                <Route
                    path="profile"
                    element={<PrivateRoute element={<Profile />} />}
                />
                {/* Catch-all for 404 Page */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </AnimatePresence>
    );
}

export default Router;
