import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const AddWordsAndPhrasesScreen = () => {
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const [phrase, setPhrase] = useState('');
    const [phraseTranslation, setPhraseTranslation] = useState('');
    const [message, setMessage] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));

    const showMessage = (msg) => {
        setMessage(msg);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }, 2000);
        });
    };

    const saveWord = async () => {
        if (word && translation) {
            const newWord = { word, translation };
            try {
                const storedWords = await AsyncStorage.getItem('words');
                const words = storedWords ? JSON.parse(storedWords) : [];

                // Перевірка на дублювання слова
                const isDuplicate = words.some(
                    (item) => item.word.toLowerCase() === word.toLowerCase()
                );

                if (isDuplicate) {
                    showMessage('This word already exists!');
                } else {
                    words.push(newWord);
                    await AsyncStorage.setItem('words', JSON.stringify(words));
                    setWord('');
                    setTranslation('');
                    showMessage('Word added successfully!');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            showMessage('Please enter both the word and its translation.');
        }
    };

    const savePhrase = async () => {
        if (phrase && phraseTranslation) {
            const newPhrase = { phrase, translation: phraseTranslation };
            try {
                const storedPhrases = await AsyncStorage.getItem('phrases');
                const phrases = storedPhrases ? JSON.parse(storedPhrases) : [];

                // Перевірка на дублювання фрази
                const isDuplicate = phrases.some(
                    (item) => item.phrase.toLowerCase() === phrase.toLowerCase()
                );

                if (isDuplicate) {
                    showMessage('This phrase already exists!');
                } else {
                    phrases.push(newPhrase);
                    await AsyncStorage.setItem('phrases', JSON.stringify(phrases));
                    setPhrase('');
                    setPhraseTranslation('');
                    showMessage('Phrase added successfully!');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            showMessage('Please enter both the phrase and its translation.');
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.messageBox, { opacity: fadeAnim }]}>
                <Text style={styles.messageText}>{message}</Text>
            </Animated.View>

            <ScrollView contentContainerStyle={styles.scrollView}>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3e7e9',
    },
    scrollView: {
        padding: 20,
    },
    messageBox: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        marginHorizontal: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        zIndex: 1,
        alignItems: 'center',
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
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
