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

const PhraseMistakesGame = () => {
    const [mistakePhrases, setMistakePhrases] = useState([]);
    const [currentPhrase, setCurrentPhrase] = useState(null);
    const [choices, setChoices] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = async () => {
        const loadedMistakePhrases = await loadMistakePhrases();
        if (loadedMistakePhrases.length > 0) {
            setMistakePhrases(loadedMistakePhrases);
            setCurrentPhrase(loadedMistakePhrases[0]);
            generateChoices(loadedMistakePhrases[0]);
        } else {
            setMistakePhrases([]);
            setCurrentPhrase(null);
        }
    };

    const loadMistakePhrases = async () => {
        try {
            const storedMistakes = await AsyncStorage.getItem('phraseMistakes');
            const phraseList = storedMistakes ? JSON.parse(storedMistakes) : [];
            return phraseList;
        } catch (error) {
            console.error('Помилка завантаження помилкових фраз:', error);
            return [];
        }
    };

    const generateChoices = async (phrase) => {
        if (!phrase || !phrase.translation) return;

        try {
            const storedPhrases = await AsyncStorage.getItem('phrases');
            const allPhrases = storedPhrases ? JSON.parse(storedPhrases) : [];

            const correctChoice = phrase.translation;
            const otherPhrases = allPhrases.filter(
                (p) => p.translation !== correctChoice
            );

            let choicesArray = [correctChoice];
            while (choicesArray.length < 4 && otherPhrases.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherPhrases.length);
                const randomPhrase = otherPhrases.splice(randomIndex, 1)[0];
                if (randomPhrase && !choicesArray.includes(randomPhrase.translation)) {
                    choicesArray.push(randomPhrase.translation);
                }
            }

            while (choicesArray.length < 4) {
                choicesArray.push('No answer');
            }

            setChoices(choicesArray.sort(() => Math.random() - 0.5));
        } catch (error) {
            console.error('Помилка генерації варіантів:', error);
        }
    };

    const handleChoice = (choice) => {
        if (!currentPhrase) return;

        if (choice === currentPhrase.translation) {
            removePhraseFromList(currentPhrase);
            goToNextPhrase();
        } else {
            alert('Incorrect! Try again.');
        }
    };

    const removePhraseFromList = (phrase) => {
        const updatedMistakePhrases = mistakePhrases.filter(
            (item) => item.phrase !== phrase.phrase || item.translation !== phrase.translation
        );
        setMistakePhrases(updatedMistakePhrases);
        AsyncStorage.setItem('phraseMistakes', JSON.stringify(updatedMistakePhrases));
    };

    const goToNextPhrase = () => {
        if (mistakePhrases.length === 0) {
            setCurrentPhrase(null);
            endGame();
            return;
        }

        const nextIndex = mistakePhrases.indexOf(currentPhrase) + 1;

        if (nextIndex < mistakePhrases.length) {
            setCurrentPhrase(mistakePhrases[nextIndex]);
            generateChoices(mistakePhrases[nextIndex]);
        } else {
            setCurrentPhrase(null);
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

    const choiceLabels = ['A', 'B', 'C', 'D'];

    return (
        <View style={styles.container}>
            {currentPhrase ? (
                <>
                    <View style={styles.highlightedPhraseContainer}>
                        <Text style={styles.highlightedPhraseText}>
                            {currentPhrase.phrase}
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
    highlightedPhraseContainer: {
        padding: 15,
        backgroundColor: '#ffd700', // Зелене виділення
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
        color: '#666',
        textAlign: 'center',
    },
});

export default PhraseMistakesGame;
