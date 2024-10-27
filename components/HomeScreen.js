import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import InfoScreen from './common/InfoScreen';

const HomeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            {/* Info Icon */}
            <TouchableOpacity
                style={styles.infoIcon}
                onPress={() => setModalVisible(true)}
            >
                <Image
                    source={require('../assets/info.png')} // Replace with your custom icon
                    style={styles.infoIconImage}
                />
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Circular Logo Container */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/1.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Boost Your Vocabulary</Text>
                <Text style={styles.subtitle}>Learn English effortlessly!</Text>

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate('Options')}
                >
                    <Text style={styles.startButtonText}>Get Started</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Master English with ease!</Text>
            </View>

            {/* Info Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <BlurView intensity={80} style={styles.blurContainer}>
                    <View style={styles.modalContent}>
                        <InfoScreen />
                        {/* Close Icon */}
                        <TouchableOpacity
                            style={styles.closeIcon}
                            onPress={() => setModalVisible(false)}
                        >
                            <Icon name="close-circle" size={30} color="#007acc" />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3e7e9',
    },
    infoIcon: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    infoIconImage: {
        width: 30,
        height: 30,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
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
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: '85%',
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default HomeScreen;
