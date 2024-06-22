import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob.js";
import User from "../components/User";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return <Text style={{ fontSize: 20, fontWeight: "bold" }}>Chats</Text>;
      },
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Entypo
            onPress={() => navigation.navigate("Chat")}
            name="chat"
            size={24}
            color="black"
          />
          <Ionicons
            name="people"
            size={24}
            color="black"
            onPress={() => navigation.navigate("Friends")}
          />
        </View>
      ),
    });
  });

  const fetchUsers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const getUsers = await axios.get(
        `http://10.0.2.2:4000/api/users/${userId}`
      );

      setUsers(getUsers.data);
      setError(false);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <Text style={styles.errorText}>
            We're having trouble connecting to the server. Please try again
            later.
          </Text>
        ) : (
          users.map((item, index) => <User item={item} key={index} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // or any background color you prefer
  },
  scrollViewContainer: {
    padding: 0,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    margin: 20,
  },
});
