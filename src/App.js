import React from "react";  
import styled, { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import { StatusBar, Dimensions } from "react-native";
import Input from "../components/input";
import { useState } from 'react';
import IconButton from "../components/IconButton";
import { images } from "./image";
import Task from "../components/task";
import AsyncStorage from "@react-native-async-storage/async-storage";  
import AppLoading from 'expo-app-loading';



const Container = styled.SafeAreaView`
 flex: 1;
 background-color: ${({ theme}) => theme.background}
 align-items: center;
 justify-content: flex-start;
 `;
{/* Text 컴포넌트에서 글자 색이 보라색으로 스타일링된 Title 이라는 새로운 컴포넌트 탄생 ! */}
const Title = styled.Text` 
 font-size: 50px;
 font-weight: 600;
 color: ${({ theme }) => theme.main};
 align-self: flex-start;
 margin: 0px 20px;
 `;

 const List = styled.ScrollView`
 flex: 1;
 width: ${({ width }) => width - 40}px;
`;
 
 export default function App() {
    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const width = Dimensions.get('window').width;
    
    const [tasks, setTasks ] = useState({
        '1': { id: '1', text: '1일1알고리즘', completed: false },
    
    });

    const _saveTasks = async tasks => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
            setTasks(tasks);
        } catch (e) {
          console.error(e);
        }
    };
    const _loadTasks = async () => {
        const loadedTasks = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(loadedTasks || '{}'));
    };
   

    const _addTask = () => {
         const ID = Date.now().toString();
         const newTaskObject = { 
            [ID]: { id: ID, text: newTask, completed: false}
         };
         setNewTask('');
         _saveTasks({ ...tasks, ...newTaskObject });
    };

    const _deleteTask = id => {
        const currentTasks = Object.assign({}, tasks);
        delete currentTasks[id];
        _saveTasks(currentTasks);
    };

    const _toggleTask = id => {
        const currentTasks = Object.assign({}, tasks);      /* 객체복사코드 구나 */
        currentTasks[id]['completed'] = !currentTasks[id]['completed']; /* 지정 불리안 값이 뭐든간에 반대 불리안 값으로 저장해라 */
        _saveTasks(currentTasks);
    };
    const _updateTask = item => {
        const currentTasks = Object.assign({}, tasks);
        currentTasks[item.id] = item;
        _saveTasks(currentTasks);
    };
    

    const _handleTextChange = text => {
        setNewTask(text);
    }

    const _onBlur = () => {
        setNewTask('');
    };
    

    
   

    return isReady ? (
        <ThemeProvider theme={theme}>
            <Container>
                <StatusBar 
                  barStyle="light-content"
                  backgroundColor={theme.background}
                />
                <Title>TODO list</Title>
                <Input
                  placeholder="+ Add a Task"
                  value={newTask} /* onchangetext 로 바꾼걸 어따 저장해? 이 밸류에 저장하지 */
                  onChangeText={_handleTextChange} /* value 가 변할때 마다 newTask 에 저장하도록 작성 */
                  onSubmitEditing={_addTask} /* 완료버튼 누르면 내용 확인하고 newtask 초기화하도록 작성 */
                  onBlur={_onBlur}
                  />
                  <List width={width}>
                    {Object.values(tasks)
                        .reverse()
                        .map(item => (
                             <Task
                               key={item.id} 
                               item={item} 
                               deleteTask={_deleteTask}
                               toggleTask={_toggleTask}
                               updateTask={_updateTask}
                               
                             />
                        ))}
                  </List>
            </Container>
        </ThemeProvider>
    ) : (
      <AppLoading
        startAsync={_loadTasks}
        onFinish={() => setIsReady(true)}
        onError={console.error}
       />
    );
 }