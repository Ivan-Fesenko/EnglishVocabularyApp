import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About the Vocabulary App</Text>
            <Text style={styles.paragraph}>
                This app is designed to help you learn and memorize English words and phrases. It allows you to add new words or phrases, repeat them, and track your progress.
            </Text>
            <Text style={styles.paragraph}>
                Features include:
            </Text>
            <Text style={styles.listItem}>1. Adding new words and phrases.</Text>
            <Text style={styles.listItem}>2. Choosing between word or phrase repetition modes.</Text>
            <Text style={styles.listItem}>3. Testing your knowledge on added material.</Text>
            <Text style={styles.listItem}>4. Tracking your progress to stay motivated.</Text>
            <Text style={styles.paragraph}>
                It's a great tool for those who want to improve their language skills in an interactive and efficient way.
            </Text>
            <Text style={styles.footer}>Version 1.0.0</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        lineHeight: 22,
        textAlign: 'center', // Центруємо текст для естетичного вигляду
    },
    listItem: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        lineHeight: 22,
        textAlign: 'left', // Список вирівнюється вліво
    },
    footer: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default InfoScreen;
