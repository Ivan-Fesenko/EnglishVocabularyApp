// Додавання слів та фраз

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const AddWordsAndPhrasesScreen = () => {
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const [phrase, setPhrase] = useState('');
    const [phraseTranslation, setPhraseTranslation] = useState('');

    const saveWord = async () => {
        if (word && translation) {
            const newWord = { word, translation };
            try {
                const storedWords = await AsyncStorage.getItem('words');
                const words = storedWords ? JSON.parse(storedWords) : [];
                words.push(newWord);
                await AsyncStorage.setItem('words', JSON.stringify(words));
                setWord('');
                setTranslation('');
                Alert.alert('Success', 'Word added successfully!');
            } catch (error) {
                console.error(error);
            }
        } else {
            Alert.alert('Error', 'Please enter both the word and its translation.');
        }
    };

    const savePhrase = async () => {
        if (phrase && phraseTranslation) {
            const newPhrase = { phrase, translation: phraseTranslation };
            try {
                const storedPhrases = await AsyncStorage.getItem('phrases');
                const phrases = storedPhrases ? JSON.parse(storedPhrases) : [];
                phrases.push(newPhrase);
                await AsyncStorage.setItem('phrases', JSON.stringify(phrases));
                setPhrase('');
                setPhraseTranslation('');
                Alert.alert('Success', 'Phrase added successfully!');
            } catch (error) {
                console.error(error);
            }
        } else {
            Alert.alert('Error', 'Please enter both the phrase and its translation.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Word</Text>
            <View style={styles.inputContainer}>
                <Icon name="text-outline" size={20} color="#007acc" />
                <TextInput
                    style={styles.input}
                    placeholder="Word"
                    value={word}
                    onChangeText={setWord}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="language-outline" size={20} color="#007acc" />
                <TextInput
                    style={styles.input}
                    placeholder="Translation"
                    value={translation}
                    onChangeText={setTranslation}
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveWord}>
                <Text style={styles.saveButtonText}>Save Word</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Add New Phrase</Text>
            <View style={styles.inputContainer}>
                <Icon name="chatbubble-outline" size={20} color="#007acc" />
                <TextInput
                    style={styles.input}
                    placeholder="Phrase"
                    value={phrase}
                    onChangeText={setPhrase}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="language-outline" size={20} color="#007acc" />
                <TextInput
                    style={styles.input}
                    placeholder="Translation"
                    value={phraseTranslation}
                    onChangeText={setPhraseTranslation}
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={savePhrase}>
                <Text style={styles.saveButtonText}>Save Phrase</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007acc',
        marginVertical: 10,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#007acc',
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginLeft: 5,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#007acc',
        paddingVertical: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddWordsAndPhrasesScreen;
