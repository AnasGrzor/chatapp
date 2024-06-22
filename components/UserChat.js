import { Pressable, Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

export default function UserChat({ item }) {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:4000/api/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const lastMessage = getLastMessage();

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderBottomWidth: 0.7,
        borderColor: "#D9D9D9",
        padding: 10,
      }}
      onPress={() =>
        navigation.navigate("Message", {
          recepientId: item._id,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.name}</Text>
        {lastMessage && (
          <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
            {lastMessage.message}
          </Text>
        )}
      </View>

      <View>
        <Text style={{ fontSize: 12, color: "gray" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
