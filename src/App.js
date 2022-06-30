import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { AppShell, Navbar, Header } from "@mantine/core";

const initialValue =
  "<p>Your initial <b>html value</b> or an empty string to init editor without value</p>";

function App() {
  const [value, onChange] = useState(initialValue);
  return (
    <div className="App">
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} height={500} p="xs">
            {/* Navbar content */}
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
        <RichTextEditor value={value} onChange={onChange} />
      </AppShell>
    </div>
  );
}

export default App;
