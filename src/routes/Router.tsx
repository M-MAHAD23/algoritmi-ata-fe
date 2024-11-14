import { Route, Routes } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import ECommerce from '../pages/Dashboard/ECommerce';
import Profile from '../pages/Profile';
import Submit from '../components/Student/Submit';
import Tables from '../components/Tables/Tables';
import Panel from '../layout/Panel'; // Import Panel
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
function Router() {
    return (
        <Routes>
            {/* Non-Panel Routes */}
            <Route index element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/submit" element={<Submit />} />

            <Route path="dashboard" element={<ECommerce />} />
            {/* Routes with Panel wrapper */}
            {/* <Route path="/" element={<Panel />}> */}
            {/* Admin */}
            <Route path="batches" element={<Batches />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="quizzes" element={<Quizzes />} />

            {/* Teacher */}
            <Route path="allBatchesWhereTeacherInvolved" element={<TeacherBatches />} />
            <Route path="activeBatch" element={<ActiveBatch />} />
            <Route path="batchQuizzes" element={<BatchQuizzes />} />

            {/* Student */}
            <Route path="studentQuiz" element={<StudentQuiz />} />
            <Route path="chatbot" element={<ChatBot />} />

            <Route path="/batch/:id" element={<BatchDetails />} />
            <Route path="tables" element={<Tables />} />
            <Route path="profile" element={<Profile />} />
            {/* </Route> */}
        </Routes>
    );
}

export default Router;
