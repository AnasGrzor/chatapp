import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

export default function FriendRequest({
  item,
  friendRequest,
  setFriendRequest,
}) {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:4000/api/users/accept-friend-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      );

      if (response.status === 200) {
        const updatedFriendRequest = friendRequest.filter(
          (request) => request._id !== friendRequestId
        );
        setFriendRequest(updatedFriendRequest);
        navigation.navigate("Chat");
      }

    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Pressable
        style={{
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: 50, height: 50, borderRadius: 25, marginTop: 10 }}
        />
        <View>
          <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
          <Text>sent you a friend request</Text>
        </View>

        <Pressable
          style={{
            backgroundColor: "green",
            padding: 5,
            borderRadius: 5,
            width: 105,
          }}
          onPress={() => acceptRequest(item._id)}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Accept
          </Text>
        </Pressable>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({});
