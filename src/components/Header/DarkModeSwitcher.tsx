import { useEffect, useState } from 'react';

const DarkModeSwitcher = ({ mode }) => {
  const [colorMode, setColorMode] = useState(false);

  useEffect(() => {
    // Set color mode based on the `mode` prop when the component mounts
    if (typeof setColorMode === 'function') {
      setColorMode(mode ? 'dark' : 'light');
    }
  }, [mode, setColorMode]);

  return (
    <li>
      <label
        className={`relative m-0 block h-7.5 w-14 rounded-full ${colorMode === 'dark' ? 'bg-primary' : 'bg-stroke'
          }`}
      >
        <input
          type="checkbox"
          checked={colorMode === 'dark'}
          onChange={() => {
            // Toggle between dark and light mode based on current mode
            setColorMode(colorMode === 'dark' ? 'light' : 'dark');
          }}
          className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${colorMode === 'dark' && '!right-[3px] !translate-x-full'
            }`}
        >
          <span className="dark:hidden">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99992 12.6666C10.5772 12.6666 12.6666 10.5772 12.6666 7.99992C12.6666 5.42259 10.5772 3.33325 7.99992 3.33325C5.42259 3.33325 3.33325 5.42259 3.33325 7.99992C3.33325 10.5772 5.42259 12.6666 7.99992 12.6666Z"
                fill="#969AA1"
              />
              <path
                d="M8.00008 15.3067C7.63341 15.3067 7.33342 15.0334 7.33342 14.6667V14.6134C7.33342 14.2467 7.63341 13.9467 8.00008 13.9467C8.36675 13.9467 8.66675 14.2467 8.66675 14.6134C8.66675 14.9801 8.36675 15.3067 8.00008 15.3067ZM12.7601 13.4267C12.5867 13.4267 12.4201 13.3601 12.2867 13.2334L12.2001 13.1467C11.9401 12.8867 11.9401 12.4667 12.2001 12.2067C12.4601 11.9467 12.8801 11.9467 13.1401 12.2067L13.2267 12.2934C13.4867 12.5534 13.4867 12.9734 13.2267 13.2334C13.1001 13.3601 12.9334 13.4267 12.7601 13.4267ZM3.24008 13.4267C3.06675 13.4267 2.90008 13.3601 2.76675 13.2334C2.50675 12.9734 2.50675 12.5534 2.76675 12.2934L2.85342 12.2067C3.11342 11.9467 3.53341 11.9467 3.79341 12.2067C4.05341 12.4667 4.05341 12.8867 3.79341 13.1467L3.70675 13.2334C3.58008 13.3601 3.40675 13.4267 3.24008 13.4267ZM14.6667 8.66675H14.6134C14.2467 8.66675 13.9467 8.36675 13.9467 8.00008C13.9467 7.63341 14.2467 7.33342 14.6134 7.33342C14.9801 7.33342 15.3067 7.63341 15.3067 8.00008C15.3067 8.36675 15.0334 8.66675 14.6667 8.66675ZM1.38675 8.66675H1.33341C0.966748 8.66675 0.666748 8.36675 0.666748 8.00008C0.666748 7.63341 0.966748 7.33342 1.33341 7.33342C1.70008 7.33342 2.02675 7.63341 2.02675 8.00008C2.02675 8.36675 1.75341 8.66675 1.38675 8.66675ZM12.6734 3.99341C12.5001 3.99341 12.3334 3.92675 12.2001 3.80008C11.9401 3.54008 11.9401 3.12008 12.2001 2.86008L12.2867 2.77341C12.5467 2.51341 12.9667 2.51341 13.2267 2.77341C13.4867 3.03341 13.4867 3.45341 13.2267 3.71341L13.1401 3.80008C13.0134 3.92675 12.8467 3.99341 12.6734 3.99341ZM3.32675 3.99341C3.15341 3.99341 2.98675 3.92675 2.85342 3.80008L2.76675 3.70675C2.50675 3.44675 2.50675 3.02675 2.76675 2.76675C3.02675 2.50675 3.44675 2.50675 3.70675 2.76675L3.79341 2.85342C4.05341 3.11342 4.05341 3.53341 3.79341 3.79341C3.66675 3.92675 3.49341 3.99341 3.32675 3.99341ZM8.00008 2.02675C7.63341 2.02675 7.33342 1.75341 7.33342 1.38675V1.33341C7.33342 0.966748 7.63341 0.666748 8.00008 0.666748C8.36675 0.666748 8.66675 0.966748 8.66675 1.33341C8.66675 1.70008 8.36675 2.02675 8.00008 2.02675Z"
                fill="#969AA1"
              />
            </svg>
          </span>
          <span className="hidden dark:inline-block">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.3533 10.62C14.2466 10.44 13.9466 10.16 13.1999 10.2933C12.7866 10.3667 12.3666 10.4 11.9466 10.38C10.5133 10.3067 9.29992 9.72 8.40659 8.66C7.49992 7.58667 7.01326 6.25333 7.02659 4.82667C7.03992 4.41333 7.06659 4 7.11992 3.6C7.17992 3.14667 6.98659 2.82667 6.84659 2.67333C6.57326 2.38 6.33326 2.26 6.11992 2.2C5.99992 2.16667 5.87992 2.15333 5.76659 2.15333C5.63326 2.15333 5.51992 2.18 5.42659 2.21333C5.33992 2.24667 5.25326 2.29333 5.17992 2.34667C4.99992 2.46667 4.81992 2.6 4.65992 2.75333C3.88659 3.52667 3.27326 4.45333 2.84659 5.49333C2.39992 6.56667 2.15992 7.7 2.14659 8.86C2.12659 10.1667 2.48659 11.3733 3.21326 12.4467C3.99992 13.58 5.05326 14.3933 6.31992 14.8467C6.99992 15.1067 7.71992 15.24 8.47992 15.24H8.49326C9.77326 15.24 10.9866 14.86 12.0733 14.1333C12.4599 13.8667 12.7933 13.54 13.0999 13.1867C13.5866 12.5867 13.9733 11.8867 14.2466 11.0933C14.3266 10.8667 14.3933 10.64 14.4399 10.4133C14.4733 10.28 14.4599 10.1467 14.4266 10.02C14.3999 9.92 14.3799 9.84 14.3533 10.62Z"
                fill="#969AA1"
              />
            </svg>
          </span>
        </span>
      </label>
    </li>
  );
};

export default DarkModeSwitcher;
