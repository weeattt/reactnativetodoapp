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
 justify-content: flex-start;  {/* 컨텐츠를 보여주는 방식이다. flex 를 받은 요소들을 정렬 하는 방법이다. */}
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
    const [isReady, setIsReady] = useState(false);    /* 앱로딩용 */
    const [newTask, setNewTask] = useState('');     /* 사용자가 입력하는 할일 텍스트 */
    const width = Dimensions.get('window').width;
    
    const [tasks, setTasks ] = useState({
        '1': { id: '1', text: '1일1알고리즘', completed: false },  /* 객체를 받는 훅 */
    
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
        currentTasks[item.id] = item; /* 이 코드이해가 어렵지만, 결국 이 코드를 씀으로써 할일코드 배열이 어떻게 변해야하는지 보자. 논리를 위에서 바라보는것이다 */
        _saveTasks(currentTasks); /* 어쨋든 currentTasks[item.id] 는 렌더링하는 객체요소중 하나이다. */
    };
    

    const _handleTextChange = text => {
        setNewTask(text);    /* 사용자가 본인이 타자를 치고 있음을 인식하게 해주는 함수 */
    }

    const _onBlur = () => {
        setNewTask('');   /* netwask 변수에 빈문자열을 넣는다. */
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
                               key={item.id} /* 아, key 값이 item.id 구나 */
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