// Определяем функцию reportWebVitals, которая принимает колбэк-функцию onPerfEntry.
const reportWebVitals = onPerfEntry => {
    // Проверяем, что onPerfEntry существует и является функцией.
    if (onPerfEntry && onPerfEntry instanceof Function) {
        // Асинхронно импортируем библиотеку web-vitals.
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            // Вызываем методы из библиотеки web-vitals, передавая onPerfEntry в качестве колбэка.

            // Cumulative Layout Shift (CLS) - накопленный сдвиг макета.
            getCLS(onPerfEntry);

            // First Input Delay (FID) - задержка первого ввода.
            getFID(onPerfEntry);

            // First Contentful Paint (FCP) - момент отрисовки первого содержимого.
            getFCP(onPerfEntry);

            // Largest Contentful Paint (LCP) - момент отрисовки самого большого содержимого.
            getLCP(onPerfEntry);

            // Time to First Byte (TTFB) - время до получения первого байта от сервера.
            getTTFB(onPerfEntry);
        });
    }
};

// Экспортируем функцию reportWebVitals по умолчанию.
export default reportWebVitals;

