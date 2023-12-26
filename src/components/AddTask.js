// Импорт React и хука useState из библиотеки React
import React, { useState } from 'react';

// Импорт хука useQueryClient из библиотеки React Query для работы с QueryClient
import { useQueryClient } from 'react-query';

// Импорт библиотеки styled-components для стилизации компонентов с использованием CSS в JS
import styled from 'styled-components';

// Импорт компонента SaveTask из файла SaveTask.js
import SaveTask from "./SaveTask";

// Определение стилизованного компонента AddTaskContainer с помощью styled-components
const AddTaskContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;


const AddTaskButton = styled.button`
  display: flex;
  padding: 7px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background-color: dodgerblue;
  color: #fff;
  margin-left: 1070px;
  margin-top: 93px;
  position: absolute;

  &:hover {
    background-color: #45a049;
  }
`;

// Компонент для добавления новой задачи
export const AddTask = () => {
    // Состояние для отслеживания видимости модального окна
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Обработчик клика по кнопке "Добавить", открывает модальное окно
    const addTaskButtonClick = () => {
        setIsModalVisible(true);
    };

    // Функция для закрытия модального окна
    const closeAlert = () => {
        setIsModalVisible(false);
    };

    // Функция для отображения модального окна, если оно видимо
    const renderModal = () => {
        if (!isModalVisible) {
            return null;
        }

        // Возвращаем компонент для сохранения задачи, передавая функцию закрытия
        return <SaveTask close={closeAlert} />;
    };

    // Возвращаем JSX для отображения компонента
    return (
        <>
            {renderModal()}
            <AddTaskContainer>
                <AddTaskButton onClick={addTaskButtonClick}>Добавить</AddTaskButton>
            </AddTaskContainer>
        </>
    );
};
