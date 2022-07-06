import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  AppShell,
  Navbar,
  Header,
  Input,
  Space,
  ScrollArea,
  Button,
  Title,
  Container,
  Group,
  Text,
  Image,
  Affix,
  MediaQuery,
  SimpleGrid,
  Burger,
  Divider,
} from "@mantine/core";
import { useViewportSize } from '@mantine/hooks';
import NotesList from "./components/NotesList";
import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

function App() {
  const [opened, setOpened] = useState(false);
  const [session, setSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState("");
  const [value, setContent] = useState("");
  const { height } = useViewportSize();
  const [editorHeight] = useState(height - 150);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredNotes(
        notes.filter((note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredNotes(notes);
    }
  }, [searchTerm, notes]);

  const getNotes = async () => {
    const user = supabase.auth.user();
    if (user) {
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_deleted", false);
      return data;
    }
    return [];
  };

  useEffect(() => {
    getNotes().then((data) => {
      setNotes(data);
    });
  }, [session]);

  useEffect(() => {
    const getNoteContent = async () => {
      const user = supabase.auth.user();
      if (currentNote && user) {
        const { data } = await supabase
          .from("notes")
          .select("title, content")
          .eq("id", currentNote)
          .eq("user_id", user.id);
        if (data) {
          setContent(data[0].content);
          setTitle(data[0].title);
        }
      }
    };
    getNoteContent();
  }, [currentNote]);

  return (
    <>
      {!session ? (
        <Auth />
      ) : (
        <AppShell
          navbarOffsetBreakpoint="sm"
          fixed
          navbar={
            <Navbar
              width={{ sm: 200, lg: 300 }}
              p="xs"
              hiddenBreakpoint="sm"
              hidden={!opened}
            >
              <Input
                variant="default"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <NotesList
                notes={filteredNotes}
                setCurrentNote={setCurrentNote}
                setOpened={setOpened}
              />
            </Navbar>
          }
          header={<Header height={60}>header</Header>}
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} mb="md" size="md" />
          <MDEditor value={value} onChange={setContent} height={editorHeight} />
          {/* <MDEditor.Markdown
            source={value}
            style={{ whiteSpace: "pre-wrap" }}
          /> */}
        </AppShell>
      )}
    </>
  );
}

export default App;
