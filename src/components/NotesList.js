import { List } from "@mantine/core";
import { supabase } from '../supabaseClient'

const NotesList = () => {
  const notes = [
    {
      name: "Note 1",
    },
    {
      name: "Note 2",
    },
    {
      name: "Note 3",
    },
  ];


  const { data, error } = supabase.from("notes").select();
  console.log(data);


  return (
    <div>
      <List size="sm" mt="md" listStyleType="none">
        {notes.map((note) => (
          <List.Item key={note.name}>{note.name}</List.Item>
        ))}
      </List>
    </div>
  );
};

export default NotesList;
