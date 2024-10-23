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
        // Скидання стану гри
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
            console.log('Завантажено помилкові фрази:', phraseList);
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
            while (choicesArray.length < 3 && otherPhrases.length > 0) {
                const randomIndex = Math.floor(Math.random() * otherPhrases.length);
                const randomPhrase = otherPhrases.splice(randomIndex, 1)[0];
                if (randomPhrase && !choicesArray.includes(randomPhrase.translation)) {
                    choicesArray.push(randomPhrase.translation);
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
        console.log('Оновлено список помилкових фраз:', updatedMistakePhrases);
    };

    const goToNextPhrase = () => {
        if (mistakePhrases.length === 0) {
            setCurrentPhrase(null);
            endGame(); // Завершення гри, якщо більше немає фраз
            return;
        }

        const nextIndex = mistakePhrases.indexOf(currentPhrase) + 1;

        if (nextIndex < mistakePhrases.length) {
            setCurrentPhrase(mistakePhrases[nextIndex]);
            generateChoices(mistakePhrases[nextIndex]);
        } else {
            setCurrentPhrase(null); // Скидання поточної фрази перед завершенням
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
        initializeGame(); // Почати гру з початку
    };

    return (
        <View style={styles.container}>
            {currentPhrase ? (
                <>
                    <Text style={styles.title}>
                        Phrase: {currentPhrase.phrase}
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
                        <Text style={styles.modalTitle}>Mistake Review Completed</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
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
        justifyContent: 'center',
        width: '80%',
        marginTop: 20,
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007acc',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});

export default PhraseMistakesGame;
