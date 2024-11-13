// router.jsx
import { Route, Routes, useLocation } from 'react-router-dom';

import PageTitle from '../components/PageTitle';
import SignIn from '../pages/Authentication/SignIn';
import SignUp from '../pages/Authentication/SignUp';
import Calendar from '../pages/Calendar';
import Chart from '../pages/Chart';
import ECommerce from '../pages/Dashboard/ECommerce';
import FormElements from '../pages/Form/FormElements';
import FormLayout from '../pages/Form/FormLayout';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Tables from '../pages/Tables';
import Alerts from '../pages/UiElements/Alerts';
import Buttons from '../pages/UiElements/Buttons';
import Landing from '../pages/Landing/Landing';
import Panel from '../layout/Panel';


import React from 'react'
import Submit from '../components/Student/Submit';
import TableOne from '../components/Tables/TableOne';
import TableTwo from '../components/Tables/TableTwo';
import TableThree from '../components/Tables/TableThree';
import Presentation from './../pages/Presentation/Presentation';

function Router() {

    return (
        <Routes>
            <Route index element={<Landing />} />
            <Route
                path="/signin"
                element={
                    <SignIn />
                }
            />
            <Route
                path="/signup"
                element={
                    <SignUp />
                }
            />
            <Route
                path="/panel"
                element={
                    <Panel />
                }
            />
            <Route
                path="/submit"
                element={
                    <Submit />
                }
            />
            <Route
                path="/table1"
                element={
                    <TableOne />
                }
            />
            <Route
                path="/table2"
                element={
                    <TableTwo />
                }
            />
            <Route
                path="/table3"
                element={
                    <TableThree />
                }
            />
            <Route
                path="/presentation"
                element={
                    <Presentation />
                }
            />
        </Routes>
    )
}

export default Router;