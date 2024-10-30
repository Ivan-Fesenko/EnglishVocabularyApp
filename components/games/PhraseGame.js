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

const PhraseGame = ({ navigation }) => {
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
        while (choicesArray.length < 4 && otherPhrases.length > 0) {
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

    const showModal = () => {
        setModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const resetGame = () => {
        setModalVisible(false);
        setCurrentPhraseIndex(0);
        setScore(0);
        setIncorrect(0);
        setSkipped(0);
        loadPhrases();
    };

    const choiceLabels = ['A', 'B', 'C', 'D'];

    return (
        <View style={styles.container}>
            {phrases.length > 0 ? (
                <>
                    <View style={styles.highlightedPhraseContainer}>
                        <Text style={styles.highlightedPhraseText}>
                            {phrases[currentPhraseIndex]?.phrase}
                        </Text>
                    </View>
                    <Text style={styles.promptText}>Choose the correct translation:</Text>

                    {choices.map((choice, index) => (
                        <View key={index} style={styles.choiceContainer}>
                            <View style={styles.choiceLabelContainer}>
                                <Text style={styles.choiceLabel}>{choiceLabels[index]}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.choiceButton}
                                onPress={() => handleChoice(choice)}
                            >
                                <Text style={styles.choiceText}>{choice}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <View style={styles.topButtonContainer}>
                        <TouchableOpacity style={styles.skipButton} onPress={skipPhrase}>
                            <Text style={styles.buttonText}>Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.getResultsButton} onPress={showModal}>
                            <Text style={styles.buttonText}>Get Results Now</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.quitButton}
                        onPress={() => navigation.navigate('Options')}
                    >
                        <Text style={styles.buttonText}>Quit Game</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.noDataText}>
                    No phrases available. Add phrases to play the game.
                </Text>
            )}

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
        backgroundColor: '#f3e7e9',
    },
    highlightedPhraseContainer: {
        padding: 15,
        backgroundColor: '#ffd700',
        borderRadius: 20,
        elevation: 5,
        marginBottom: 15,
        width: '90%',
        alignItems: 'center',
    },
    highlightedPhraseText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    promptText: {
        fontSize: 18,
        color: '#4b5563',
        marginBottom: 20,
        textAlign: 'center',
    },
    choiceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        width: '90%',
    },
    choiceLabelContainer: {
        backgroundColor: '#2563eb',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    choiceLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    choiceButton: {
        backgroundColor: '#1E90FF',
        flex: 1,
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
    },
    choiceText: {
        color: '#fff',
        fontSize: 18,
    },
    topButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 30,
        marginBottom: 20,
    },
    skipButton: {
        backgroundColor: '#f59e0b',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    getResultsButton: {
        backgroundColor: '#9333ea',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    quitButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginTop: 20,
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
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 18,
        color: '#ef4444',
        textAlign: 'center',
    },
});

export default PhraseGame;

