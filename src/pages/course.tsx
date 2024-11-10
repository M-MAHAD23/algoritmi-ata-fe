import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CourseView } from 'src/sections/course/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <CourseView />
    </>
  );
}
