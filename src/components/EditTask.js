import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

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

const Content = styled.div`
  padding: 20px 30px;
  background: white;
  border-radius: 10px;
  position: relative;
`;

const SaveButton = styled.button`
  background-color: #0a8f55;
  color: #fff;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  margin-left: 20px;
  padding: 4px;
`;

// Компонент для редактирования существующей задачи
const EditTask = (props) => {
    // Хук для работы с QueryClient из React Query
    const queryClient = useQueryClient();
    // Состояние для хранения текста редактируемой задачи
    const [editedText, setEditedText] = useState('');

    // Обработчик клика по фону для предотвращения закрытия модального окна
    const handleBackdropClick = (event) => {
        event.stopPropagation();
    };

    // Эффект, запускающийся при изменении ID редактируемой задачи
    useEffect(() => {
        // Получаем текущий массив задач из локального хранилища или создаем новый, если он отсутствует
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Находим выбранную задачу по её ID и устанавливаем её текст в состояние
        const selectedTask = tasks.find((task) => task.id === props.taskId);

        if (selectedTask) {
            setEditedText(selectedTask.text);
        }
    }, [props.taskId]);

    // Обработчик изменения текста в поле ввода
    const handleInputChange = (event) => {
        setEditedText(event.target.value);
    };

    // Хук React Query для обновления текста задачи с использованием мутации
    const mutationUpdateText = useMutation(
        // Асинхронная функция, обновляющая текст задачи в локальном хранилище
        async ({ taskId, newText }) => {
            const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            // Создаем новый массив задач, обновляя текст выбранной задачи
            const updatedTasks = existingTasks.map((task) =>
                task.id === taskId ? { ...task, text: newText } : task
            );
            // Обновляем локальное хранилище новым массивом задач
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            // Возвращаем обновленный массив задач
            return updatedTasks;
        },
        {
            // Обновляем данные в QueryClient после успешного выполнения мутации
            onSuccess: (data) => {
                queryClient.setQueryData('tasks', data);
            },
        }
    );

    // Обработчик клика по кнопке "Сохранить изменения"
    const handleSaveClick = () => {
        // Вызываем мутацию для обновления текста задачи и передаем ID и новый текст
        mutationUpdateText.mutate({ taskId: props.taskId, newText: editedText });
        // Закрываем модальное окно редактирования
        props.close();
    };

    // Возвращаем JSX для отображения модального окна редактирования задачи
    return (
        <Backdrop onClick={handleBackdropClick}>
            <Content>
                <p style={{ textAlign: 'center' }}>Редактирование задачи</p>
                <input
                    type="text"
                    value={editedText}
                    onChange={handleInputChange}
                    placeholder="Введите новый текст задачи"
                />
                <SaveButton onClick={handleSaveClick}>Сохранить изменения</SaveButton>
            </Content>
        </Backdrop>
    );
};

// Экспортируем компонент для использования в других частях приложения
export default EditTask;

