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

const fetchTasksFromLocalStorage = async () => {
    return JSON.parse(localStorage.getItem('tasks')) || [];
};

const updateTaskStatusInLocalStorage = async ({ taskId, completed }) => {
    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = existingTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return updatedTasks;
};

export const TasksList = () => {
    const queryClient = useQueryClient();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const openEditModal = (taskId) => {
        setIsEditModalVisible(true);
        setCurrentTaskId(taskId);
    };

    const openDeleteModal = (taskId) => {
        setIsDeleteModalVisible(true);
        setCurrentTaskId(taskId);
    };

    const closeEditModal = () => {
        setIsEditModalVisible(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    const renderEditModal = () => {
        return isEditModalVisible && <EditTask close={closeEditModal} taskId={currentTaskId} />;
    };

    const renderDeleteModal = () => {
        return isDeleteModalVisible && <DeleteTask close={closeDeleteModal} taskId={currentTaskId} />;
    };

    const { data: tasks, isLoading, isError } = useQuery('tasks', fetchTasksFromLocalStorage);

    const mutationUpdateTaskStatus = useMutation(updateTaskStatusInLocalStorage, {
        onSuccess: (updatedTasks) => {
            queryClient.setQueryData('tasks', updatedTasks);
        },
    });

    const handleCheckboxChange = (taskId, completed) => {
        mutationUpdateTaskStatus.mutate({ taskId, completed: !completed });
    };

    const handleSearchInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const filteredTasks = tasks
        ? tasks.filter((task) =>
            task.text.toLowerCase().includes(searchValue.toLowerCase())
        )
        : [];

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error loading tasks</p>;
    }

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
