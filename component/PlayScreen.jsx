import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Örnek olarak FontAwesome ikon setini kullanabilirsiniz, istediğiniz ikon setini seçebilirsiniz
import { View, Text, ScrollView, TouchableOpacity ,StyleSheet} from 'react-native';
import {LanguageFind} from './apiService';
const PlayScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Basit Kartlar')} >
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{LanguageFind("basic_review")}</Text>
                    <FontAwesome name="play-circle" size={24} color="orange" style={styles.playIcon} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Çoktan seçmeli')}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{LanguageFind("multiple_answers")}</Text>
                    <FontAwesome name="play-circle" size={24} color="orange" style={styles.playIcon} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Kart Eşleştirme')}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{LanguageFind("match_carts")}</Text>
                    <FontAwesome name="play-circle" size={24} color="orange" style={styles.playIcon} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Writing Review')}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{LanguageFind("writing_review")}</Text>
                    <FontAwesome name="play-circle" size={24} color="orange" style={styles.playIcon} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardContainer} onPress={() => navigation.navigate('Audio Player')}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{LanguageFind("audio_player")}</Text>
                    <FontAwesome name="play-circle" size={24} color="orange" style={styles.playIcon} />
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    cardContainer: {
        width: '48%', // Kartların yarısını kaplayacak şekilde ayarlayın
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight:100
    },
    cardTitle: {
        fontSize: 16,
        marginBottom: 10,
        paddingRight:2,
        paddingLeft:2
    },
    playIcon: {
        marginLeft: 'auto', // Sağa hizalanmış oynatma simgesi
    },
});

export default PlayScreen;
