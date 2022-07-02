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
  Group,
  Text,
  Image,
  Affix,
  MediaQuery,
  SimpleGrid,
  Burger,
  Divider,
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
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [opened, setOpened] = useState(false);

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
  }, [session]);

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
    const user = supabase.auth.user();
    if (!title) {
      alert("Please add a title");
      return;
    } else if (!user) {
      alert("You need to be logged in to save notes");
      return;
    }
    const content = editor.getHTML();
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
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <SimpleGrid cols={2}>
                  <div>
                    <Text size="sm" mb="lg">
                      logged in as {session.user.email}
                    </Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="outline"
                      size="xs"
                      mt="sm"
                      onClick={handleSignout}
                    >
                      sign out
                    </Button>
                  </div>
                </SimpleGrid>
              </MediaQuery>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Divider mb="sm" />
              </MediaQuery>
              <Container>
                <Button
                  variant="filled"
                  onClick={() => {
                    clearNote();
                    titleRef.current.focus();
                  }}
                >
                  create note
                </Button>
              </Container>
              <Space h="sm" />
              <Input
                placeholder="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Space h="xs" />
              <NotesList
                notes={filteredNotes}
                setCurrentNote={setCurrentNote}
              />
            </Navbar>
          }
          header={
            <Header height={60}>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <SimpleGrid
                  style={{
                    height: "100%",
                    alignItems: "center",
                    margin: "0 16px",
                  }}
                  cols={2}
                >
                  <div>
                    <Burger
                      opened={opened}
                      onClick={() => setOpened((o) => !o)}
                      size="sm"
                      color="gray"
                      mr="xl"
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div>
                      <Image
                        src="logo.png"
                        alt="logo"
                        width="50px"
                        height="50px"
                      />
                    </div>
                    <Space w="md" />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Text size="xl" weight="bold" style={{ lineHeight: 1 }}>
                        ai notes
                      </Text>
                    </div>
                  </div>
                </SimpleGrid>
              </MediaQuery>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <SimpleGrid cols={2} style={{ height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src="logo.png"
                      alt="logo"
                      width="50px"
                      height="50px"
                    />
                    <Space w="md" />
                    <Title order={2}>ai notes</Title>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text size="sm" mr="sm">
                      logged in as {session.user.email}
                    </Text>
                  </div>
                </SimpleGrid>
              </MediaQuery>
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
          <Input
            value={title}
            placeholder="note title"
            ref={titleRef}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Space h="md" />
          <ScrollArea
            px="md"
            type="auto"
            style={{
              height: "calc(85% - 60px)",
              maxHeight: "calc(85vh - 60px)",
            }}
          >
            <Tiptap editor={editor} />
          </ScrollArea>
          <Affix position={{ bottom: 20, right: 20 }} zIndex={10}>
            <Group spacing="sm">
              <Button onClick={handleSave} variant="filled">
                save
              </Button>
              <Button
                disabled={!currentNote}
                onClick={handleDelete}
                variant="outline"
              >
                delete
              </Button>
            </Group>
          </Affix>
        </AppShell>
      )}
    </>
  );
}

export default App;
