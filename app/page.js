import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header";
import Banner from "./components/banner";
import Tabs from "./components/tabs";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Header />
        <Banner />
        <Tabs />
      </main>
      <Footer />
    </div>
  );
}
