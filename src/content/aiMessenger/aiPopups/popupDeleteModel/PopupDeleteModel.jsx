import React, { useEffect, useRef, useState } from "react";
import "./popupDeleteModel.css";
import Button from "../../aiUiKit/button/Button";
import { Cached, Close } from "@mui/icons-material";
import Input from "../../aiUiKit/input/Input";

export default function popupDeleteModel(props) {
  const { setShowDeleteModel, model } = props;

  const handleClose = () => {
    setShowDeleteModel(false);
  };

  const [responseMsg, setResponseMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  console.log("success:", success, "notFound:", notFound);

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseMsg("");

    try {
      const response = await fetch("http://localhost:11434/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: model }),
      });

      if (response.ok) {
        setSuccess(true);
        setResponseMsg(`✅ Model "${model}" deleted successfully.`);
      } else if (response.status === 404) {
        setNotFound(true);
        setResponseMsg(`❌ Model "${model}" not found.`);
      } else {
        const errorText = await response.text();
        setResponseMsg(`⚠️ Error: ${errorText}`);
      }
    } catch (error) {
      setResponseMsg(`🚨 Network error: ${error.message}`);
    }

    setIsLoading(false);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  return (
    <div className="popupDeleteModel">
      <div className="popupDeleteModelContainer">
        <div
          className={`popupDeleteModelHeader ${confirmDelete ? "confirm" : ""}`}
        >
          <h3 className="popupDeleteModelHeaderTitle">Delete Model</h3>
          {!success && (
            <Close
              className="popupDeleteModelHeaderClose"
              style={{ fontSize: "2rem", color: "var(--bg)" }}
              onClick={() => {
                handleClose();
              }}
            />
          )}
        </div>
        <div className="popupDeleteModelBody">
          <div className="popupDeleteModelBodyBlock">
            {(!success || !notFound) && (
              <>
                {!deleteConfirmed && (
                  <h3 className="popupDeleteModelBodyBlockTitle">{model}</h3>
                )}
              </>
            )}

            {confirmDelete && (
              <div className="popupDeleteModelBodyBlockText">
                {!deleteConfirmed && (
                  <>
                    <h3 className="popupDeleteModelBodyBlockSubTitle">
                      Are you sure you want to delete this model?{" "}
                    </h3>
                    <h3 className="popupDeleteModelBodyBlockSubTitle">
                      Please input "
                      <span style={{ color: "var(--red)" }}>
                        {model ? model.slice(0, 5).toLowerCase() : ""}
                      </span>
                      " in the input field below to confirm:
                    </h3>
                    <Input
                      type="text"
                      className="popupDeleteModelBodyBlockInput"
                      placeholder={`${model?.slice(0, 5).toLowerCase()}`}
                      onChangeR={(e) => {
                        if (
                          e.target.value ===
                          `${model?.slice(0, 5).toLowerCase()}`
                        ) {
                          setDeleteConfirmed(true);
                        }
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {(!success || !notFound) && !confirmDelete && (
              <Button
                disabledBtn={isLoading}
                style={{ margin: "0 auto" }}
                name={"Delete Model"}
                onClick={() => setConfirmDelete(true)}
              />
            )}
            {deleteConfirmed && (
              <>
                {!success && (
                  <Button
                    disabledBtn={isLoading}
                    style={{
                      margin: "0 auto",
                      color: "var(--red)",
                      textTransform: "uppercase",
                      padding: "5px 10px 3px",
                    }}
                    name={isLoading ? "Deleting..." : "Delete"}
                    onClick={handleDelete}
                  />
                )}
              </>
            )}
            {responseMsg && (
              <div
                className="popupDeleteModelBodyBlockText"
                style={
                  success
                    ? { color: "var(--green)" }
                    : notFound
                    ? { color: "var(--red)" }
                    : { color: "var(--red)" }
                }
              >
                {responseMsg}
              </div>
            )}
          </div>
        </div>
        <div
          className={`popupDeleteModelButtons ${
            confirmDelete ? "confirm" : ""
          }`}
        >
          {!success && <Button onClick={() => handleClose()} name="Close" />}
          {success && (
            <Button
              onClick={() => window.location.reload()}
              name="Refresh"
              icon={<Cached color="action" fontSize="small" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
