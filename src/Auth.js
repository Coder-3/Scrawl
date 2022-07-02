import {
  Button,
  Input,
  Container,
  Space,
  SegmentedControl,
  Center,
  PasswordInput,
  Loader,
} from "@mantine/core";
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [operationType, setOperationType] = useState("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert(
        "Please check your inbox and click on the link to confirm your email"
      );
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ marginTop: "5vh" }}>
      <Center mb="xs">
        <SegmentedControl
          value={operationType}
          onChange={setOperationType}
          data={[
            { label: "Login", value: "login" },
            { label: "Signup", value: "signup" },
          ]}
        />
      </Center>
      <Space h="sm" />
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : operationType === "login" ? (
        <form onSubmit={handleLogin}>
          <Input
            id="email"
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            mb="sm"
          />
          <PasswordInput
            id="password"
            placeholder="Your password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Space h="sm" />
          <Center>
            <Button type="submit">Sign In</Button>
          </Center>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <Input
            id="email"
            className="inputField"
            type="email"
            placeholder="New email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            mb="sm"
          />
          <PasswordInput
            id="password"
            placeholder="New password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Space h="sm" />
          <Center>
            <Button type="submit">Sign Up</Button>
          </Center>
        </form>
      )}
    </Container>
  );
}
