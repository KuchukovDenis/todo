import React, { useEffect } from 'react';
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

const DeleteButton = styled.button`
  background-color: #ff5252;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 10px;
  cursor: pointer;
  display: block;
  margin: 20px auto 10px;
`;

// Компонент для редактирования задачи
const EditTask = (props) => {
    // Хук для работы с QueryClient из React Query
    const queryClient = useQueryClient();

    // Обработчик клика по фону для предотвращения закрытия модального окна
    const handleBackdropClick = (event) => {
        event.stopPropagation();
    };

    // Эффект, запускающийся при монтировании компонента, загружает текст выбранной задачи в инпут
    useEffect(() => {
        // Получаем текущий массив задач из локального хранилища или создаем новый, если он отсутствует
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Пытаемся найти задачу с заданным ID, но результат не используется
        tasks.find((task) => task.id === props.taskId);
    }, [props.taskId]);

    // Хук React Query для удаления задачи с использованием мутации
    const mutationDeleteTask = useMutation(
        // Асинхронная функция, удаляющая задачу из локального хранилища
        async (taskId) => {
            const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            // Создаем новый массив задач, исключая задачу с заданным ID
            const updatedTasks = existingTasks.filter((task) => task.id !== taskId);
            // Обновляем локальное хранилище новым массивом задач
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            // Возвращаем обновленный массив задач
            return updatedTasks;
        },
        {
            // Обновляем данные в QueryClient после успешного выполнения мутации
            onSuccess: (data) => {
                queryClient.setQueryData('tasks', data);
                // Закрываем модальное окно после удаления задачи
                props.close();
            },
        }
    );

    // Обработчик клика по кнопке "Удалить"
    const handleDeleteClick = () => {
        // Вызываем мутацию для удаления задачи и передаем ID задачи
        mutationDeleteTask.mutate(props.taskId);
    };

    // Возвращаем JSX для отображения модального окна удаления задачи
    return (
        <Backdrop onClick={handleBackdropClick}>
            <Content>
                <p style={{ textAlign: 'center' }}>Удалить задачу?</p>
                <DeleteButton onClick={handleDeleteClick}>Удалить</DeleteButton>
            </Content>
        </Backdrop>
    );
};

// Экспортируем компонент для использования в других частях приложения
export default EditTask;

