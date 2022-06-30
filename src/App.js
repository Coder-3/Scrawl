import { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/rte";
import {
  AppShell,
  Navbar,
  Header,
  Input,
  Space,
  ScrollArea,
} from "@mantine/core";
import NotesList from "./components/NotesList";
import { supabase } from "./supabaseClient";

function App() {
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    const getNoteContent = async () => {
      const { data } = await supabase
        .from("notes")
        .select("content")
        .eq("id", currentNote);
      if (data.length > 0) {
        setValue(data[0].content);
      }
    };
    getNoteContent();
  }, [currentNote]);

  return (
    <div className="App">
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} height={500} p="xs">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Space h="xs" />
            <NotesList setCurrentNote={setCurrentNote} />
          </Navbar>
        }
        header={
          <Header height={60} p="xs">
            Notes
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <ScrollArea style={{ height: "calc(95vh - 60px)" }}>
          <RichTextEditor value={value} onChange={setValue} />
        </ScrollArea>
      </AppShell>
    </div>
  );
}

export default App;
