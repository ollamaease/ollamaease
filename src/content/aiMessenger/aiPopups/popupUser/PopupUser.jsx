import React, { useEffect, useRef, useState } from "react";
import "./popupUser.css";
import Button from "../../aiUiKit/button/Button";
import Input from "../../aiUiKit/input/Input";
import {
  AddAPhoto,
  Cancel,
  Close,
  LockOpen,
  LockOutline,
} from "@mui/icons-material";

export default function PopupUser(props) {
  const {
    setShowUser,
    userAvatar,
    setUserAvatar,
    userName,
    setUserName,
    userBirthdate,
    setUserBirthdate,
    userDescription,
    setUserDescription,
  } = props;

  const [file, setFile] = useState(null);

  const handleCancelPicture = () => {
    setFile(null);
    setUserAvatar("");
  };

  // Function to handle file conversion to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Size of file", e.target.files[0].size);
    if (file) {
      const reader = new FileReader();

      // This event is triggered once the file is read
      reader.onloadend = () => {
        setUserAvatar(reader.result); // The Base64 string will be in reader.result
      };

      // Read the file as a Data URL (Base64)
      reader.readAsDataURL(file);
    }
  };

  // console.log("Profile image", userAvatar.split(",")[1]);

  const handleClose = () => {
    setShowUser(false);
  };

  const handleSave = () => {
    const customUser = {
      picture: userAvatar ? userAvatar : null,
      userName: userName ? userName : null,
      userBirthdate: userBirthdate ? userBirthdate : null,
      userDescription: userDescription ? userDescription : null,
    };
    chrome.storage.local.set({ custom_user: customUser }, () => {
      console.log("Custom user saved", customUser);
    }); // Save the custom user object in local storage (optional: true });
    setShowUser(false);
    // window.confirm("Saved!");
  };

  const handleReset = () => {
    chrome.storage.local.set({ custom_user: null });
    setUserAvatar(null);
    setUserName("");
    setUserBirthdate("");
    setUserDescription("");
  };

  return (
    <div className="popupUser">
      <div className="popupUserContainer">
        <div className="popupUserHeader">
          <h3 className="popupUserHeaderTitle">User Settings</h3>
          <Close
            className="popupUserHeaderClose"
            style={{ fontSize: "2rem", color: "var(--bg)" }}
            onClick={() => {
              setShowUser(false);
            }}
          />
        </div>
        <div className="popupUserBody">
          <div className="popupUserBodyBlock">
            <div className="popupUserBodyBlockPicture">
              <img
                className="popupUserBodyBlockAvatarImg"
                src={
                  userAvatar
                    ? userAvatar
                    : userAvatar
                    ? `data:image;base64,${userAvatar}`
                    : "icons/avatarUser.jpg"
                }
                alt="AI_avatar"
              />
              {(userAvatar || userAvatar) && (
                <Cancel
                  className="popupUserBodyBlockAddPhotoCancel"
                  style={{ color: "var(--bg)" }}
                  onClick={handleCancelPicture}
                />
              )}
              <label htmlFor="file" className="popupUserBodyBlockAddPhoto">
                <AddAPhoto className="popupUserBodyBlockAddPhotoIcon iconTransformScale" />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFile(file);
                      handleFileChange(e);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <label className="popupUserBodyBlockLabel">
            <p className="popupUserBodyBlockTitle"> Name</p>
            <Input
              className={"popupUserBodyBlockInput"}
              type="text"
              placeholder="Your name"
              value={userName}
              onChangeR={(e) => setUserName(e.target.value)}
            />
          </label>
          <label className="popupUserBodyBlockLabel">
            <p className="popupUserBodyBlockTitle"> Birthday</p>
            <Input
              className={"popupUserBodyBlockInput"}
              type="date"
              placeholder="Your birthday"
              value={userBirthdate}
              onChangeR={(e) => setUserBirthdate(e.target.value)}
            />
          </label>

          <label className="popupUserBodyBlockLabel">
            <p className="popupUserBodyBlockTitle">
              Describe yourself
            </p>
            <textarea
              className={"popupUserBodyBlockTextarea"}
              placeholder={"Write something about yourself to make it easier for the AI to understand who it is communicating with. If necessary or you want..."}
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
            ></textarea>
          </label>
        </div>
        <div className="popupUserButtons">
          <Button onClick={handleSave} name="Save" />
          <Button onClick={handleClose} name="Close" />
          <Button onClick={handleReset} name="↩ Reset" />
        </div>
      </div>
    </div>
  );
}
