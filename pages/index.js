import React, { useEffect, useState } from "react";
// import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { raceResults } from "lib/raceresults";

import {
  Table as AntTable,
  Switch as AntSwitch,
  Slider as AntSlider,
  Divider as AntDivider,
} from "antd";

// import { ClockCircleOutlined } from "@ant-design/icons";

import Head from "next/head";
import Header from "@components/Header";
import Footer from "@components/Footer";
import SpeedCell from "@components/SpeedCell";
import LapCell from "@components/LapCell";
// configureAbly({
//   key: "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono",
//   clientId: "dirk",
// });

const marks = {
  200: "200ms",
  2000: "2s",
  5000: "5s",
  10000: "10s",
};

export default function Main() {
  const [tableData, setTableData] = useState([]);
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
    // fetch Ably channels
    // fetch(`http://ergast.com/api/f1/current/last/results.json`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data.MRData.RaceTable.Races[0].Results);
    //     setTableData(data.MRData.RaceTable.Races[0].Results);
    //     setLoading(false)
    //   }); //set loading if no data
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
      dataIndex: "driverid",
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
      render: (text, record) => <LapCell record={record} />,
    },
    {
      title: "Live Speed",
      dataIndex: "livespeed",
      align: "center",
      render: (text, record) => <SpeedCell record={record} />,
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
      Live Speed Polling Interval
      <AntSlider
        min={200}
        max={10000}
        marks={marks}
        step={100}
        defaultValue={pollingInt}
        onAfterChange={handlePollingInt}
      />
      <AntSwitch
        defaultChecked={false}
        checkedChildren="Polling"
        unCheckedChildren="Not Polling"
        onChange={handlePolling}
      />
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
