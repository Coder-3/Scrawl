import {
  Button,
  Input,
  Title,
  Text,
  Container,
  Space,
} from "@mantine/core";
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container size="xs" style={{ marginTop: "5vh" }}>
        <Title order={1}>LogIn/Signup</Title>
        <Text>Sign in via magic link with your email below</Text>
        <Space h="sm" />
        {loading ? (
          "Sending magic link..."
        ) : (
          <form onSubmit={handleLogin}>
            <Input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Space h="sm" />
            <Button>Send magic link</Button>
          </form>
        )}
      </Container>
  );
}
