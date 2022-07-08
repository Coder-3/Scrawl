import { Button, ScrollArea, Stack } from "@mantine/core";

const NotesList = ({ notes, setCurrentNote, setOpened }) => {
  return (
    <div style={{ height: "100%" }}>
      <ScrollArea type="auto" style={{ height: "calc(100vh - 190px)" }} pr="sm">
        <Stack style={{ gap: 0 }}>
          {notes.map((note) => (
            <Button
              variant="subtle"
              key={note.id}
              onClick={() => {
                setCurrentNote(note.id);
                setOpened(false);
              }}
              styles={{ inner: { justifyContent: "flex-start" } }}
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
