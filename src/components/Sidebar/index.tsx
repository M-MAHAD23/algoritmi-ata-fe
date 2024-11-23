import SidebarLinkGroup from './SidebarLinkGroup';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCircleQuestion, faGraduationCap, faMessage, faPeopleGroup, faPerson, faPersonChalkboard, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedUserInfo && storedToken) {
      setToken(storedToken);
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <div className="pl-4 flex items-center">
            <svg width="50px" height="50px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z" fill="#FFFFFF" />
            </svg>
            <a className="toggleColour text-white no-underline hover:no-underline font-bold text-5xl" href="/">
              ATA
            </a>
          </div>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">

              <li>
                <NavLink
                  to="/profile"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-xl text-white"
                  />
                  Profile
                </NavLink>
              </li>

              {
                userInfo?.role === "Admin" &&
                (
                  <>
                    <li>
                      <NavLink
                        to="/batches"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('batches') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faPeopleGroup}
                          className="text-xl text-white"
                        />
                        Batches
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/teachers"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('teachers') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faPersonChalkboard}
                          className="text-xl text-white"
                        />
                        Teachers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/students"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('students') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="text-xl text-white"
                        />
                        Students
                      </NavLink>
                    </li>
                    {/* <li>
                      <NavLink
                        to="/quizzes"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        Quizzes
                      </NavLink>
                    </li> */}
                  </>
                )
              }

              {
                userInfo?.role === "Teacher" &&
                (
                  <>
                    <li>
                      <NavLink
                        to="/teacher-batches"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('teacher-batches') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faPeopleGroup}
                          className="text-xl text-white"
                        />
                        Your Batches
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/teacher-active-batch"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('teacher-active-batch') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faPerson}
                          className="text-xl text-white"
                        />
                        Your Batch
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/chatbot"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('chatbot') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faMessage}
                          className="text-xl text-white"
                        />
                        Chatbot
                      </NavLink>
                    </li>
                  </>
                )
              }

              {
                userInfo?.role === "Student" &&
                (
                  <>
                    <li>
                      <NavLink
                        to="/student-quiz"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('student-quiz') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faQuestion}
                          className="text-xl text-white"
                        />
                        Quiz
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/chatbot"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('chatbot') &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faMessage}
                          className="text-xl text-white"
                        />
                        Chatbot
                      </NavLink>
                    </li>
                  </>
                )
              }
            </ul>
          </div>

          {/* <!-- Others Group --> */}

        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
