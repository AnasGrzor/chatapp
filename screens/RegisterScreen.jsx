import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const navigation = useNavigation();
  const bgImage =
    "https://img.freepik.com/free-vector/purple-fluid-background_53876-99561.jpg?w=740&t=st=1706616297~exp=1706616897~hmac=da959bd41bde70efa4299239d966f09e2c5dd56f61ada82f38e26b00b0b9fc0a";

  const handleRegister = async () => {
    console.log("Registering user...");
    console.log(email, password, name, image);
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    try {
      const response = await fetch(
        "http://10.0.2.2:4000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      )

      if (response.status === 201) {
        Alert.alert("Success", "User created successfully");
        setEmail("");
        setPassword("");
        setName("");
        setImage("");
        navigation.navigate("Login");
      }

      if (!response.ok) {
        Alert.alert("Error", "Failed to register user");

      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }

  };

  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.backgroundImage}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SafeAreaView style={styles.wrapper}>
            <Text style={styles.title}>Register</Text>
            <Text style={[styles.title, { color: "black", marginTop: 10 }]}>
              Create Your Account
            </Text>
          </SafeAreaView>
          <View style={styles.formEmail}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={"black"}
              placeholder="Enter Name"
              style={styles.input}
            />
          </View>
          <View>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor={"black"}
                placeholder="Enter Email"
                style={styles.input}
              />
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholderTextColor={"black"}
                placeholder="Enter Password"
                style={styles.input}
              />
            </View>
          </View>
          <View>
            <Text style={styles.label}>Image</Text>

            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder="Image"
            />
          </View>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <View style={styles.footer}>
            <Pressable onPress={() => navigation.navigate("Home")}>
              <Text style={[styles.footerText]}>
                Already have an account?{" "}
                <Text style={styles.footerLink}>Login</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  formEmail: {
    marginTop: 20,
  },
  title: {
    color: "#3C40C6",
    fontSize: 17,
    fontWeight: "600",
  },
  label: {
    fontSize: 18,
    color: "#3C40C6",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: 300,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#3C40C6",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  footerText: {
    color: "#001F7A",
    fontSize: 12,
    fontWeight: "600",
  },
  footerLink: {
    color: "#3C40C6",
    fontSize: 12,
    fontWeight: "600",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    zIndex: -1,
  },
});
