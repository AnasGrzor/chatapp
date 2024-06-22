import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext';
import UserChat from '../components/UserChat';


export default function ChatScreen() {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:4000/api/users/friends/${userId}`);
        const data = await response.json()
        if (response.status === 200) {
          setAcceptedFriends(data.acceptedFriends);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAcceptedFriends();
  }, [])

  // console.log(acceptedFriends);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Pressable>
        {acceptedFriends.map((item, index) => (
          <UserChat key={index} item={item} />
        ))}
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})