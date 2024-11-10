import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BatchDetail } from 'src/sections/batchdetail/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <BatchDetail />
    </>
  );
}
