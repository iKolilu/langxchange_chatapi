import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Chatbot from './Chatbot';
import { useAuth } from '../contexts/AuthContext';

/**
 * PLCChat - PLC / Lesson Plan tab
 * Mounts the existing Chatbot component inline as a full-screen chat window.
 * The Chatbot is a Modal internally, so we keep isOpen=true to fill the screen.
 */
const PLCChat = () => {
    const { currentUser } = useAuth();

    const initialParams = {
        title: 'PLC Assistant',
        planType: 'PLC Session',
        prompt: `Teacher: ${currentUser?.name}\nSchool: ${currentUser?.school}\nDistrict: ${currentUser?.district} · ${currentUser?.region}\nRole: ${currentUser?.role}\nSubjects: ${currentUser?.subjectsTaught?.join(', ') || 'N/A'}`,
    };

    return (
        <View style={styles.container}>
            <Chatbot
                isOpen={true}
                onClose={() => { }} // no close — it's a permanent tab
                initialParams={initialParams}
                inline={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default PLCChat;
