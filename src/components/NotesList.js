import { Button, ScrollArea, Stack } from "@mantine/core";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";

const NotesList = ({ setCurrentNote }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getNotes = async () => {
      const { data } = await supabase.from("notes").select("*");
      return data;
    };

    getNotes().then((data) => {
      setNotes(data);
    });
  }, []);



  return (
    <div>
      {/* <List size="sm" mt="md" listStyleType="none">
        {notes.map((note) => (
          <List.Item key={note.title}>{note.title}</List.Item>
        ))}
      </List> */}
      <ScrollArea style={{ height: "calc(95vh - 60px)" }}>
        <Stack style={{ gap: 0 }}>
          {notes.map((note) => (
            <Button variant="subtle" key={note.id} onClick={() => setCurrentNote(note.id)}>
              {note.title}
            </Button>
          ))}
        </Stack>
      </ScrollArea>
    </div>
  );
};

export default NotesList;
