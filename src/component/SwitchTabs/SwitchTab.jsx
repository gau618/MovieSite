import React, { useState, useEffect } from "react";
import "./SwitchTab.scss";

const SwitchTab = ({ data = [], onTabChange = () => {} }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    const tabWidth = window.innerWidth > 768 ? 100 : 70;
    setLeft(selectedTab * tabWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const activeTab = (tab, index) => {
    // Safeguard against empty `data` array
    if (!data.length) return;

    // Dynamically adjust the `left` position based on screen size
    const tabWidth = screenSize > 768 ? 100 : 70;
    setLeft(index * tabWidth);

    // Safeguard for `onTabChange`
    if (typeof onTabChange === "function") {
      onTabChange(tab, index);
    }

    // Set selected tab after delay for smoother animation
    setTimeout(() => {
      setSelectedTab(index);
    }, 300);
  };

  return (
    <div className="switchingTabs">
      <div className="tabItems">
        {data.map((tab, index) => (
          <span
            key={index}
            className={`tabItem ${selectedTab === index ? "activeted" : ""}`}
            onClick={() => activeTab(tab, index)}
          >
            {tab}
          </span>
        ))}
        <span
          className="movingBg"
          style={{ left, width: screenSize > 768 ? "100px" : "70px" }}
        ></span>
      </div>
    </div>
  );
};

export default SwitchTab;
