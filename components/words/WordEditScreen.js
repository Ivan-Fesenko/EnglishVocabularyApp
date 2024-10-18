import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
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
            <TextInput
                style={styles.input}
                value={word}
                onChangeText={setWord}
            />
            <TextInput
                style={styles.input}
                value={translation}
                onChangeText={setTranslation}
            />
            <Button title="Save Changes" onPress={saveEdit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default WordEditScreen;
