import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const WordListScreen = ({ navigation }) => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const loadWords = async () => {
            try {
                const storedWords = await AsyncStorage.getItem('words');
                if (storedWords !== null) {
                    setWords(JSON.parse(storedWords));
                }
            } catch (error) {
                console.error('Error loading words', error);
            }
        };

        // Listener to reload words when screen is focused
        const focusListener = navigation.addListener('focus', () => {
            loadWords();
        });

        return focusListener;  // Cleanup the listener when the component is unmounted
    }, [navigation]);

    const confirmDeleteWord = (index) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this word?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => deleteWord(index),
                },
            ],
            { cancelable: true }
        );
    };

    const deleteWord = async (id) => {
        const updatedWords = words.filter((_, index) => index !== id);
        setWords(updatedWords);
        await AsyncStorage.setItem('words', JSON.stringify(updatedWords));
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.word}>{index + 1}. {item.word} - {item.translation}</Text>
            <View style={styles.separator} />
            <View style={styles.actionIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('WordEdit', { index, item })}>
                    <Icon name="create-outline" size={24} color="#007acc" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDeleteWord(index)} style={styles.deleteButton}>
                    <Icon name="trash-outline" size={24} color="#ff6347" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={words}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No words added yet.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f3e7e9',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    word: {
        flex: 1,
        fontSize: 18,
        color: '#333',
    },
    separator: {
        width: 1,
        height: '100%',
        backgroundColor: '#ccc',
        marginHorizontal: 10,
    },
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        marginLeft: 10,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
});

export default WordListScreen;
