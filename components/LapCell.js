import React, { useState } from "react";
import propTypes from "prop-types";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { Badge as AntBadge } from "antd";

configureAbly({
  key: "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono",
  clientId: "dirk",
});

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  //ES6 interpolated literals/template literals
  //If seconds is less than 10 put a zero in front.
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
export default function LapCell({ record, setMessageCount }) {
  const [lap, setLap] = useState(0);
  const [count, setCount] = useState(0);

  console.log(`Lap Cell Position: ${record.position}`);

  useChannel(`[?rewind=1]lap-${record.position}`, (message) => {
    console.log(message.data);
    setLap((prevState) => {
      return prevState + parseInt(message.data.livelap);
    });
    setMessageCount((prevState) => {
      return prevState + 1;
    });
    setCount((prevState) => {
      return prevState + 1;
    });
  });

  console.log(millisToMinutesAndSeconds(lap));

  return (
    <span>
      {millisToMinutesAndSeconds(lap)}
      <AntBadge
        count={count}
        overflowCount={1000}
        style={{ backgroundColor: "#1E90FF", marginLeft: ".25rem" }}
      />
    </span>
  );
}

LapCell.propTypes = {
  record: propTypes.object,
  setMessageCount: propTypes.func,
};
