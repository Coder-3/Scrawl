import { Button, ScrollArea, Stack } from "@mantine/core";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";

const NotesList = ({ notes, setCurrentNote }) => {
  return (
    <div>
      <ScrollArea style={{ height: "calc(95vh - 60px)" }}>
        <Stack style={{ gap: 0 }}>
          {notes.map((note) => (
            <Button
              variant="subtle"
              key={note.id}
              onClick={() => setCurrentNote(note.id)}
            >
              {note.title}
            </Button>
          ))}
        </Stack>
      </ScrollArea>
    </div>
  );
};

export default NotesList;
