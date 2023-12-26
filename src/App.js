// Импортируем компонент AddTask из файла './components/AddTask'.
import { AddTask } from './components/AddTask';

// Импортируем QueryClient, QueryClientProvider из библиотеки react-query.
import { QueryClient, QueryClientProvider } from 'react-query';

// Импортируем компонент TasksList из файла './components/TasksList'.
import { TasksList } from './components/TasksList';

// Создаем новый экземпляр QueryClient для управления состоянием запросов.
const queryClient = new QueryClient();

// Определяем функциональный компонент App.
function App() {
    // Возвращаем JSX разметку приложения.
    return (
        // Оборачиваем приложение в QueryClientProvider и передаем ему созданный queryClient.
        <QueryClientProvider client={queryClient}>
            {/* Общий контейнер, содержащий компоненты AddTask и TasksList. */}
            <div>
                {/* Вставляем компонент AddTask в разметку. */}
                <AddTask />
                {/* Вставляем компонент TasksList в разметку. */}
                <TasksList />
            </div>
        </QueryClientProvider>
    );
}

// Экспортируем компонент App по умолчанию.
export default App;
