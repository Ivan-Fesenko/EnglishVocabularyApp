import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
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
            let wordList = storedWords ? JSON.parse(storedWords) : [];
            wordList = wordList.sort(() => Math.random() - 0.5);
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
            const randomWord = otherWords.splice(randomIndex, 1)[0];
            if (!choicesArray.includes(randomWord.translation)) {
                choicesArray.push(randomWord.translation);
            }
        }

        choicesArray.sort(() => Math.random() - 0.5);
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
            showModal(); // Показуємо результати
        }
    };

    const skipWord = () => {
        setSkipped(skipped + 1);
        nextWord();
    };

    const quitGame = () => {
        showModal(); // Показуємо результати при виході
    };

    const resetGame = () => {
        setModalVisible(false);
        setCurrentWordIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        loadWords();
    };

    const showModal = () => {
        setModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Word: {words[currentWordIndex]?.word}</Text>
            {choices.map((choice, index) => (
                <TouchableOpacity key={index} style={styles.choiceButton} onPress={() => handleChoice(choice)}>
                    <Text style={styles.choiceText}>{choice}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.buttonContainer}>
                <Button title="Skip" onPress={skipWord} />
                <Button title="Quit Game" onPress={quitGame} />
            </View>

            {/* Модальне вікно з результатами */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                        <Text style={styles.modalTitle}>Результати гри</Text>
                        <Text style={styles.resultText}>Правильні відповіді: {score}</Text>
                        <Text style={styles.resultText}>Неправильні відповіді: {incorrect}</Text>
                        <Text style={styles.resultText}>Пропущено: {skipped}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={resetGame}>
                            <Text style={styles.closeButtonText}>Закрити</Text>
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
    choiceText: {
        color: '#fff',
        fontSize: 18,
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
        padding: 30,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
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
});

export default WordGame;


