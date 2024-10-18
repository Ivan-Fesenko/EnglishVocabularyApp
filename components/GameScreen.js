import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameScreen = ({ route, navigation }) => {
    const { mode } = route.params; // mode can be 'words' or 'phrases'
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storedData = await AsyncStorage.getItem(mode === 'words' ? 'words' : 'phrases');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setData(parsedData);
                generateQuestion(parsedData);
            }
        } catch (error) {
            console.error('Error loading data', error);
        }
    };

    const generateQuestion = (data) => {
        if (currentIndex >= data.length || currentIndex >= 20) {
            setFinished(true);
            return;
        }

        const correctItem = data[currentIndex];
        setCorrectAnswer(correctItem.translation);

        // Generate three options: one correct, two random wrong ones
        let randomOptions = [correctItem.translation];
        while (randomOptions.length < 3) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomTranslation = data[randomIndex].translation;
            if (!randomOptions.includes(randomTranslation)) {
                randomOptions.push(randomTranslation);
            }
        }

        // Shuffle the options
        randomOptions = randomOptions.sort(() => Math.random() - 0.5);

        setOptions(randomOptions);
    };

    const checkAnswer = (selectedOption) => {
        if (selectedOption === correctAnswer) {
            setScore(score + 1);
            Alert.alert('Correct!', 'Good job!', [{ text: 'Next', onPress: () => nextQuestion() }]);
        } else {
            Alert.alert('Wrong', `The correct answer was ${correctAnswer}`, [{ text: 'Next', onPress: () => nextQuestion() }]);
        }
    };

    const nextQuestion = () => {
        setCurrentIndex(currentIndex + 1);
        generateQuestion(data);
    };

    if (finished) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Game Over</Text>
                <Text style={styles.score}>Your score: {score}/20</Text>
                <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.questionTitle}>
                {mode === 'words' ? data[currentIndex]?.word : data[currentIndex]?.phrase}
            </Text>
            <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity key={index} style={styles.optionButton} onPress={() => checkAnswer(option)}>
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionsContainer: {
        width: '100%',
    },
    optionButton: {
        backgroundColor: '#007acc',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    score: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default GameScreen;
