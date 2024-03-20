import AOS from "aos";
import "aos/dist/aos.css";

const initializeAOS = () => {
    AOS.init({
        // Các tùy chọn khởi tạo AOS
        offset: 200,
        // once: true
        // disable: 'mobile'
    });
};

export default initializeAOS;