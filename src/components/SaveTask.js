import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background: #0000007d;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SaveButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
  padding: 5px 10px;
`;

const Content = styled.div`
  padding: 20px 30px;
  background: white;
  border-radius: 10px;
  position: relative;
`;

// Компонент для сохранения новой задачи
const SaveTask = (props) => {
    // Хук для работы с QueryClient из React Query
    const queryClient = useQueryClient();
    // Состояние для хранения текста новой задачи
    const [taskText, setTaskText] = useState('');

    // Обработчик клика для предотвращения закрытия модального окна при клике на содержимое
    const contentComponentClickHandle = (event) => {
        event.stopPropagation();
    };

    // Обработчик изменения текста новой задачи
    const handleTaskTextChange = (event) => {
        setTaskText(event.target.value);
    };

    // Обработчик сохранения новой задачи
    const handleSaveTask = () => {
        // Получаем текущий массив задач из локального хранилища или создаем новый, если он отсутствует
        const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Создаем новую задачу с инкрементальным ID, текстом и статусом "не выполнено"
        const newTask = {
            id: existingTasks.length, // Инкрементальный ID
            text: taskText,
            completed: false,
        };
        // Обновляем массив задач, добавляя новую задачу
        const updatedTasks = [...existingTasks, newTask];
        // Обновляем локальное хранилище новым массивом задач
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        // Сбрасываем состояние текста задачи
        setTaskText('');
        // Закрываем модальное окно с помощью переданной пропс-функции
        props.close();
        // Обновляем кэш React Query для задач, чтобы отобразить новую задачу в списке
        queryClient.invalidateQueries('tasks');
    };

    // Возвращаем JSX для отображения модального окна сохранения задачи
    return (
        <Backdrop onClick={props.close}>
            <Content onClick={contentComponentClickHandle}>
                <input
                    type="text"
                    value={taskText}
                    onChange={handleTaskTextChange}
                    placeholder="Введите текст задачи"
                />
                <SaveButton onClick={handleSaveTask}>Сохранить задачу</SaveButton>
            </Content>
        </Backdrop>
    );
};

// Экспортируем компонент для использования в других частях приложения
export default SaveTask;
