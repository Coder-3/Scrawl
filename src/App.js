import { useState, useEffect, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import Auth from "./Auth";
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
  Grid,
  Group,
  Text,
} from "@mantine/core";
import NotesList from "./components/NotesList";
import { supabase } from "./supabaseClient";
import Tiptap from "./components/TipTap/TipTap";

function App() {
  const [title, setTitle] = useState("");
  const [value, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNote, setCurrentNote] = useState(null);
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState([]);

  const titleRef = useRef(null);

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
  }, []);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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

  const editor = useEditor({
    extensions: [StarterKit],
    value,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleSave = async () => {
    const content = editor.getHTML();
    const user = supabase.auth.user();
    const note = {
      content,
      title,
      user_id: user.id,
    };
    if (currentNote) {
      note["id"] = currentNote;
    }
    await supabase.from("notes").upsert(note);
    clearNote();
    getNotes().then((data) => {
      setNotes(data);
    });
  };

  const clearNote = () => {
    setContent("");
    setTitle("");
    setCurrentNote(null);
    editor.commands.clearContent();
  };

  const handleDelete = async () => {
    if (currentNote) {
      await supabase
        .from("notes")
        .update({ is_deleted: true })
        .match({ id: currentNote })
        .then(() => {
          getNotes().then((data) => {
            setNotes(data);
          });
        })
        .then(() => {
          clearNote();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSignout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="App">
      {!session ? (
        <Auth />
      ) : (
        <AppShell
          padding="md"
          navbar={
            <Navbar width={{ base: 300 }} p="xs">
              <Container>
                <Button
                  variant="filled"
                  onClick={() => {
                    clearNote();
                    titleRef.current.focus();
                  }}
                >
                  Create Note
                </Button>
              </Container>
              <Space h="sm" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Space h="xs" />
              <NotesList notes={notes} setCurrentNote={setCurrentNote} />
            </Navbar>
          }
          header={
            <Header height={60} p="xs">
              <Grid justify="space-between" align="center">
                <Grid.Col span={6}>
                  <Title order={2}>Notes</Title>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Grid justify="flex-end" align="center">
                    <Grid.Col span={6}>
                      <Text align="right">
                        Logged in as {session.user.email}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <Button
                        onClick={() => handleSignout()}
                        style={{ width: "100%" }}
                      >
                        Sign out
                      </Button>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </Grid>
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
          <ScrollArea style={{ height: "calc(90vh - 60px)" }}>
            <Input
              value={title}
              placeholder="Note title"
              ref={titleRef}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Space h="md" />
            <Tiptap editor={editor} />
            <Group spacing="sm">
              <Button onClick={handleSave} variant="filled">
                Save
              </Button>
              <Button
                disabled={!currentNote}
                onClick={handleDelete}
                variant="outline"
              >
                Delete
              </Button>
            </Group>
          </ScrollArea>
        </AppShell>
      )}
    </div>
  );
}

export default App;
