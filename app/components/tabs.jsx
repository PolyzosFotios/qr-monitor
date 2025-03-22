"use client";

import { useState } from "react";
import styles from "./tabs.module.css";
import qr from "qrcode";
import { icons } from "./icons";

function Tabs() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [qrId, setQrId] = useState("");
  const [scanData, setScanData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateQR = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);

    try {
      const response = await fetch("/api/generateqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to generate QR code");

      const data = await response.json();
      setQrId(data.id_private);
      setQrCode(data.qrCodeUrl);

      setMessage("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setMessage("Error generating QR code.");
    }
  };

  const fetchStats = async (e) => {
    e.preventDefault();
    if (!qrId) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/stats?id=${qrId}`);

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();

      if (data.id === "0") {
        setMessage("Unfortunately, no QR Code is associated with this ID.");
        setScanData(null);
      } else {
        setScanData(data);
        setMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching QR stats.");
    }
  };

  function decodeScans(scans) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    scans = scans.slice(0, -1); //remove last ","
    const scanEntries = scans.split(",");
    // [ "2024.1:3", "2024.2:8" ]
    const r = scanEntries.length;
    const c = 3;

    const allScans = Array.from({ length: r }, () => Array(c).fill(0));

    for (let i = 0; i < r; i++) {
      const arrayInfo = scanEntries[i].split(":");
      const arrayDateInfo = arrayInfo[0].split(".");
      allScans[i][0] = arrayDateInfo[0];
      allScans[i][1] = months[parseInt(arrayDateInfo[1])];
      allScans[i][2] = arrayInfo[1];
      console.log;
    }
    return allScans.reverse();
  }

  function ListMonthsDiv(wantedscans) {
    console.log(wantedscans[0]);

    return (
      <div>
        <div className={styles.scans_div}>
          {wantedscans.map((scan, i) => (
            <div key={i} className={styles.div_full_line}>
              <div className={styles.box}></div>
              <div className={styles.scan_month_line}>
                <div>
                  <h4>{scan[1]}</h4>
                  <p>{scan[0]}</p>
                </div>
                <div>
                  <strong>{scan[2]}</strong> views.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.tabs_cont}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "tab1" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("tab1")}
          >
            Create QR Code
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "tab2" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("tab2")}
          >
            Track QR Code
          </button>
        </div>
      </div>

      <div className={styles.tab_content}>
        <div
          className={`${styles.content} ${
            activeTab === "tab1" ? styles.active : ""
          }`}
        >
          <form onSubmit={generateQR} className={styles.form}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="E.g. https://example.com/"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Create
            </button>
          </form>

          {message && <p>{message}</p>}

          {loading && <div className={styles.spinner}></div>}

          {qrCode && (
            <div className={styles.qr_info_container}>
              <div className={styles.col_left}>
                <img
                  src={qrCode}
                  alt="Generated QR Code"
                  className={styles.img_container}
                />
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = qrCode;
                    link.download = "qr_code.png";
                    link.click();
                  }}
                  className={styles.button}
                >
                  <div className={styles.button_line}>
                    <img
                      src={icons.download}
                      alt="copy"
                      className={styles.button_icon}
                    />
                    <p>Download .png</p>
                  </div>
                </button>
              </div>
              <div className={styles.col_right}>
                <p className={styles.text_small}>The ID of your QR Code is</p>
                <p className={styles.text_id}>{qrId}</p>
                <button
                  onClick={() => {navigator.clipboard.writeText(qrId); setCopied(true);} }
                  className={styles.button}
                >
                  <div className={styles.button_line}>
                    <img
                      src={icons.copy}
                      alt="copy"
                      className={styles.button_icon}
                    />
                    <p>Copy ID</p>
                  </div>
                </button>
                <div className={styles.copied}>{copied && <p>Copied! ✓</p>}</div>
                
                <p className={styles.text_small_grey}>
                  We recommend saving this ID so you can track the process of QR
                  Code views whenever you wish.
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className={`${styles.content} ${
            activeTab === "tab2" ? styles.active : ""
          }`}
        >
          <form onSubmit={fetchStats} className={styles.form}>
            <input
              type="text"
              value={qrId}
              onChange={(e) => setQrId(e.target.value)}
              placeholder="Add your QR code ID"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Track
            </button>
          </form>

          {loading && <div className={styles.spinner}></div>}

          {scanData && (
            <a href={scanData.url} target="_blank" rel="noopener noreferrer">
              <div className={styles.div_full_line}>
                <div className={styles.box_url}></div>
                <div className={styles.scan_month_line}>
                  <div className={styles.url_text}>{scanData.url}</div>
                  <img src={icons.link} alt="link" />
                </div>
              </div>{" "}
            </a>
          )}

          <br />

          {scanData && (
            <div className={styles.stats_container}>
              {ListMonthsDiv(decodeScans(scanData.scans))}
              <br />
              <p className={styles.text_small_grey}>
                QR Code was created at:{" "}
                {new Date(scanData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tabs;
