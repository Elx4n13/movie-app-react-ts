import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Spinner } from "../components/spinner/spinner";
import Navbar from "../components/navbar/navbar";
import styles from './layout.module.scss'
const RootLayout = () => {
  console.log('ee')
  return (
    
      <div className={styles.container}>
    <Suspense fallback={<Spinner page />}>
      <div className={styles.content}>

      <Navbar />
      <Outlet />
      </div>
    </Suspense>
    </div>
  );
};

export default RootLayout;
