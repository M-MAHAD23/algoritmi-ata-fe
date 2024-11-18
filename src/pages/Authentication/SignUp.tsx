import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import Vector from '../../images/vector/vector.svg';
import { useSignUp } from '../../hooks/hooks';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Loader from '../../common/Loader';


const SignUp: React.FC = () => {

  const { signUp, loading, error } = useSignUp(); // Destructure signIn, isLoading, and error from useSignIn
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [validError, setValidError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for toggling password visibility
  const navigate = useNavigate(); // Initialize navigate

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate password (minimum 6 characters, at least one uppercase letter)
  const validatePassword = (password: string) => {
    const passwordRegex = /^.{6,}$/; // 6+ characters
    return passwordRegex.test(password);
  };

  // Validate password (minimum 6 characters, at least one uppercase letter)
  const validateValid = (valid: string) => {
    if (valid === password) return true;
  };

  // Handle form field changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Regular expression for pattern like "20-3822"
    const pattern = /^\d{2}-\d{4}$/;

    // Update the name state regardless of the format
    setName(value);

    // Check if the value matches the pattern
    if (pattern.test(value)) {
      setNameError('');
    } else {
      setNameError('Invalid name format. Please use the format XX-XXXX');
    }
  };

  // Handle form field changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError('Password?');
    } else {
      setPasswordError('');
    }
  };

  const handleValidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValid(value);
    if (!validateValid(value)) {
      setValidError('Password should be same.');
    } else {
      setValidError('');
    }
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    let response;

    try {
      response = await signUp(name, email, password); // Assuming signUp is a function for signup
      const { userInfo, token } = response;;

      // Store userInfo and token in localStorage
      localStorage.clear();
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('token', token);
      toast.success('Sign Up Successful.');
      setTimeout(() => {
        navigate('/profile'); // Navigate to the profile page on successful signup
      }, 700);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Batch is not enable anymore.');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
      else if (error.response && error.response.status === 403) {
        toast.error('Already Registerd Please Sign In');
        setTimeout(() => {
          navigate('/signin');
        }, 1000);
      }
      else if (error.response && error.response.status === 404) {
        toast.error('Contact Admin, User not found.');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
      else {
        console.error('Error during sign-up', error);
        toast.error(response?.response?.data?.message);
      }
    }
  };


  return (
    <>
      {loading && <Loader />}
      <Toaster />
      {/* <Breadcrumb pageName="Sign Up" /> */}

      <div className="bg-black flex items-center justify-center min-h-screen">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="py-17.5 px-26 text-center">
                <div className="pl-4 flex items-center">
                  <svg width="50px" height="50px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16L3.54223 12.3383C1.93278 11.0162 1 9.04287 1 6.96005C1 3.11612 4.15607 0 8 0C11.8439 0 15 3.11612 15 6.96005C15 9.04287 14.0672 11.0162 12.4578 12.3383L8 16ZM3 6H5C6.10457 6 7 6.89543 7 8V9L3 7.5V6ZM11 6C9.89543 6 9 6.89543 9 8V9L13 7.5V6H11Z" fill="#000000" />
                  </svg>
                  <a className="toggleColour text-black no-underline hover:no-underline font-bold text-1xl lg:text-3xl" href="/">
                    Artificial Teaching Assistant
                  </a>
                </div>
                <p className="2xl:px-20">
                  Unlock your full potential with the guidance of our Artificial Teaching Assistant. Sign up now!
                </p>

                <span className="mt-15 inline-block">
                  <img src={Vector} alt="SVG Image" />

                </span>
              </div>
            </div>

            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Sign Up to ATA
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Roll-Id
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your Roll-Id"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M11.0008 9.52185C13.5445 9.52185 15.607 7.5281 15.607 5.0531C15.607 2.5781 13.5445 0.584351 11.0008 0.584351C8.45703 0.584351 6.39453 2.5781 6.39453 5.0531C6.39453 7.5281 8.45703 9.52185 11.0008 9.52185ZM11.0008 2.1656C12.6852 2.1656 14.0602 3.47185 14.0602 5.08748C14.0602 6.7031 12.6852 8.00935 11.0008 8.00935C9.31641 8.00935 7.94141 6.7031 7.94141 5.08748C7.94141 3.47185 9.31641 2.1656 11.0008 2.1656Z"
                              fill=""
                            />
                            <path
                              d="M13.2352 11.0687H8.76641C5.08828 11.0687 2.09766 14.0937 2.09766 17.7719V20.625C2.09766 21.0375 2.44141 21.4156 2.88828 21.4156C3.33516 21.4156 3.67891 21.0719 3.67891 20.625V17.7719C3.67891 14.9531 5.98203 12.6156 8.83516 12.6156H13.2695C16.0883 12.6156 18.4258 14.9187 18.4258 17.7719V20.625C18.4258 21.0375 18.7695 21.4156 19.2164 21.4156C19.6633 21.4156 20.007 21.0719 20.007 20.625V17.7719C19.9039 14.0937 16.9133 11.0687 13.2352 11.0687Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      {nameError && (
                        <p className="text-red-500 text-sm">{nameError}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      {emailError && (
                        <p className="text-red-500 text-sm">{emailError}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="6+ Characters, 1 Capital letter"
                        value={password}
                        onChange={handlePasswordChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span
                        className="absolute right-4 top-4 cursor-pointer"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M11 0.75C13.6234 0.75 15.75 2.87662 15.75 5.5V7H16.75C18.2688 7 19.5 8.23122 19.5 9.75V17.25C19.5 18.7688 18.2688 20 16.75 20H5.25C3.73122 20 2.5 18.7688 2.5 17.25V9.75C2.5 8.23122 3.73122 7 5.25 7H7.5V5.5C7.5 2.87662 9.62662 0.75 12.25 0.75H11ZM14.25 7V5.5C14.25 3.73122 12.7688 2.25 11 2.25C9.23122 2.25 7.75 3.73122 7.75 5.5V7H5.25C4.42157 7 3.75 7.67157 3.75 8.5V17.25C3.75 18.0784 4.42157 18.75 5.25 18.75H16.75C17.5784 18.75 18.25 18.0784 18.25 17.25V8.5C18.25 7.67157 17.5784 7 16.75 7H14.25ZM10.5 11C11.0523 11 11.5 11.4477 11.5 12V15.5C11.5 16.0523 11.0523 16.5 10.5 16.5C9.94772 16.5 9.5 16.0523 9.5 15.5V12C9.5 11.4477 9.94772 11 10.5 11Z"
                              fill=""
                            />
                          </g>
                        </svg> :
                          <svg
                            className="fill-current"
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.5">
                              <path
                                d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                fill=""
                              />
                              <path
                                d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                fill=""
                              />
                            </g>
                          </svg>

                        }
                      </span>
                      {passwordError && (
                        <p className="text-red-500 text-sm">{passwordError}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Re-type Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Re-enter your password"
                        value={valid}
                        onChange={handleValidChange}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <span className="absolute right-4 top-4">
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.5">
                            <path
                              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                              fill=""
                            />
                            <path
                              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      </span>
                      {validError && (
                        <p className="text-red-500 text-sm">{validError}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-5">
                    <input
                      type="submit"
                      value={isLoading ? 'Signing Up...' : 'Sign Up'}
                      disabled={isLoading || !name || !email || !password || !valid || nameError || emailError || passwordError || validError}
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <p>
                      Already have an account?{' '}
                      <Link to="/signin" className="text-primary">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
