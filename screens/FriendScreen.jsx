import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";

export default function FriendScreen() {
  const { userId, setUserId } = useContext(UserType);
  const [friendRequest, setFriendRequest] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchFriendRequest();
  }, []);

  const fetchFriendRequest = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:4000/api/users/friend-requests/${userId}`
      );

      if (response.status === 200) {
        const friendRequests = response.data.friendRequests;
        const friendRequestData = friendRequests.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          image: friendRequest.image,
        }));

        setFriendRequest(friendRequestData);
        setLoading(false); // Update loading state
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Update loading state in case of error
    }
  };

  return (
    <View style={{ padding: 10, marginHorizontal: 10 }}>
      {loading ? ( // Render loading indicator if data is still loading
        <ActivityIndicator size="large" color="#0000ff" />
      ) : friendRequest.length > 0 ? ( // Render friend requests if available
        <>
          <Text style={{ fontSize: 16 }}>Your Friend Requests</Text>
          {friendRequest.map((item, index) => (
            <FriendRequest
              item={item}
              key={index}
              friendRequest={friendRequest}
              setFriendRequest={setFriendRequest}
            />
          ))}
        </>
      ) : (
        // Render message if no friend requests are found
        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 320 }}>No friend requests found</Text>
      )}
    </View>
  );
}
