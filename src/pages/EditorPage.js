import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";

const EditorPage = ({ noteId }) => {
  const [content, setContent] = useState(null);

  return (
    <>
      <RichTextEditor value={content} onChange={setContent} />
    </>
  );
};

export default EditorPage;
