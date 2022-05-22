import React, { useEffect, useState } from "react";
import {
  Switch as AntSwitch,
  InputNumber as AntInputNumber,
  Statistic as AntStatistic,
  Card as AntCard,
  Space as AntSpace,
  Divider as AntDivider,
  Slider as AntSlider
} from "antd";

import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

var Ably = require("ably");

const ably = new Ably.Realtime(
  "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono"
);
ably.connection.on("connected", () => {
  console.log("Connected to Ably!");
});

// Subscribe to Ably
const channel = ably.channels.get("drivetime");

const increments = {
  200: '200ms',
  500: '500ms',
  1000: '1s',
  2000: '2s',
  5000: '5s'
};

export default function FlowExec() {
  const [intervalID, setIntervalID] = useState();
  const [pollingState, setPollingState] = useState(false);
  const [pollingInt, setPollingInt] = useState(5000);
  const [driveTime, setDriveTime] = useState();

  // Let's turn on or off the Polling based on persisted State
  useEffect(() => {
    if (pollingState) {
      console.log(`***** Polling Every ${pollingInt} Miliseconds *****`);
      let poller = setInterval(getDriveTime, pollingInt, 0, 250);
      setIntervalID(poller); //save Poller ID to State to allow us to clear it later
    } else {
      console.log(`***** Polling Ended *****`);
      clearInterval(intervalID);
    }
    // eslint-disable-next-line
  }, [pollingState]);

  function getDriveTime(min, max) {
    let rando = Math.random() * (max - min) + min;
    let msg = { payload: rando.toFixed(2) };
    channel.publish("drivetime", msg);
    setDriveTime(rando);
  }

  function handlePolling(e) {
    setPollingState(!pollingState);
  }

  function handlePollingInt(e) {
    setPollingInt(e);
  }

  return (
    <div className="container">
      <Head>
        <title>Speed Control</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <span style={{ margin: "15px" }}>Polling Interval</span>
      <AntInputNumber
        min={100}
        max={10000}
        defaultValue={5000}
        style={{ width: "100px", margin: "0 2px" }}
        onChange={handlePollingInt}
      />
      <AntDivider></AntDivider>
      <span style={{ margin: "0 15px 0 0" }}> Milliseconds</span>
      <AntSwitch
        defaultChecked={false}
        checkedChildren="Polling"
        unCheckedChildren="Not Polling"
        onChange={handlePolling}
      />
      <AntCard>
        <AntStatistic
          title={pollingState}
          value={driveTime}
          precision={2}
          valueStyle={{ color: "#cf1322" }}
        />
      </AntCard>
    </div>
  );
}
