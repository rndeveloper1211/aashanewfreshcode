import firestore from '@react-native-firebase/firestore';

export const logToFirebase = async (eventName, data = {}) => {
  try {

    // console me bhi print ho
    console.log(`🔥 ${eventName}:`, data);

    await firestore()
      .collection('debug_logs')
      .add({
        event: eventName,
        data: data,
        timestamp: new Date(),
      });

  } catch (error) {
    console.log("Firebase Log Error:", error);
  }
};