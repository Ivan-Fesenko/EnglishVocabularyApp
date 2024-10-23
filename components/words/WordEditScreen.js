import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WordEditScreen = ({ route, navigation }) => {
    const { index, item } = route.params;
    const [word, setWord] = useState(item.word);
    const [translation, setTranslation] = useState(item.translation);

    const saveEdit = async () => {
        try {
            const storedWords = await AsyncStorage.getItem('words');
            const words = storedWords ? JSON.parse(storedWords) : [];
            words[index] = { word, translation };
            await AsyncStorage.setItem('words', JSON.stringify(words));
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Редагування слова</Text>
            <TextInput
                style={styles.input}
                value={word}
                onChangeText={setWord}
                placeholder="Введіть слово"
            />
            <TextInput
                style={styles.input}
                value={translation}
                onChangeText={setTranslation}
                placeholder="Введіть переклад"
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.saveButtonText}>Зберегти зміни</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#007acc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#007acc',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WordEditScreen;
