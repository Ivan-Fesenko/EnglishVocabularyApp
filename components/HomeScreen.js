import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native'; // Імпортуємо всі компоненти
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import InfoScreen from './common/InfoScreen'; // Імпорт вашого InfoScreen компонента

const HomeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            {/* Іконка інформації */}
            <Pressable
                style={styles.infoIcon}
                onPress={() => setModalVisible(true)}
            >
                <Icon name="information-circle-outline" size={30} color="#007acc" />
            </Pressable>

            {/* Основний контент */}
            <View style={styles.mainContent}>
                <Text style={styles.title}>Welcome to the Vocabulary App</Text>
                <Text style={styles.subtitle}>Learn and repeat words in English</Text>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate('Options')}
                >
                    <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Master English with ease!</Text>
            </View>

            {/* Модальне вікно з інформацією */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <BlurView intensity={80} style={styles.blurContainer}>
                    <View style={styles.modalContent}>
                        {/* Додаємо прокрутку для InfoScreen */}
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            <InfoScreen />
                        </ScrollView>
                        {/* Кнопка закриття у верхньому правому кутку */}
                        <Pressable style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                            <Icon name="close-circle" size={30} color="#007acc" />
                        </Pressable>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    infoIcon: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
    },
    startButton: {
        backgroundColor: '#007acc',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    startButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        backgroundColor: '#007acc',
        alignItems: 'center',
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
    },
    // Стилі для модального вікна
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',  // Легке затемнення фону
    },
    modalContent: {
        width: '85%',
        height: '70%',  // Більше місця для контенту
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        position: 'relative',
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default HomeScreen;
