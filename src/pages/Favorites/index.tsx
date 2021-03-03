import React, { useEffect, useState }  from 'react';
import { ScrollView, View } from 'react-native';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeacher = JSON.parse(response);
               
                setFavorites(favoritedTeacher);
            }
        });
    }
    
    useFocusEffect(() => {
        loadFavorites();
    });
    
    return (
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos" />

            <ScrollView
                style={styles.teacherFavorite}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                }}
            >
            
            {favorites.map((teacher : Teacher ) => {
                return (
                    <TeacherItem 
                        key={teacher.id}
                        teacher={teacher}
                        favorited
                    />
                );
            })}

            </ScrollView>
        </View>
    );  
}

export default Favorites;