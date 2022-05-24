import React, { useState } from "react";
import propTypes from "prop-types";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { Badge as AntBadge } from "antd";

configureAbly({
  key: "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono",
  clientId: "dirk",
});

export default function SpeedCell({ record, setMessageCount }) {
  const [speed, setSpeed] = useState(0);
  const [count, setCount] = useState(0);

  console.log(`SpeedCell Props: ${record.position}`);

  useChannel(`[?rewind=1]speed-${record.position}`, (message) => {
    console.log(message.data);
    setMessageCount((prevState) => {
      return prevState + 1;
    });
    setCount((prevState) => {
      return prevState + 1;
    });
    setSpeed(message.data.livespeed);
  });

  return (
    <span>
      {speed}
      <AntBadge
        count={count}
        style={{ backgroundColor: "#1E90FF", marginLeft: ".25rem" }}
      />
    </span>
  );
}

SpeedCell.propTypes = {
  record: propTypes.object,
  setMessageCount: propTypes.func,
};
