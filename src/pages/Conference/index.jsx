import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import Host from "./Host";
import Participant from "./Participant";
import MediaPlayer from "../../components/MediaPlayer";
import useAgora from "../../hooks/useAgora";
import { APP_ID } from "../../lib/config";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { IconButton, Modal, Button } from "@material-ui/core";
import SwitchCameraIcon from '@material-ui/icons/SwitchCamera';
import CallIcon from "@material-ui/icons/Call";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import queryString from "query-string";
import UserPrescriptionModal from "./UserPrescriptionModal";
import DoctorPrescriptionModal from "./DoctorPrescriptionModal";
//API
import { checkUserRoleById } from "../../lib/api";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const Conference = (props) => {
  const query       = queryString.parse(window?.location?.search);
  const appid       = APP_ID || null;                                           //Agora app id
  const token       = query?.token ? query.token.split(' ').join('+') : null;   //Agora token
  const channel     = query?.channel || null;                                   //Agora channel
  const user_id     = query?.user_id || 0;                                      //Current user
  const guest_id    = query?.guest_id || 0;                                     //Remote user
  const {
    remoteUsers,
    join,
    leave,
    localAudioTrack,
    localVideoTrack,
    removeLocalVideoTracks,
    removeLocalAudioTracks,
    joinLocalVideoTrack,
    joinLocalAudioTrack,
  } = useAgora(client);
  const [isDoctor, setIsDoctor] = useState(false);
  const [localMedia, setLocalMedia] = useState({ audio: false, video: false });
  const [gridSize, setGridSize] = useState(() =>
    calculateGridSize(remoteUsers)
  );

  const [modalPatientOpen, setModalPatientOpen] = useState(false);
  const [modalDoctorOpen, setModalDoctorOpen] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  React.useEffect(() => {
    const options = { ...localMedia };
    join(
      appid,
      channel,
      token,
      user_id,
      options
    ).then((res) => {
      console.log(res);
    });
  }, []);

  React.useEffect(() => {
    setGridSize(calculateGridSize(remoteUsers));
  }, [remoteUsers]);

  const handleAudioClick = () => {
    if (!localMedia.audio) {
      setLocalMedia((prev) => ({ ...prev, audio: true }));
      joinLocalAudioTrack();
    } else {
      removeLocalAudioTracks();
      setLocalMedia((prev) => ({ ...prev, audio: false }));
    }
  };

  //CHECK USER ROLE
  React.useEffect(() => {
    const fetchUserRoleById = async (user_id) => {
      try {
        const response = await checkUserRoleById(user_id);
        const isDoctor = response === 'DOCTORS';
        setIsDoctor(isDoctor);
      } catch (error) {
        console.error(error);
        // Handle error if needed
      }
    };

    if (user_id !== 0) {
      fetchUserRoleById(user_id);
    }
  }, []);
  
  React.useEffect(() => {
    const getVideoDevices = async () => {
      const devices = await AgoraRTC.getCameras();
      setVideoDevices(devices);
    };
    getVideoDevices();
  }, []);

  const handleVideoClick = () => {
    if (!localMedia.video) {
      setLocalMedia((prev) => ({ ...prev, video: true }));
      joinLocalVideoTrack();
    } else {
      removeLocalVideoTracks();
      setLocalMedia((prev) => ({ ...prev, video: false }));
    }
  };

  const handleVideoCam = async () => {
    if (videoDevices.length >= 1) {
      const nextDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
      const nextDevice = videoDevices[nextDeviceIndex];
      console.log(nextDevice);
      await localVideoTrack.setDevice(nextDevice.deviceId);
    
      setCurrentDeviceIndex(nextDeviceIndex);
    }
  };

  const handleDispose = () => {
    const confirmed = window.confirm("Are you sure you want to close the window?");
  
    if (confirmed) {
      leave();
      props?.setActiveWindow?.("chat");
      setLocalMedia({ video: false, audio: false });
      window.close();
    }
  };

  const handleModalPatientOpen = () => {
    setModalPatientOpen(true);
  };

  const handleModalPatientClose = () => {
    setModalPatientOpen(false);
  };

  const handleModalDoctorOpen = () => {
    setModalDoctorOpen(true);
  };

  const handleModalDoctorClose = () => {
    setModalDoctorOpen(false);
  };

  // Check if any of the query parameters is null
  const isQueryValid = appid !== null && token !== null && channel !== null && user_id !== 0 && guest_id !== 0;

  return isQueryValid ? (
    <React.Fragment>
      <div
        id="large_video_container"
        className="container row col-12 m-0 p-0 vh-100 vw-100 player-container d-flex justify-content-center"
      >
        <div className="d-flex flex-wrap remote-player-wrapper">
          {remoteUsers.map((user, index) => (
            <div
              id={`participant_grid_${index + 1}`}
              className="participant participant_grid border"
              key={user.uid}
            >
              <Participant
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
              />
            </div>
          ))}
          {!remoteUsers?.length && (
            <div className="empty_room d-flex align-items-center text-muted">
              <h2 className="empty_room_text">
                Bạn là người duy nhất trong phòng này!
              </h2>
            </div>
          )}
        </div>
        <div className="local-player-wrapper ml-auto">
          <Host
            client={client}
            localAudioTrack={localAudioTrack}
            localVideoTrack={localVideoTrack}
          />
        </div>
        <div className="controller_icons">
          {isDoctor ? (
            //Kê đơn
            <IconButton
              className="p-2 m-2"
              onClick={handleModalDoctorOpen}
              style={{ background: "#ADD8E6" }}
            >
              <LocalPharmacyIcon color="primary" style={{ color: "#fff" }} />
            </IconButton>
          ) : (
            //Nhận đơn
            <IconButton
              className="p-2 m-2"
              onClick={handleModalPatientOpen}
              style={{ background: "#FF0000" }}
            >
              <LocalHospitalIcon color="primary" style={{ color: "#fff" }} />
            </IconButton>
          )}
          <IconButton
            className="p-2 m-2"
            onClick={handleAudioClick}
            style={{ background: localMedia.audio ? "#4dcef7" : "#808080" }}
          >
            {localMedia.audio ? (
              <MicIcon color="primary" style={{ color: "#fff" }} />
            ) : (
              <MicOffIcon color="primary" style={{ color: "#fff" }} />
            )}
          </IconButton>
          <IconButton
            onClick={handleVideoClick}
            className="p-2 m-2"
            style={{ background: localMedia.video ? "#40ad40d9" : "#808080" }}
          >
            {localMedia.video ? (
              <VideocamIcon style={{ color: "#fff" }} />
            ) : (
              <VideocamOffIcon style={{ color: "#fff" }} />
            )}
          </IconButton>
          <IconButton 
            onClick={handleVideoCam}
            className="p-2 m-2"
            style={{ background: localMedia.video ? "#40ad40d9" : "#808080" }}
          > 
            <SwitchCameraIcon style={{ color: "#fff" }} />
          </IconButton>
          <IconButton
            disabled={remoteUsers.length < 1}
            onClick={handleDispose}
            className="p-2 m-2"
            style={{ background: remoteUsers.length < 1 ? "grey" : "red" }}
          >
            <CallEndIcon style={{ color: "#fff" }} />
          </IconButton>
        </div>
      </div>
      <style jsx>{`
        .local-player-wrapper {
          height: 150px;
          width: 150px;
          position: absolute;
          bottom: 0;
          right: 10px;
        }
        .remote-player-wrapper {
          height: calc(100vh - (70px + 40px + 60px));
          width: 100%;
          justify-content: center;
          overflow: auto;
        }
        .participant_grid {
          height: ${gridSize}px;
          width: ${gridSize}px;
          min-width: 20vw;
          min-height: 20vw;
        }
        .controller_icons {
          height: fit-content;
          position: absolute;
          bottom: 0;
          display: flex;
        }
        .empty_room_text {
          font-size: 2rem;
        }
      `}</style>
      <UserPrescriptionModal open={modalPatientOpen} onClose={handleModalPatientClose} patientId={user_id}/>
      <DoctorPrescriptionModal open={modalDoctorOpen} onClose={handleModalDoctorClose} doctorId={user_id} patientId={guest_id}/>
    </React.Fragment>
  ) : <h2 className="mt-5">Some thing went wrong, pls try again</h2>;
};

function calculateGridSize(remoteUsers) {
  const containerWidth = document.getElementById(
    "large_video_container"
  )?.offsetWidth;
  const containerHeight = document.getElementById(
    "large_video_container"
  )?.offsetHeight;
  let size = parseInt(containerWidth / (remoteUsers?.length || 1) - 5);
  if (containerHeight < size && remoteUsers?.length === 1) {
    size = parseInt(containerHeight);
  }
  return size;
}

export default Conference;
