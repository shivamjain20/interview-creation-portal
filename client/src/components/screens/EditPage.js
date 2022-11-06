import React from "react";
import { useParams } from "react-router";
import Details from "./Details";

const EditPage = () => {
  const { meetingId } = useParams();
  return (
    <div>
      <Details function="edit" meetingId={meetingId} />
    </div>
  );
};

export default EditPage;
