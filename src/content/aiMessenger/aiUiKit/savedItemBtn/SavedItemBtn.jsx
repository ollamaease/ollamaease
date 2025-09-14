import React from "react";
import "./savedItemBtn.css";
import { Delete } from "@mui/icons-material";

export default function SavedItemBtn(props) {
  const { item, itemName, loadItem, handleDeleteItem } = props;
  // console.log("Saved item",item);
  return (
    <div className="savedItem">
      <p className="savedItemDate">{item.updatedAt?.split("T")[0]}</p>
      <div className="savedItemWrapper" onClick={() => loadItem(item)}>
        <p
          className="savedTitle"
          style={
            itemName === (item.dialogueTitle || item.title)
              ? {
                  color: "var(--main)",
                }
              : { color: "var(--green)" }
          }
        >
          {item.dialogueTitle || item.title}{" "}
          <span>{item.messages?.length - 1}</span>
          
        </p>
      </div>
      <Delete
        className="savedItemDelete"
        onClick={() => handleDeleteItem(item.initId)}
      />
    </div>
  );
}
