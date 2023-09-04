import AWS from "aws-sdk";

// Set your AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.FP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.FP_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ec2 = new AWS.EC2();

const getInstanceIDsByTagName = async () => {
  const tagName = "ZoomBot";

  const params = {
    Filters: [
      {
        Name: "tag:Name",
        Values: [tagName],
      },
    ],
  };
  try {
    const data = await ec2.describeInstances(params).promise();
    const instanceIds = [];
    for (const reservation of data.Reservations) {
      for (const instance of reservation.Instances) {
        instanceIds.push({
          id: instance.InstanceId,
          state: instance.State.Name,
        });
      }
    }
    return instanceIds;
  } catch (err) {
    console.error("Error:", err);
    return [];
  }
};

const instancesResponse = (instances) => {
  let running = 0;
  let stopped = 0;
  let stopping = 0;
  let pending = 0;
  for (let i = 0; i < instances.length; i++) {
    if (instances[i].state === "running") running = running + 1;
    if (instances[i].state === "stopped") stopped = stopped + 1;
    if (instances[i].state === "stopping") stopping = stopping + 1;
    if (instances[i].state === "pending") pending = pending + 1;
  }
  return {
    instances: {
      total: running + stopped + stopping + pending,
      running,
      stopped,
      stopping,
      pending,
    },
  };
};

export { getInstanceIDsByTagName, instancesResponse };
