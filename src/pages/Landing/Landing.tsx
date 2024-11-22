import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeAnimation from './CodeAnimation';
import colab from '../../images/ata/colab.png';
import globe from '../../images/ata/globe.png';

function Landing() {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: 'Dr. Nabeel Sabir Khan',
      role: 'Supervisor',
      imgSrc:
        'https://media.licdn.com/dms/image/v2/C4D03AQEFh_zzw78iGA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1663251846384?e=1736985600&v=beta&t=hQTNyrl2dA0RvGRlbb2kbrBv-x9CFdyjKgvnJ2wE600',
      description:
        'Programming Language Trainer | Project Advisor | Programming Coach | Helping individuals to learn and improve computing foundations 🛡️',
      linkedin: 'https://www.linkedin.com/in/dr-nabeel-sabir-khan-8904a4221/',
    },
    {
      name: 'Muhammad Mahad',
      role: 'Software Developer',
      imgSrc:
        'https://media.licdn.com/dms/image/v2/D4D03AQFgjwguHhAvHA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1703308146717?e=1736985600&v=beta&t=K5vQ9u7384x6eo2Edoa1A0LuF6CdejLaWZ9YuQ7jGKw',
      description:
        'Coding the Future Together! I am a Software Engineer with expertise in Artificial Intelligence, Blockchain, IoT, and Cloud. Let’s keep solving 🛡️',
      linkedin: 'https://www.linkedin.com/in/muhammad-mahad-33806022a/',
    },
    {
      name: 'Muhammad Ahad',
      role: 'Documenter & Designer',
      imgSrc:
        'https://media.licdn.com/dms/image/v2/D4D03AQGdkQJHW3tR5A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729608779381?e=1736985600&v=beta&t=xmafwNQK6vmdyE0RxWBbjace3EpK8zDVY2dS6Vf33nw',
      description:
        'Coding the Future Together! I am a Software Engineer with expertise in Python, Designing, and Architecture. Let’s keep solving 🛡️',
      linkedin: 'https://www.linkedin.com/in/muhammad-ahad-9a2b43268/',
    },
    // {
    //   name: 'Muhammad Ahmad',
    //   role: 'Tester',
    //   imgSrc:
    //     'https://scontent.flhe13-1.fna.fbcdn.net/v/t39.30808-6/343163896_770153518161561_6751047617848390799_n.jpg?stp=c5.0.306.306a_dst-jpg_s206x206&_nc_cat=108&ccb=1-7&_nc_sid=fe5ecc&_nc_ohc=4we9_5V6cVMQ7kNvgGQ0do5&_nc_zt=23&_nc_ht=scontent.flhe13-1.fna&_nc_gid=A9jLI1gcUzZW0hQMx4yeCyh&oh=00_AYDO8TFNdpW7Flh0m2y8bMZSEFjl8QzfGWvYG_eNfwiMKA&oe=673B3B81',
    //   description:
    //     'Responsible for ensuring the quality, functionality, and reliability of software through meticulous testing and validation of features and fixes before release 🛡️',
    //   linkedin: 'your-link-here',
    // },
  ];
  const [currentLine, setCurrentLine] = useState(0); // Tracks which line is being typed
  const [visibleText, setVisibleText] = useState({
    line1: '',
    line2: '',
    line3: '',
  });
  const fullTexts = [
    'Why ATA? Empowering learning through intelligent guidance.',
    'Your personal programming oriented Artificial Teaching Assistant.',
    "ATA provides interactive, personalized assistance, transforming how students approach and understand challenging concepts. It’s more than support—it's a smarter path to academic success.",
  ];
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('typewriterEffectShown')) {
      sessionStorage.setItem('typewriterEffectShown', 'true');
      typeWriterSequentially(0, () => {
        sessionStorage.removeItem('typewriterEffectShown'); // Clear after typing is done
      });
    } else {
      setVisibleText({
        line1: fullTexts[0],
        line2: fullTexts[1],
        line3: fullTexts[2],
      });
    }
  }, []);

  const typeWriterSequentially = (lineIndex, callback) => {
    if (lineIndex >= fullTexts.length) {
      if (callback) callback(); // Call the callback when all lines are finished
      return;
    }

    let charIndex = 0;
    const interval = setInterval(() => {
      setVisibleText((prev) => ({
        ...prev,
        [`line${lineIndex + 1}`]: fullTexts[lineIndex].slice(0, charIndex + 1),
      }));
      charIndex++;
      if (charIndex === fullTexts[lineIndex].length) {
        clearInterval(interval);
        setTimeout(() => typeWriterSequentially(lineIndex + 1, callback), 500);
      }
    }, 50);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedUserInfo && storedToken) {
      setToken(storedToken);
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Detect the window width and set the state for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsOverflowing(window.innerWidth < 768); // Adjust threshold as needed
    };

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav id="header" className="fixed w-full z-30 top-0 text-white bg-black">
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
          <div className="pl-4 flex items-center">
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z"
                fill="#FFFFFF"
              />
            </svg>
            <a
              className="toggleColour text-white no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
              href="#"
            >
              Artificial Teaching Assistant
            </a>
          </div>
          {/* <div className="block lg:hidden pr-4">
            <button
              id="nav-toggle"
              className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              <svg
                className="fill-current h-6 w-6"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div> */}
          <div
            className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
            id="nav-content"
          >
            <ul className="list-reset lg:flex justify-end flex-1 items-center">
              <li className="mr-3">
                <a
                  className="inline-block py-2 px-4 text-black font-bold no-underline"
                  href="#"
                ></a>
              </li>
              <li className="mr-3">
                <a
                  className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                  href="#"
                ></a>
              </li>
              <li className="mr-3">
                <a
                  className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
                  href="#"
                ></a>
              </li>
            </ul>
            {userInfo && token ? (
              <div className="flex justify-center mr-22">
                <button
                  onClick={() => navigate('/profile')}
                  className="hover:underline bg-white text-black font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  View Profile
                </button>
              </div>
            ) : (
              <div className="flex gap-3 justify-center mr-22">
                <button
                  onClick={() => navigate('/signup')}
                  className="hover:underline bg-white text-black font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="hover:underline bg-white text-black font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
        <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
      </nav>

      <div className="bg-black pt-32 h-screen">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center space-y-8 md:space-y-0 h-full">
          <div className="flex flex-col w-full md:w-2/5 pl-8 justify-center items-start text-center md:text-left mt-[-120px]">
            <p className="leading-normal text-md mb-2">{visibleText.line1}</p>
            <h1 className="my-3 text-3xl font-bold text-white leading-tight">
              {visibleText.line2}
            </h1>
            <p className="leading-normal text-md mb-8">{visibleText.line3}</p>
            <button
              onClick={() => navigate('/signup')}
              className="mx-auto lg:mx-0 hover:underline bg-white text-black font-bold rounded-full mb-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              Join Us
            </button>
          </div>

          <div className="w-full md:w-3/5 py-32 text-center overflow-auto">
            {/* Only render CodeAnimation if not overflowing */}
            {!isOverflowing && (
              <div className="ml-30">
                <CodeAnimation />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-black relative -mt-12 lg:-mt-24">
        <svg
          viewBox="0 0 1428 174"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g
              transform="translate(-2.000000, 44.000000)"
              fill="#FFFFFF"
              fill-rule="nonzero"
            >
              <path
                d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496"
                opacity="0.100000001"
              ></path>
              <path
                d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                opacity="0.100000001"
              ></path>
              <path
                d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z"
                id="Path-4"
                opacity="0.200000003"
              ></path>
            </g>
            <g
              transform="translate(-4.000000, 76.000000)"
              fill="#FFFFFF"
              fill-rule="nonzero"
            >
              <path d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"></path>
            </g>
          </g>
        </svg>
      </div>
      <section className="bg-white border-b py-8">
        <div className="container max-w-5xl mx-auto m-8">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
            Overview
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          <div className="flex flex-wrap items-center">
            {/* Text Section */}
            <div
              className="w-5/6 sm:w-1/2 p-6 flex flex-col justify-center"
              style={{ minHeight: '300px' }} // Ensure consistent height
            >
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Artificial Teaching Assistant
              </h3>
              <p className="text-gray-600 mb-4">
                {' '}
                {/* Reduced bottom margin */}A Web Based Artificial Teaching
                Assistant aims to create an intelligent system that assists
                Teachers and Students. Replaces traditional teaching assistant
                roles, addressing bias, focus, and overload issues.
              </p>
            </div>

            {/* Image Section */}
            <div className="w-full sm:w-1/2 p-6 flex justify-center">
              <img
                src={colab}
                alt="Artificial Teaching Assistant"
                className="max-w-full h-auto"
              />
            </div>
          </div>

          <div className="flex flex-wrap flex-col-reverse sm:flex-row items-center">
            {/* Image Section */}
            <div
              className="w-full sm:w-1/2 p-6 mt-6 flex justify-center"
              style={{ minHeight: '300px' }}
            >
              <img src={globe} alt="Features" className="max-w-full h-auto" />
            </div>

            {/* Text Section */}
            <div
              className="w-full sm:w-1/2 p-6 mt-6 flex flex-col justify-center"
              style={{ minHeight: '300px' }}
            >
              <h3 className="text-3xl text-gray-800 font-bold leading-none mb-3">
                Features
              </h3>
              <p className="text-gray-600 mb-4">
                {' '}
                {/* Reduced bottom margin */}
                Automated Quiz Management, Chatbot for students, Batch
                Management, Personalized Learning, Plagiarism Detection, and
                24/7 Availability are key features of the ATA.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black border-b py-8">
        <div className="bg-black container mx-auto flex flex-wrap pt-4 pb-12">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-white">
            Our Team
          </h2>
          <div className="w-full mb-4">
            <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>

          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 p-6 flex flex-col flex-grow flex-shrink rounded-lg"
              >
                <div className="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow flex flex-col items-center justify-center">
                  <div className="mt-15 w-full font-bold text-2xl text-gray-800 px-6 text-center">
                    {member.name}
                  </div>
                  <img
                    src={member.imgSrc}
                    alt="Profile"
                    className="mt-15 w-50 h-50 rounded-full mb-4 object-cover"
                  />
                  <div className="w-full font-bold text-2xl text-gray-800 px-6 text-center">
                    {member.role}
                  </div>
                  <p className="text-gray-800 text-2xl px-6 mb-5 text-center">
                    {member.description}
                  </p>
                </div>
                <div className="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6">
                  <div className="flex items-center justify-center">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="mx-auto lg:mx-0 hover:underline gradient bg-black text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                        Contact
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto text-center py-6 mb-12">
        <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-black">
          Algoritmi.
        </h2>
        <div className="w-full mb-4">
          <div className="h-1 mx-auto bg-black w-1/6 opacity-25 my-0 py-0 rounded-t"></div>
        </div>
        <h3 className="my-4 text-3xl leading-tight">Keep Solving!</h3>
        <button
          onClick={() => navigate('/signup')}
          className="mx-auto lg:mx-0 hover:underline bg-white text-black font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          Join Us.
        </button>
      </section>
      <footer className="bg-black">
        <div className="container mx-auto px-8">
          <div className="w-full flex flex-col md:flex-row py-6">
            {/* Logo Section */}
            <div className="flex items-center mb-6 md:mb-0 md:w-1/4 text-black md:pr-10 md:pl-0">
              <svg
                width="50px"
                height="50px"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z"
                  fill="#ffffff"
                />
              </svg>
              <a
                className="text-white no-underline hover:no-underline font-bold text-2xl lg:text-1xl ml-2"
                href="#"
              >
                Artificial Teaching Assistant
              </a>
            </div>

            {/* Legal Section */}
            <div className="flex-1 md:w-1/4">
              <p className="uppercase text-white md:mb-6">Legal</p>
              <ul className="list-reset mb-6">
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    Terms
                  </a>
                </li>
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Section */}
            <div className="flex-1 md:w-1/4">
              <p className="uppercase text-white md:mb-6">Social</p>
              <ul className="list-reset mb-6">
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    LinkedIn
                  </a>
                </li>
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="flex-1 md:w-1/4">
              <p className="uppercase text-white md:mb-6">Company</p>
              <ul className="list-reset mb-6">
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    Official Blog
                  </a>
                </li>
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    About Us
                  </a>
                </li>
                <li className="mt-2 inline-block mr-2 md:block md:mr-0">
                  <a
                    href="#"
                    className="no-underline hover:underline text-white hover:text-pink-500"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Landing;
