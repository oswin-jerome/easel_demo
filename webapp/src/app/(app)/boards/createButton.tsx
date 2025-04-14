"use client";
import { createBoardAction } from "@/actions/boards";
import { Button } from "@/components/ui/button";

const CreateBoardButton = () => {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        // console.log("Creating board...");
        const formData = new FormData();
        formData.append("title", "New Board");
        createBoardAction(formData)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.error("Error creating board:", error);
          });
      }}
    >
      New
    </Button>
  );
};

export default CreateBoardButton;
