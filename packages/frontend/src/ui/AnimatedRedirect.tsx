import React, { cloneElement, ReactElement } from 'react';
import { useUI } from '@/src/contexts/UIContext';
import Text from '@/src/ui/Text';

interface AnimatedRedirectProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function AnimatedRedirect({ href, children, className }: AnimatedRedirectProps) {
    const { setPage, setShowOverlay } = useUI();

    function redirectToPage(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setPage('loading');
        setShowOverlay(true);

        setTimeout(() => {
            window.location.href = href;
        }, 600);
    }

    let child = children;

    if (React.isValidElement(children)) {
        const element = children as ReactElement<any>;

        if (element.type === Text) {
            child = cloneElement(element, {
                className: `${element.props.className || ''} hover:underline`,
            });
        }
    }

    return (
        <a href={href} onClick={redirectToPage} className={className}>
            {child}
        </a>
    );
}
