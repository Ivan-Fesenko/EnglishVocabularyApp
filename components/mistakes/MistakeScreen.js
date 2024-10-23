import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MistakesScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Work on Mistakes</Text>

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
        backgroundColor: '#f0f4f7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 30,
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

