import { render, screen } from '@testing-library/react';
import App from './App';

// Определение теста с использованием библиотеки тестирования (например, Jest и Testing Library).
test('renders learn react link', () => {
    // Рендеринг компонента App.
    render(<App />);

    // Поиск элемента, содержащего текст "learn react" (регистронезависимый поиск).
    const linkElement = screen.getByText(/learn react/i);

    // Проверка, что найденный элемент присутствует в документе (в DOM).
    expect(linkElement).toBeInTheDocument();
});

