import {useLocation} from 'react-router-dom';

import Footer from './components/Footer';
import GlobalConnectWalletModal from './GlobalConnectWalletModal';
import Head from './Head';
import Header from './components/Header';
import Routes from './Routes';

type AppProps = {
  /**
   * Optionally provide a component to render for the main content.
   */
  renderMainContent?: () => React.ReactNode;
};

export default function App(props?: AppProps) {
  /**
   * Their hooks
   */

  const {pathname} = useLocation();

  /**
   * Variables
   */


  /**
   * Render
   */

  return (
    <>
      {/* HTML `<head>` (react-helmet) */}
      <Head />

      {/* CONTENT */}

        <Routes />
    

      {/* GLOBAL MODALS */}
      <GlobalConnectWalletModal />
    </>
  );
}
