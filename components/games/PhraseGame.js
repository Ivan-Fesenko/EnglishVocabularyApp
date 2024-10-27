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
        const otherPhrases = allPhrases.filter(
            (phrase) => phrase.translation !== correctChoice
        );

        let choicesArray = [correctChoice];
        while (choicesArray.length < 3 && otherPhrases.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherPhrases.length);
            const randomPhrase = otherPhrases.splice(randomIndex, 1)[0];
            if (!choicesArray.includes(randomPhrase.translation)) {
                choicesArray.push(randomPhrase.translation);
            }
        }

        choicesArray.sort(() => Math.random() - 0.5);
        setChoices(choicesArray);
    };

    const handleChoice = async (choice) => {
        const currentPhrase = phrases[currentPhraseIndex];
        if (choice === currentPhrase.translation) {
            setScore(score + 1);
        } else {
            setIncorrect(incorrect + 1);
            await saveMistake(currentPhrase);
        }
        nextPhrase();
    };

    const saveMistake = async (phrase) => {
        try {
            const storedMistakes = await AsyncStorage.getItem('phraseMistakes');
            let mistakesList = storedMistakes ? JSON.parse(storedMistakes) : [];
            if (!mistakesList.some((item) => item.phrase === phrase.phrase)) {
                mistakesList.push(phrase);
                await AsyncStorage.setItem('phraseMistakes', JSON.stringify(mistakesList));
            }
        } catch (error) {
            console.error('Error saving mistake', error);
        }
    };

    const nextPhrase = () => {
        const nextIndex = currentPhraseIndex + 1;
        if (nextIndex < phrases.length) {
            setCurrentPhraseIndex(nextIndex);
            generateChoices(phrases[nextIndex], phrases);
        } else {
            showModal();
        }
    };

    const skipPhrase = async () => {
        setSkipped(skipped + 1);
        await saveMistake(phrases[currentPhraseIndex]);
        nextPhrase();
    };

    const quitGame = () => {
        showModal();
    };

    const resetGame = () => {
        setModalVisible(false);
        setCurrentPhraseIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        loadPhrases(); // Скидання гри та перезавантаження фраз
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
                <Text style={styles.noDataText}>
                    No phrases available. Add phrases to play the game.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Phrase: {phrases[currentPhraseIndex]?.phrase}
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.skipButton} onPress={skipPhrase}>
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quitButton} onPress={quitGame}>
                    <Text style={styles.buttonText}>Quit</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
                        <Text style={styles.modalTitle}>Game Results</Text>
                        <Text style={styles.resultText}>Correct Answers: {score}</Text>
                        <Text style={styles.resultText}>Incorrect Answers: {incorrect}</Text>
                        <Text style={styles.resultText}>Skipped: {skipped}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={resetGame}>
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

export default PhraseGame;
