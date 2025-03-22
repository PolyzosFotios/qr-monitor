import { icons } from "./icons";
import styles from "./header.module.css"

function Header() {
  return (
    <div className={styles.header}>
      <img src={icons.logo} alt="logo" className={styles.header_logo}></img>
    </div>
  );
}

export default Header;
