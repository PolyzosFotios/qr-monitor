import styles from "./banner.module.css";

function Banner() {
  return (
    <div className={styles.banner}>
      <div className={styles.banner_title}>
        Think. Create.
        <p className={styles.banner_tr_bl}>
          Track<span className={styles.blink_}>_</span>
        </p>
      </div>
      <p className={styles.banner_tr_bl}>
        <strong>For Free.</strong>
      </p>
      <p className={styles.sub_title}>
        — Bring your ideas to people with a QR code!
        <br />
        Track its performance effortlessly and for free —
      </p>
    </div>
  );
}

export default Banner;
