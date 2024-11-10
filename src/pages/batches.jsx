import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BatchView } from 'src/sections/batches/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <BatchView />
    </>
  );
}
