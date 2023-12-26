import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import EditTask from './EditTask';
import DeleteTask from './DeleteTask';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  width: 400px;
  background: aqua;
  border-radius: 10px;
`;

const TaskText = styled.span`
  flex-grow: 1;
  margin-right: 8px;
  margin-left: 10px;
  padding: 10px 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
`;

const Checkbox = styled.input`
  margin-right: 4px;
  margin-left: 10px;
`;

const EditButton = styled.button`
  background-color: #0a8f55;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  padding: 5px;
`;

const DeleteButton = styled.button`
  background-color: #ff5252;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  padding: 5px;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  margin-bottom: 20px;
  padding: 8px;
  border-radius: 10px;
`;
// Функция для получения задач из локального хранилища
const fetchTasksFromLocalStorage = async () => {
    // Извлекаем задачи из локального хранилища, парсим JSON. Если задачи отсутствуют, возвращаем пустой массив.
    return JSON.parse(localStorage.getItem('tasks')) || [];
};

// Функция для обновления статуса задачи в локальном хранилище
const updateTaskStatusInLocalStorage = async ({ taskId, completed }) => {
    // Получаем текущий массив задач из локального хранилища или создаем новый, если он отсутствует.
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Создаем новый массив, обновляя статус задачи с указанным taskId.
    const updatedTasks = existingTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
    );
    // Обновляем локальное хранилище новым массивом задач.
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    // Возвращаем обновленный массив задач.
    return updatedTasks;
};

// Компонент для отображения списка задач
export const TasksList = () => {
    // Хук для работы с QueryClient из React Query
    const queryClient = useQueryClient();
    // Состояния для отслеживания видимости модальных окон и текущей задачи
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    // Функции для открытия модальных окон редактирования и удаления
    const openEditModal = (taskId) => {
        setIsEditModalVisible(true);
        setCurrentTaskId(taskId);
    };

    const openDeleteModal = (taskId) => {
        setIsDeleteModalVisible(true);
        setCurrentTaskId(taskId);
    };

    // Функции для закрытия модальных окон редактирования и удаления
    const closeEditModal = () => {
        setIsEditModalVisible(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    // Функция для отображения модального окна редактирования
    const renderEditModal = () => {
        return isEditModalVisible && <EditTask close={closeEditModal} taskId={currentTaskId} />;
    };

    // Функция для отображения модального окна удаления
    const renderDeleteModal = () => {
        return isDeleteModalVisible && <DeleteTask close={closeDeleteModal} taskId={currentTaskId} />;
    };

    // Хук React Query для получения данных о задачах из локального хранилища
    const { data: tasks, isLoading, isError } = useQuery('tasks', fetchTasksFromLocalStorage);

    // Хук React Query для обновления статуса задачи с использованием мутации
    const mutationUpdateTaskStatus = useMutation(updateTaskStatusInLocalStorage, {
        // Обновляем данные в QueryClient после успешного выполнения мутации
        onSuccess: (updatedTasks) => {
            queryClient.setQueryData('tasks', updatedTasks);
        },
    });

    // Обработчик изменения состояния чекбокса задачи
    const handleCheckboxChange = (taskId, completed) => {
        // Вызываем мутацию для обновления статуса задачи
        mutationUpdateTaskStatus.mutate({ taskId, completed: !completed });
    };

    // Обработчик изменения значения в поле поиска
    const handleSearchInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    // Фильтруем задачи в соответствии с введенным текстом в поле поиска
    const filteredTasks = tasks
        ? tasks.filter((task) =>
            task.text.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

    // Выводим сообщение о загрузке, если данные все еще загружаются
    if (isLoading) {
        return <p>Loading...</p>;
    }

    // Выводим сообщение об ошибке, если при загрузке данных произошла ошибка
    if (isError) {
        return <p>Error loading tasks</p>;
    }

    // Возвращаем JSX для отображения списка задач
    return (
        <>
            {renderEditModal()}
            {renderDeleteModal()}
            <Container>
                <h2>Список задач</h2>
                <SearchInput
                    type="text"
                    value={searchValue}
                    onChange={handleSearchInputChange}
                    placeholder="Поиск"
                />
                <ul>
                    {filteredTasks.map((task) => (
                        <TaskItem key={task.id}>
                            <Checkbox
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleCheckboxChange(task.id, task.completed)}
                            />
                            <TaskText completed={task.completed}>{task.text}</TaskText>
                            <EditButton onClick={() => openEditModal(task.id)}>
                                Редактировать
                            </EditButton>
                            <DeleteButton onClick={() => openDeleteModal(task.id)}>
                                Удалить
                            </DeleteButton>
                        </TaskItem>
                    ))}
                </ul>
            </Container>
        </>
    );
};
