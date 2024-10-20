import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const InfoScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Про Додаток "Vocabulary App"</Text>
            <Text style={styles.paragraph}>
                Цей додаток створений для того, щоб допомогти вам вивчати та запам’ятовувати
                англійські слова і фрази. Він дозволяє додавати нові слова та фрази, повторювати їх
                і відстежувати ваш прогрес.
            </Text>
            <Text style={styles.paragraph}>
                Основні можливості додатку:
            </Text>
            <View style={styles.list}>
                <Text style={styles.listItem}>1. Додавання нових слів та фраз.</Text>
                <Text style={styles.listItem}>2. Практика через режими повторення.</Text>
                <Text style={styles.listItem}>3. Перевірка ваших знань.</Text>
                <Text style={styles.listItem}>4. Відстеження прогресу для мотивації.</Text>
            </View>
            <Text style={styles.paragraph}>
                Додаток ідеально підходить для тих, хто хоче покращити свої мовні навички
                інтерактивно та ефективно.
            </Text>
            <Text style={styles.footer}>Версія 1.0.0</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
        textAlign: 'left',
        alignSelf: 'stretch',
    },
    paragraph: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        lineHeight: 22,
        textAlign: 'left',
    },
    list: {
        marginLeft: 10,
    },
    listItem: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        lineHeight: 22,
        textAlign: 'left',
    },
    footer: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        textAlign: 'left',
    },
});

export default InfoScreen;

