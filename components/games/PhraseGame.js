import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhraseGame = () => {
    const [phrases, setPhrases] = useState([]);
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [skipped, setSkipped] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadPhrases();
    }, []);

    const loadPhrases = async () => {
        try {
            const storedPhrases = await AsyncStorage.getItem('phrases');
            const phraseList = storedPhrases ? JSON.parse(storedPhrases) : [];
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
            const randomPhrase = otherPhrases.splice(randomIndex, 1)[0]; // Remove the chosen phrase from the array
            if (!choicesArray.includes(randomPhrase.translation)) {
                choicesArray.push(randomPhrase.translation);
            }
        }

        choicesArray.sort(() => Math.random() - 0.5); // Shuffle the array
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
            setModalVisible(true); // End of game, show results
        }
    };

    const skipPhrase = () => {
        setSkipped(skipped + 1);
        nextPhrase();
    };

    const quitGame = () => {
        setModalVisible(true); // Show results on quit
    };

    const resetGame = () => {
        setModalVisible(false);
        setCurrentPhraseIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        loadPhrases();
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
            <Text style={styles.title}>Phrase: {phrases[currentPhraseIndex].phrase}</Text>
            {choices.map((choice, index) => (
                <TouchableOpacity key={index} style={styles.choiceButton} onPress={() => handleChoice(choice)}>
                    <Text>{choice}</Text>
                </TouchableOpacity>
            ))}
            <View style={styles.buttonContainer}>
                <Button title="Skip" onPress={skipPhrase} />
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

export default PhraseGame;
