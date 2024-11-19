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
import BatchDetails from '../pages/Admin/BatchDetails';
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
                    element={<PrivateRoute element={<Panel><Batches /></Panel>} />}
                />
                <Route
                    path="teachers"
                    element={<PrivateRoute element={<Panel><Teachers /></Panel>} />}
                />
                <Route
                    path="students"
                    element={<PrivateRoute element={<Panel><Students /></Panel>} />}
                />
                <Route
                    path="quizzes"
                    element={<PrivateRoute element={<Panel><Quizzes /></Panel>} />}
                />

                {/* Teacher */}
                <Route
                    path="allBatchesWhereTeacherInvolved"
                    element={<PrivateRoute element={<Panel><TeacherBatches /></Panel>} />}
                />
                <Route
                    path="activeBatch"
                    element={<PrivateRoute element={<Panel><ActiveBatch /></Panel>} />}
                />
                <Route
                    path="/quizSubmission"
                    element={<PrivateRoute element={<Panel><QuizSubmission /></Panel>} />}
                />
                <Route
                    path="/teacher/quiz/results"
                    element={<PrivateRoute element={<Panel><QuizResults /></Panel>} />}
                />

                {/* Both */}
                <Route
                    path="chatbot"
                    element={<PrivateRoute element={<Panel><ChatBot /></Panel>} />}
                />

                {/* Student */}
                <Route
                    path="studentQuiz"
                    element={<PrivateRoute element={<Panel><StudentQuiz /></Panel>} />}
                />
                <Route
                    path="/student/quiz/results"
                    element={<PrivateRoute element={<Panel><QuizResults /></Panel>} />}
                />
                <Route
                    path="/batch"
                    element={<PrivateRoute element={<Panel><BatchDetails /></Panel>} />}
                />
                <Route
                    path="tables"
                    element={<PrivateRoute element={<Panel><Tables /></Panel>} />}
                />
                <Route
                    path="profile"
                    element={<PrivateRoute element={<Panel><Profile /></Panel>} />}
                />
                {/* Catch-all for 404 Page */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </AnimatePresence>
    );
}

export default Router;
