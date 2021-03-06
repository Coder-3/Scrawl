import { useState, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  AppShell,
  Navbar,
  Header,
  Input,
  Space,
  Button,
  Container,
  Group,
  Text,
  Affix,
  MediaQuery,
  SimpleGrid,
  Burger,
  Center,
  SegmentedControl,
  Grid,
  Avatar,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import NotesList from "./NotesList";
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
  const [editorHeight, setEditorHeight] = useState(height - 180);
  const [editorMode, setEditorMode] = useState("edit");
  const [smEditorHeight, setSmEditorHeight] = useState(height - 250);

  const titleRef = useRef(null);
  const smTitleRef = useRef(null);

  useEffect(() => {
    setEditorHeight(height - 200);
    setSmEditorHeight(height - 170);
  }, [height]);

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
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.modified);
        const dateB = new Date(b.modified);
        return dateB - dateA;
      });
      return sortedData;
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

  const clear = () => {
    setContent("");
    setTitle("");
    setCurrentNote(null);
  };

  const handleSave = async () => {
    const user = supabase.auth.user();
    if (!title) {
      alert("Please add a title");
      return;
    } else if (!user) {
      alert("You need to be logged in to save notes");
      return;
    }
    const note = {
      title,
      content: value,
      user_id: user.id,
      modified: new Date(),
    };
    if (currentNote) {
      note["id"] = currentNote;
    }
    await supabase.from("notes").upsert(note);
    clear();
    getNotes().then((data) => {
      setNotes(data);
    });
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
          clear();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const newNote = () => {
    setContent("");
    setTitle("");
    setCurrentNote(null);
    setOpened(false);
  };

  const handleAutoSave = async () => {
    const user = supabase.auth.user();
    if (currentNote && user) {
      const note = {
        title,
        content: value,
        user_id: user.id,
        modified: new Date(),
      };
      note["id"] = currentNote;
      await supabase.from("notes").upsert(note);
    }
    getNotes().then((data) => {
      setNotes(data);
    });
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
              width={{ sm: 250, lg: 350 }}
              p="xs"
              hiddenBreakpoint="sm"
              hidden={!opened}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Center mb="md">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar mx="xs" src="logo.png" alt="" />
                    <Text size="lg">Scrawl</Text>
                  </div>
                </Center>
              </MediaQuery>
              <Center>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Button
                  onClick={() => {
                    newNote();
                    smTitleRef.current.focus();
                  }}
                  mb="sm"
                  fullWidth
                >
                  New Note
                </Button>
                </MediaQuery>
                <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Button
                  onClick={() => {
                    newNote();
                    titleRef.current.focus();
                  }}
                  mb="sm"
                  fullWidth
                >
                  New Note
                </Button> 
                </MediaQuery>
              </Center>
              <Input
                variant="default"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Space h="md" />
              <NotesList
                notes={filteredNotes}
                setCurrentNote={setCurrentNote}
                setOpened={setOpened}
              />
            </Navbar>
          }
          header={
            <Header height={50}>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Grid
                  justify="space-between"
                  style={{ height: "65px", alignItems: "center" }}
                >
                  <Grid.Col span={2}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar mx="xs" src="logo.png" alt="" />
                      <Text ml="xs" size="lg">
                        Scrawl
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    span={2}
                    mr="sm"
                  >
                    <Button onClick={handleSignout}>Sign Out</Button>
                  </Grid.Col>
                </Grid>
              </MediaQuery>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <SimpleGrid
                  cols={2}
                  style={{ height: "50px", alignContent: "center" }}
                  mx="sm"
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
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    mr="sm"
                  >
                    <Button size="xs" onClick={handleSignout}>
                      Sign Out
                    </Button>
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
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Container p={0} style={{ width: "100%", maxWidth: "100%" }}>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                mb="md"
                size="md"
                required
                onBlur={handleAutoSave}
                ref={titleRef}
              />
              <MDEditor
                value={value}
                onChange={setContent}
                height={editorHeight}
                onBlur={handleAutoSave}
                preview="live"
              />
            </Container>
          </MediaQuery>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Container p={0} style={{ marginTop: "-10px" }}>
              <Center>
                <SegmentedControl
                  value={editorMode}
                  onChange={setEditorMode}
                  size="sm"
                  data={[
                    { label: "Edit", value: "edit" },
                    { label: "Preview", value: "preview" },
                  ]}
                />
              </Center>
              <Space h={5} />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                mb="xs"
                size="sm"
                required
                onBlur={handleAutoSave}
                ref={smTitleRef}
              />
              <MDEditor
                value={value}
                onChange={setContent}
                height={smEditorHeight}
                onBlur={handleAutoSave}
                preview={editorMode}
                hideToolbar={true}
              />
              <Space h="xs" />
              <Center>
                <Button onClick={handleSave} size="xs" variant="filled">
                  save
                </Button>
                <Button
                  disabled={!currentNote}
                  onClick={handleDelete}
                  size="xs"
                  variant="outline"
                  ml="xs"
                >
                  delete
                </Button>
              </Center>
            </Container>
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
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
          </MediaQuery>
        </AppShell>
      )}
    </>
  );
}

export default App;
