import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhraseGame = () => {
    const [phrases, setPhrases] = useState([]);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [skipped, setSkipped] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        loadPhrases();
    }, []);

    const loadPhrases = async () => {
        try {
            const storedPhrases = await AsyncStorage.getItem('phrases');
            let phraseList = storedPhrases ? JSON.parse(storedPhrases) : [];

            // Перемішуємо список фраз
            phraseList = phraseList.sort(() => Math.random() - 0.5);

            setPhrases(phraseList);
            if (phraseList.length > 0) {
                generateChoices(phraseList[0], phraseList);
            }
        } catch (error) {
            console.error('Error loading phrases', error);
        }
    };

    const generateChoices = (currentPhrase, allPhrases) => {
        const correctChoice = currentPhrase.translation;
        const otherPhrases = allPhrases.filter((phrase) => phrase.translation !== correctChoice);

        let choicesArray = [correctChoice];
        while (choicesArray.length < 3 && otherPhrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherPhrases.length);
            const randomPhrase = otherPhrases.splice(randomIndex, 1)[0];
            if (!choicesArray.includes(randomPhrase.translation)) {
                choicesArray.push(randomPhrase.translation);
            }
        }

        choicesArray.sort(() => Math.random() - 0.5); // Перемішуємо варіанти
        setChoices(choicesArray);
    };

    const handleChoice = (choice) => {
        if (choice === phrases[currentPhraseIndex].translation) {
            setScore(score + 1);
        } else {
            setIncorrect(incorrect + 1);
        }
        nextPhrase();
    };

    const nextPhrase = () => {
        const nextIndex = currentPhraseIndex + 1;
        if (nextIndex < phrases.length) {
            setCurrentPhraseIndex(nextIndex);
            generateChoices(phrases[nextIndex], phrases);
        } else {
            showModal(); // Показуємо результати
        }
    };

    const skipPhrase = () => {
        setSkipped(skipped + 1);
        nextPhrase();
    };

    const quitGame = () => {
        showModal(); // Показуємо результати при виході
    };

    const resetGame = () => {
        setModalVisible(false);
        setCurrentPhraseIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        loadPhrases();
    };

    const showModal = () => {
        setModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    if (phrases.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No phrases available. Add phrases to play the game.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Phrase: {phrases[currentPhraseIndex]?.phrase}</Text>
            {choices.map((choice, index) => (
                <TouchableOpacity key={index} style={styles.choiceButton} onPress={() => handleChoice(choice)}>
                    <Text style={styles.choiceText}>{choice}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.buttonContainer}>
                <Button title="Skip" onPress={skipPhrase} />
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

export default PhraseGame;

