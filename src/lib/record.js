const baseURL = 'https://api.agora.io/v1/apps/';
const authHeader = {
  'Authorization': 'Basic ' + btoa('1d9f559f0e2346a8849ba2c2ef35a860:6568e86b523343dcb64797bb8469b58a'),
  'Content-Type': 'application/json',
};

// Function to stop recording
const stopRecording = async (appid, resourceId, channel, uid, sid) => {
  const url = `${baseURL}${appid}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;
  const body = JSON.stringify({
    cname: channel,
    uid: uid.toString(),
    clientRequest: {async_stop: true},
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: authHeader,
      body: body
    });
    return await response.json();
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
};

const downloadRecord = async (channelName, sID, user_id, guest_id) => {
  try {
    const response = await fetch('https://krmedi.vn/api/download-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ channelName, sID, user_id, guest_id })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Download successfully');
    } else {
      console.log(`Download failed: ${data.error}`);
    }
  } catch (error) {
    console.log(`Download failed: ${error.message}`);
  }
};

export {stopRecording, downloadRecord};

