import { useState, useEffect } from "react";
import { RichTextEditor } from "@mantine/rte";
import { AppShell, Navbar, Header, Input } from "@mantine/core";
import NotesList from "./components/NotesList";
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'

const initialValue =
  "<p>Your initial <b>html value</b> or an empty string to init editor without value</p>";

function App() {
  const [value, onChange] = useState(initialValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="App">
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} height={500} p="xs">
            <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <NotesList />
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
        {/* {!session ? <Auth /> : <Account key={session.user.id} session={session} />} */}
        <RichTextEditor value={value} onChange={onChange} />
      </AppShell>
    </div>
  );
}

export default App;
