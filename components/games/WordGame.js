import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordGame = () => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [skipped, setSkipped] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadWords();
    }, []);

    const loadWords = async () => {
        try {
            const storedWords = await AsyncStorage.getItem('words');
            const wordList = storedWords ? JSON.parse(storedWords) : [];
            setWords(wordList);
            if (wordList.length > 0) {
                generateChoices(wordList[0], wordList);
            }
        } catch (error) {
            console.error('Error loading words', error);
        }
    };

    const generateChoices = (currentWord, allWords) => {
        const correctChoice = currentWord.translation;
        const otherWords = allWords.filter((word) => word.translation !== correctChoice);

        let choicesArray = [correctChoice];
        while (choicesArray.length < 3 && otherWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherWords.length);
            const randomWord = otherWords.splice(randomIndex, 1)[0]; // Remove the chosen word from the array
            if (!choicesArray.includes(randomWord.translation)) {
                choicesArray.push(randomWord.translation);
            }
        }

        choicesArray.sort(() => Math.random() - 0.5); // Shuffle the array
        setChoices(choicesArray);
    };

    const handleChoice = (choice) => {
        if (choice === words[currentWordIndex].translation) {
            setScore(score + 1);
        } else {
            setIncorrect(incorrect + 1);
        }
        nextWord();
    };

    const nextWord = () => {
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < words.length) {
            setCurrentWordIndex(nextIndex);
            generateChoices(words[nextIndex], words);
        } else {
            setModalVisible(true); // End of game, show results
        }
    };

    const skipWord = () => {
        setSkipped(skipped + 1);
        nextWord();
    };

    const quitGame = () => {
        setModalVisible(true); // Show results on quit
    };

    const resetGame = () => {
        setModalVisible(false);
        setCurrentWordIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        loadWords();
    };

    if (words.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No words available. Add words to play the game.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Word: {words[currentWordIndex].word}</Text>
            {choices.map((choice, index) => (
                <TouchableOpacity key={index} style={styles.choiceButton} onPress={() => handleChoice(choice)}>
                    <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.buttonContainer}>
                <Button title="Skip" onPress={skipWord} />
                <Button title="Quit Game" onPress={quitGame} />
            </View>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Game Over!</Text>
                        <Text>Correct Answers: {score}</Text>
                        <Text>Incorrect Answers: {incorrect}</Text>
                        <Text>Skipped: {skipped}</Text>
                        <Button title="Close" onPress={resetGame} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    choiceButton: {
        backgroundColor: '#007acc',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default WordGame;
