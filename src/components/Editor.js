import { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/rte";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const Editor = ({ content, setContent }) => {
  // const [value, setValue] = useState(null);
  // const currentNote = Number(useParams.id());

  // useEffect(() => {
  //   const getNoteContent = async () => {
  //     const { data } = await supabase
  //       .from("notes")
  //       .select("content")
  //       .eq("id", currentNote)
  //       .eq("user_id", userId);
  //     if (data) {
  //       setValue(data[0].content);
  //     }
  //   };
  //   if (currentNote && userId) {
  //     getNoteContent();
  //   }
  // }, [currentNote, userId]);

  return content && <RichTextEditor value={content} onChange={setContent} />;
};

export default Editor;
