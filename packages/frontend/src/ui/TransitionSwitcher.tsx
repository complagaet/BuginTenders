import { ReactNode, useEffect, useRef, useState } from 'react';

interface TransitionSwitcherProps {
    trigger: any;
    children: ReactNode;
    className?: string;
    duration?: number;
}

export default function TransitionSwitcher({
    trigger,
    children,
    className = '',
    duration = 300,
}: TransitionSwitcherProps) {
    const [currentChildren, setCurrentChildren] = useState<ReactNode>(children);
    const [animating, setAnimating] = useState(false);

    const prevTrigger = useRef(trigger);

    useEffect(() => {
        if (prevTrigger.current === trigger) return;

        prevTrigger.current = trigger;
        setAnimating(true);

        const timeout = setTimeout(() => {
            setCurrentChildren(children);
            setAnimating(false);
        }, duration);

        return () => clearTimeout(timeout);
    }, [trigger]);

    return (
        <div
            className={`
                flex w-fit h-fit transition-all duration-${duration}
                ${animating ? 'scale-75 opacity-0 blur-xl' : 'scale-100 opacity-100 blur-0'}
                ${className}
            `}
        >
            {currentChildren}
        </div>
    );
}
