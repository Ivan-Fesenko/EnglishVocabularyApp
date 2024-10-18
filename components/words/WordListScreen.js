//Створення екрану для відображення списку слів
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordListScreen = ({ navigation }) => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const loadWords = async () => {
            try {
                const storedWords = await AsyncStorage.getItem('words');
                if (storedWords) {
                    setWords(JSON.parse(storedWords));
                }
            } catch (error) {
                console.error(error);
            }
        };

        const focusListener = navigation.addListener('focus', () => {
            loadWords();
        });

        return focusListener;
    }, [navigation]);

    const deleteWord = async (index) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this word?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        let updatedWords = [...words];
                        updatedWords.splice(index, 1);
                        setWords(updatedWords);
                        await AsyncStorage.setItem('words', JSON.stringify(updatedWords));
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={words}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.wordItem}>
                        <Text>{item.word} - {item.translation}</Text>
                        <Button title="Edit" onPress={() => navigation.navigate('WordEdit', { index, item })} />
                        <Button title="Delete" onPress={() => deleteWord(index)} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    wordItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default WordListScreen;
