import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordGame = () => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [skipped, setSkipped] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        loadWords();
    }, []);

    const loadWords = async () => {
        try {
            const storedWords = await AsyncStorage.getItem('words');
            const wordList = storedWords ? JSON.parse(storedWords) : [];
            setWords(wordList.sort(() => Math.random() - 0.5));
            if (wordList.length > 0) {
                generateChoices(wordList[0], wordList);
            }
        } catch (error) {
            console.error('Error loading words', error);
        }
    };

    const generateChoices = (currentWord, allWords) => {
        const correctChoice = currentWord.translation;
        const otherWords = allWords.filter(word => word.translation !== correctChoice);

        let choicesArray = [correctChoice];
        while (choicesArray.length < 3 && otherWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherWords.length);
            const randomWord = otherWords.splice(randomIndex, 1)[0];
            if (!choicesArray.includes(randomWord.translation)) {
                choicesArray.push(randomWord.translation);
            }
        }

        choicesArray.sort(() => Math.random() - 0.5);
        setChoices(choicesArray);
    };

    const saveToMistakeWords = async (word) => {
        try {
            const storedMistakeWords = await AsyncStorage.getItem('mistakeWords');
            const mistakeWords = storedMistakeWords ? JSON.parse(storedMistakeWords) : [];

            const isWordInMistakes = mistakeWords.some(
                mistake => mistake.word === word.word && mistake.translation === word.translation
            );

            if (!isWordInMistakes) {
                const updatedMistakeWords = [...mistakeWords, word];
                await AsyncStorage.setItem('mistakeWords', JSON.stringify(updatedMistakeWords));
            }
        } catch (error) {
            console.error('Error saving mistake word', error);
        }
    };

    const handleChoice = async (choice) => {
        const currentWord = words[currentWordIndex];

        if (choice === currentWord.translation) {
            setScore(score + 1);
        } else {
            setIncorrect(incorrect + 1);
            await saveToMistakeWords(currentWord);
        }
        nextWord();
    };

    const skipWord = async () => {
        const currentWord = words[currentWordIndex];
        setSkipped(skipped + 1);
        await saveToMistakeWords(currentWord);
        nextWord();
    };

    const nextWord = () => {
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < words.length) {
            setCurrentWordIndex(nextIndex);
            generateChoices(words[nextIndex], words);
        } else {
            showModal();
        }
    };

    const showModal = () => {
        setModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const resetGame = () => {
        setCurrentWordIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        setModalVisible(false);
        loadWords(); // Перезавантаження слів і скидання стану гри
    };

    return (
        <View style={styles.container}>
            {words.length > 0 ? (
                <>
                    <Text style={styles.title}>Word: {words[currentWordIndex]?.word}</Text>
                    {choices.map((choice, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.choiceButton}
                            onPress={() => handleChoice(choice)}
                        >
                            <Text style={styles.choiceText}>{choice}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.skipButton} onPress={skipWord}>
                            <Text style={styles.buttonText}>Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quitButton} onPress={showModal}>
                            <Text style={styles.buttonText}>Quit Game</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <Text style={styles.noDataText}>No words available. Add words to play.</Text>
            )}

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                        <Text style={styles.modalTitle}>Game Results</Text>
                        <Text style={styles.resultText}>Correct Answers: {score}</Text>
                        <Text style={styles.resultText}>Incorrect Answers: {incorrect}</Text>
                        <Text style={styles.resultText}>Skipped: {skipped}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={resetGame}
                        >
                            <Text style={styles.closeButtonText}>OK</Text>
                        </TouchableOpacity>
                    </Animated.View>
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
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
    },
    choiceButton: {
        backgroundColor: '#007acc',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        elevation: 3,
    },
    choiceText: {
        color: '#fff',
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
    },
    skipButton: {
        backgroundColor: '#ffa500',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    quitButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#007acc',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 18,
        color: '#ff6347',
        textAlign: 'center',
    },
});

export default WordGame;
