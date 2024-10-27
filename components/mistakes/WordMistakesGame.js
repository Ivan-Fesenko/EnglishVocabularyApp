import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordMistakesGame = () => {
    const [mistakeWords, setMistakeWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [choices, setChoices] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = async () => {
        const loadedMistakeWords = await loadMistakeWords();
        if (loadedMistakeWords.length > 0) {
            setMistakeWords(loadedMistakeWords);
            setCurrentWord(loadedMistakeWords[0]);
            generateChoices(loadedMistakeWords[0]);
        } else {
            setMistakeWords([]);
            setCurrentWord(null);
        }
    };

    const loadMistakeWords = async () => {
        try {
            const storedMistakes = await AsyncStorage.getItem('mistakeWords');
            const wordList = storedMistakes ? JSON.parse(storedMistakes) : [];
            return wordList;
        } catch (error) {
            console.error('Помилка завантаження помилкових слів:', error);
            return [];
        }
    };

    const generateChoices = async (word) => {
        if (!word || !word.translation) return;

        try {
            const storedWords = await AsyncStorage.getItem('words');
            const allWords = storedWords ? JSON.parse(storedWords) : [];

            const correctChoice = word.translation;
            const otherWords = allWords.filter(
                (w) => w.translation !== correctChoice
            );

            let choicesArray = [correctChoice];
            while (choicesArray.length < 3 && otherWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherWords.length);
                const randomWord = otherWords.splice(randomIndex, 1)[0];
                if (randomWord && !choicesArray.includes(randomWord.translation)) {
                    choicesArray.push(randomWord.translation);
                }
            }

            while (choicesArray.length < 3) {
                choicesArray.push('No answer');
            }

            setChoices(choicesArray.sort(() => Math.random() - 0.5));
        } catch (error) {
            console.error('Помилка генерації варіантів:', error);
        }
    };

    const handleChoice = (choice) => {
        if (!currentWord) return;

        if (choice === currentWord.translation) {
            removeWordFromList(currentWord);
            goToNextWord();
        } else {
            alert('Incorrect! Try again.');
        }
    };

    const removeWordFromList = (word) => {
        const updatedMistakeWords = mistakeWords.filter(
            (item) => item.word !== word.word || item.translation !== word.translation
        );
        setMistakeWords(updatedMistakeWords);
        AsyncStorage.setItem('mistakeWords', JSON.stringify(updatedMistakeWords));
    };

    const goToNextWord = () => {
        if (mistakeWords.length === 0) {
            setCurrentWord(null);
            endGame();
            return;
        }

        const nextIndex = mistakeWords.indexOf(currentWord) + 1;

        if (nextIndex < mistakeWords.length) {
            setCurrentWord(mistakeWords[nextIndex]);
            generateChoices(mistakeWords[nextIndex]);
        } else {
            setCurrentWord(null);
            endGame();
        }
    };

    const endGame = () => {
        setModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        setModalVisible(false);
        initializeGame();
    };

    return (
        <View style={styles.container}>
            {currentWord ? (
                <>
                    <Text style={styles.title}>
                        Word: {currentWord.word}
                    </Text>
                    {choices.map((choice, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.choiceButton}
                            onPress={() => handleChoice(choice)}
                        >
                            <Text style={styles.choiceText}>{choice}</Text>
                        </TouchableOpacity>
                    ))}
                </>
            ) : (
                <Text style={styles.noDataText}>
                    No mistakes to review. Play the game to add mistakes.
                </Text>
            )}

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                        <Text style={styles.modalTitle}>Well Done!</Text>
                        <Text style={styles.modalMessage}>
                            You have reviewed all mistakes!
                        </Text>
                        <TouchableOpacity style={styles.okButton} onPress={closeModal}>
                            <Text style={styles.okButtonText}>OK</Text>
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
        backgroundColor: '#f3e7e9',
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
    },
    choiceText: {
        color: '#fff',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 20,
        width: '85%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    okButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 18,
        color: '#ff6347',
        textAlign: 'center',
    },
});

export default WordMistakesGame;
