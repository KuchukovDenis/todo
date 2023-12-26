import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
import SaveTask from "./SaveTask";

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

export const AddTask = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const addTaskButtonClick = () => {
        setIsModalVisible(true)
    }

    const closeAlert = () => {
        setIsModalVisible(false);
    }

    const renderModal = () => {
        if (!isModalVisible) {
            return null;
        }

        return (
            <SaveTask close={closeAlert}/>
        );
    }

    return (
        <>
            {renderModal()}
            <AddTaskContainer>
                <AddTaskButton onClick={addTaskButtonClick}>Добавить</AddTaskButton>
            </AddTaskContainer>
        </>
    )
}