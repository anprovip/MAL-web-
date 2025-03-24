import { useInView } from 'react-intersection-observer';

export const useCharacterInView = () => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Chỉ kích hoạt một lần
        threshold: 0.5, // Kích hoạt khi 50% phần tử xuất hiện trong viewport
    });

    return { ref, inView };
};