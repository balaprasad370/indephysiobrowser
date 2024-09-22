import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";
import Auth from "./../../../hooks/useAuth";
import moment from "moment";

const Meet = () => {
  const tokenData = Auth();

  const { room_name, schedule_id } = useParams();

  const navigate = useNavigate();
  const domain = "meet.indephysio.com";

  return (
    <>
      <div className="w-full h-full">
        <JitsiMeeting
          domain={domain}
          className="w-full h-full"
          roomName={room_name}
          configOverwrite={{
            startWithAudioMuted: true,
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
          }}
          userInfo={{
            displayName: tokenData.first_name,
            email: tokenData.email
          }}
          onReadyToClose={() => {
            navigate(
              "/admin/schedule/liveclass/" +
                room_name +
                "/" +
                moment().format("YYYY-MM-DD") +
                "/" +
                schedule_id
            );
          }}
          onApiReady={(externalApi) => {
            // externalApi.getSessionId().then((sessionId) => {
            //   console.log("====================================");
            //   console.log("added", sessionId);
            //   console.log("====================================");
            // });
            // externalApi.addEventListener("recordingStatusChanged", (event) => {
            //   console.log("Recording status: ", event);
            //   if (event.status === "on") {
            //     console.log("Recording has started");
            //   } else {
            //     console.log("Recording has stopped");
            //   }
            // });
            // here you can attach custom event listeners to the Jitsi Meet External API
            // you can also store it locally to execute commands
            // externalApi.addEventListener("participantRoleChanged", (event) => {
            //   if (event.role === "moderator") {
            //     console.log("You are now a moderator");
            //     // Perform actions for moderator
            //   } else {
            //     console.log("You are not a moderator");
            //   }
            // });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
          }}
        />
      </div>
    </>
  );
};

export default Meet;
