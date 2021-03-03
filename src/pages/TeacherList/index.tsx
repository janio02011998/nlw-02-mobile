import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import api from '../../services/api';

import styles from './styles';
import AsyncStorage from '@react-native-community/async-storage';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeacher = JSON.parse(response);
                const favoritedTeacherIds = favoritedTeacher.map((teacher: Teacher) => {
                    return teacher.id;
                })

                setFavorites(favoritedTeacherIds);
            }
        });
    }
    
    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    async function handleFiltersSubmit() {
        loadFavorites()

        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        })

        setIsFiltersVisible(!isFiltersVisible);

        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                {isFiltersVisible && (<View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput
                        value={subject}
                        style={styles.input}
                        onChangeText={text => setSubject(text)}
                        placeholder="Qual a matéria?"
                        placeholderTextColor="#c1bccc"
                    />

                    <View style={styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput
                                value={week_day}
                                onChangeText={text => setWeekDay(text)}
                                style={styles.input}
                                placeholder="Qual o dia?"
                                placeholderTextColor="#c1bccc"
                            />
                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput
                                value={time}
                                onChangeText={text => setTime(text)}
                                style={styles.input}
                                placeholder="Qual horário?"
                                placeholderTextColor="#c1bccc"
                            />
                        </View>

                    </View>
                    <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>
                )}
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                }}
            >

                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem 
                            key={teacher.id} 
                            teacher={teacher} 
                            favorited={favorites.includes(teacher.id)}
                        />
                    )
                })}

            </ScrollView>

        </View>
    );
}

export default TeacherList;