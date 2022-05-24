import React, { useEffect, useState } from "react";
import { raceResults } from "lib/raceresults";

import {
  Table as AntTable,
  Switch as AntSwitch,
  Slider as AntSlider,
  Divider as AntDivider,
  Checkbox as AntCheckbox,
  Badge as AntBadge,
  Space as AntSpace,
} from "antd";

import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import SpeedCell from "@components/SpeedCell";
import LapCell from "@components/LapCell";

const marks = {
  200: "200ms",
  2000: "2s",
  5000: "5s",
  10000: "10s",
};

export default function Main() {
  const [tableData, setTableData] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pollingState, setPollingState] = useState(false);
  const [pollingInt, setPollingInt] = useState(2000);

  console.log(tableData);

  useEffect(() => {
    const fetchData = async () => {
      await setTableData(raceResults);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Let's turn on or off the Polling based on persisted State
  useEffect(() => {
    let body = {
      action: pollingState ? "start" : "stop",
      interval: pollingState ? pollingInt : 0,
    };
    if (pollingState) {
      console.log(`***** Request Pub every ${pollingInt} Miliseconds *****`);
    } else {
      console.log(`***** Request to End Pub *****`);
    }
    fetch(`/drivetime`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    // eslint - disable - next - line;
  }, [pollingState, pollingInt]);

  function handlePolling() {
    setPollingState(!pollingState);
  }

  function handlePollingInt(e) {
    setPollingInt(e);
  }

  function handleDriverPolling(status, record, e) {
    console.log(e);
    let newtableData = tableData.map((row) => {
      if (row.driverid == record.driverid) {
        return { ...row, driverispolling: e.target.checked };
      } else return row;
    });
    setTableData(newtableData);
  }

  // Define Ant Table Colums matching the Twilio JSON response
  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      align: "center",
    },
    {
      title: "Driver",
      dataIndex: "name",
    },
    {
      title: "Avg Speed",
      dataIndex: "speed",
      align: "center",
    },
    {
      title: "Live Lap Time",
      dataIndex: "livelap",
      align: "center",
      render: (text, record) =>
        record.driverispolling ? (
          <LapCell record={record} setMessageCount={setMessageCount} />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Live Speed",
      dataIndex: "livespeed",
      align: "center",
      render: (text, record) =>
        record.driverispolling ? (
          <SpeedCell record={record} setMessageCount={setMessageCount} />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Polling",
      dataIndex: "driverispolling",
      align: "center",
      render: (text, record, index) => (
        <AntCheckbox
          checked={text}
          onChange={(e) => handleDriverPolling("active", record, e)}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <Head>
        <title>Drivetime</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Driver Speed" />
      <p className="description">
        Hosted @<code>netlify</code>
      </p>
      <AntDivider></AntDivider>
      Polling Interval
      <AntSlider
        min={200}
        max={10000}
        marks={marks}
        step={100}
        defaultValue={pollingInt}
        onAfterChange={handlePollingInt}
      />
      <div className="antswitchrow">
        <AntSwitch
          defaultChecked={false}
          checkedChildren="Polling"
          unCheckedChildren="Not Polling"
          onChange={handlePolling}
          style={{ marginRight: "1rem" }}
        />
        <span>Received</span>
        <AntBadge
          count={messageCount}
          style={{ backgroundColor: "#1E90FF", marginLeft: ".25rem" }}
        />
      </div>
      <AntDivider></AntDivider>
      <AntTable
        loading={loading}
        rowKey={"position"}
        columns={columns}
        dataSource={tableData}
        showHeader={true}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSize: 20,
          pageSizeOptions: ["10", "20", "50", "100", "200"],
        }}
      />
      <Footer />
    </div>
  );
}
