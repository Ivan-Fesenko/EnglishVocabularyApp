import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MistakesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Work on Mistakes</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('WordMistakesGame')}
            >
                <Icon name="book-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Words Mistakes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PhraseMistakesGame')}
            >
                <Icon name="chatbubble-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Phrases Mistakes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3e7e9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#5f7ac3',
        textAlign: 'center',
        marginBottom: 25,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007acc',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
});

export default MistakesScreen;

