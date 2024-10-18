import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Підключаємо іконки

const OptionsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Блок для ігор вгорі */}
            <View style={styles.gameSection}>
                <TouchableOpacity
                    style={styles.gameButton}
                    onPress={() => navigation.navigate('WordGame')}
                >
                    <Icon name="game-controller-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Practice Words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.gameButton}
                    onPress={() => navigation.navigate('PhraseGame')}
                >
                    <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Practice Phrases</Text>
                </TouchableOpacity>
            </View>

            {/* Блок для читання та додавання слів і фраз знизу */}
            <View style={styles.readAddSection}>
                <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => navigation.navigate('WordList')}
                >
                    <Icon name="book-outline" size={24} color="#007acc" />
                    <Text style={styles.readButtonText}>Read Words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => navigation.navigate('PhraseList')}
                >
                    <Icon name="book-outline" size={24} color="#007acc" />
                    <Text style={styles.readButtonText}>Read Phrases</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddWordsAndPhrases')}
                >
                    <Icon name="add-circle-outline" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Add Words and Phrases</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f0f4f7',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    gameSection: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    readAddSection: {
        alignItems: 'center',
    },
    gameButton: {
        flexDirection: 'row',
        backgroundColor: '#007acc',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    readButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        borderColor: '#007acc',
        borderWidth: 1,
        marginVertical: 10,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#007acc',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
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
});

export default OptionsScreen;
