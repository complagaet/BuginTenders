import { ReactNode, useEffect, useRef, useState } from 'react';

interface TransitionSwitcherProps {
    trigger: any;
    children: ReactNode;
    className?: string;
}

export default function TransitionSwitcher({
    trigger,
    children,
    className = '',
}: TransitionSwitcherProps) {
    const [currentChildren, setCurrentChildren] = useState<ReactNode>(children);
    const [isAnimating, setIsAnimating] = useState(false);

    const prevTrigger = useRef(trigger);

    useEffect(() => {
        if (prevTrigger.current === trigger) return;

        prevTrigger.current = trigger;
        setIsAnimating(true);

        const timeout = setTimeout(() => {
            setCurrentChildren(children);
            setIsAnimating(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [trigger, children]);

    return (
        <div
            className={`flex w-fit h-fit duration-300 ${
                isAnimating ? 'scale-75 opacity-0 blur-xl' : ''
            } ${className}`}
        >
            {currentChildren}
        </div>
    );
}
