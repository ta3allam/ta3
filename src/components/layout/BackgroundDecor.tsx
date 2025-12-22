
import booksIcon from '@/components/assets/books-svgrepo-com.svg';
import studentGradIcon from '@/components/assets/student-graduating-svgrepo-com.svg';
import teacherIcon from '@/components/assets/teacher-svgrepo-com.svg';
import studentDanceIcon from '@/components/assets/student-graduation-dance-svgrepo-com.svg';

const BackgroundDecor = () => {
    const icons = [
        booksIcon,
        studentGradIcon,
        teacherIcon,
        studentDanceIcon,
        booksIcon,
        studentDanceIcon,
    ];

    // Fixed positions for a "minimal pattern" look
    const positions = [
        { top: '10%', left: '5%', rotate: '15deg', size: '120px' },
        { top: '20%', right: '10%', rotate: '-10deg', size: '150px' },
        { bottom: '15%', left: '10%', rotate: '5deg', size: '140px' },
        { bottom: '10%', right: '15%', rotate: '-15deg', size: '130px' },
        { top: '45%', left: '15%', rotate: '20deg', size: '100px' },
        { top: '50%', right: '5%', rotate: '-20deg', size: '110px' },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
            {/* The icons layer */}
            <div className="absolute inset-0">
                {positions.map((pos, index) => (
                    <div
                        key={index}
                        className="absolute transition-all duration-1000 ease-in-out"
                        style={{
                            ...pos,
                            width: pos.size,
                            height: pos.size,
                            opacity: 0.1,
                            filter: 'brightness(0.8)',
                        }}
                    >
                        <img
                            src={icons[index % icons.length]}
                            alt="decoration"
                            className="w-full h-full object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Subtle grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>
        </div>
    );
};

export default BackgroundDecor;
