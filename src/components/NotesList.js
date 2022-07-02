import { Button, ScrollArea, Stack } from "@mantine/core";

const NotesList = ({ notes, setCurrentNote }) => {
  return (
    <div style={{height: "100%"}}>
      <ScrollArea style={{ height: "calc(85% - 60px)", maxHeight: "calc(85vh - 60px)" }}>
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
