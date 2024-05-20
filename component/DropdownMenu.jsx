// DropdownMenu.js

import React from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import { LanguageFind} from './apiService';
const DropdownMenu = ({ isVisible, onClose, onLogout, navigation }) => {
    if (!isVisible) return null;
    return (
        <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
                <Text style={styles.dropdownItem}>Profil</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Grammer Notlarım')}>
                <Text style={styles.dropdownItem}>Grammer Notlarım</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('Kart Gruplari')}>
                <Text style={styles.dropdownItem}>{LanguageFind("cart_groups")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Kart Anlam Tipleri')}>
                <Text style={styles.dropdownItem}>{LanguageFind("cart_mean_types")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout}>
                <Text style={styles.dropdownItem}>{LanguageFind("logout")}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default DropdownMenu;
const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        top: 40, // header'ın yüksekliğini geçmesi için bu değeri ayarlayabilirsiniz.
        right: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        padding: 5,
    },
    dropdownItem: {
        padding: 10,
    },
});