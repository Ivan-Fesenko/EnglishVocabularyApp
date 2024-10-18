// Додавання слів та фраз

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            } catch (error) {
                console.error(error);
            }
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
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text>Add a new word:</Text>
            <TextInput
                style={styles.input}
                placeholder="Word"
                value={word}
                onChangeText={setWord}
            />
            <TextInput
                style={styles.input}
                placeholder="Translation"
                value={translation}
                onChangeText={setTranslation}
            />
            <Button title="Save Word" onPress={saveWord} />

            <Text style={{ marginTop: 20 }}>Add a new phrase:</Text>
            <TextInput
                style={styles.input}
                placeholder="Phrase"
                value={phrase}
                onChangeText={setPhrase}
            />
            <TextInput
                style={styles.input}
                placeholder="Translation"
                value={phraseTranslation}
                onChangeText={setPhraseTranslation}
            />
            <Button title="Save Phrase" onPress={savePhrase} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default AddWordsAndPhrasesScreen;
