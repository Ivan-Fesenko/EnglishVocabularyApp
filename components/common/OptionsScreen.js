import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const OptionsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Your Activity</Text>

            <View style={styles.gameSection}>
                <TouchableOpacity
                    style={[styles.button, styles.practiceButton]}
                    onPress={() => navigation.navigate('WordGame')}
                >
                    <Icon name="game-controller-outline" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Practice Words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.practiceButton]}
                    onPress={() => navigation.navigate('PhraseGame')}
                >
                    <Icon name="chatbubble-outline" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Practice Phrases</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mistakeSection}>
                <TouchableOpacity
                    style={[styles.button, styles.errorButton]}
                    onPress={() => navigation.navigate('Mistakes')}
                >
                    <Icon name="warning-outline" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Work on Mistakes</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.readAddSection}>
                <TouchableOpacity
                    style={[styles.button, styles.readButton]}
                    onPress={() => navigation.navigate('WordList')}
                >
                    <Icon name="book-outline" size={24} color="#007acc" style={styles.icon} />
                    <Text style={styles.readButtonText}>Read Words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.readButton]}
                    onPress={() => navigation.navigate('PhraseList')}
                >
                    <Icon name="book-outline" size={24} color="#007acc" style={styles.icon} />
                    <Text style={styles.readButtonText}>Read Phrases</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.addButton]}
                    onPress={() => navigation.navigate('AddWordsAndPhrases')}
                >
                    <Icon name="add-circle-outline" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Add Words and Phrases</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        paddingHorizontal: 20,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007acc',
        textAlign: 'center',
        marginBottom: 20,
    },
    gameSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mistakeSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    readAddSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 15,
        marginVertical: 10,
        width: '85%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    practiceButton: {
        backgroundColor: '#007acc',
    },
    errorButton: {
        backgroundColor: '#ff6347',
    },
    readButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#007acc',
    },
    addButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    readButtonText: {
        color: '#007acc',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
});

export default OptionsScreen;

