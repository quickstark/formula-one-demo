exports.handler = async (event, context) => {
  console.log(event);

  let tLap = setInterval(testInterval, 1000);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Test Successful" }),
  };
};

function testInterval() {
  console.log("I'm running");
}
