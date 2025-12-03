/* eslint-disable react-hooks/refs */
/*
    setter={setAndSaveLang}
    selected={lang}
    list={['kk', 'ru']}
*/

'use client';

import { Children, cloneElement, useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import BobatronContainer from '../ui/BobatronContainer';

export default function DropdownSelector(props) {
    const childrenList = Children.toArray(props.children);
    const gap = props.gap || 10;
    const gapMultiplier = 4;

    const pushingDown = !(props.noPushingDown || false);
    const underlay = !(props.noUnderlay || false);

    const selectedChildrenRef = useRef(null);
    const ref = useRef(null);

    const [selected, setSelected] = useState(props.list.indexOf(props.selected));
    const [selectedHeight, setSelectedHeight] = useState(0);
    const [transitionStyles, setTransitionStyles] = useState({});
    const [wrapperStyles, setWrapperStyles] = useState({});
    const [underlayStyles, setUnderlayStyles] = useState({});

    const [opened, setOpened] = useState(false);

    function setter(item) {
        props.setter(item);
        toggleOpen();
    }

    function toggleOpen() {
        setOpened(false);
        if (opened) {
            setTransitionStyles({
                display: `flex`,
                opacity: 0,
                top: `${selectedHeight + gap * gapMultiplier}px`,
                gap: `${gap * gapMultiplier}px`,
            });
            setWrapperStyles({
                padding: `0px`,
            });
            setUnderlayStyles({
                ...underlayStyles,
                opacity: 0,
                top: `${selectedHeight}px`,
            });
            setTimeout(() => {
                setTransitionStyles({});
                setUnderlayStyles({});
            }, 300);
        } else {
            setTransitionStyles({
                display: `flex`,
                opacity: 0,
                top: `${selectedHeight + gap * gapMultiplier}px`,
                gap: `${gap * gapMultiplier}px`,
            });
            setWrapperStyles({
                margin: pushingDown ? `${gap}px ${gap}px 0 ${gap}px` : `0 ${gap}px 0 ${gap}px`,
            });
            const _underlayStyles = {
                top: `${-gap}px`,
                width: `${selectedChildrenRef.current.offsetWidth + gap * 2}px`,
                height: `${selectedHeight * props.list.length + gap * props.list.length + gap}px`,
                backdropFilter: 'blur(10px)',
            };
            setUnderlayStyles({
                ..._underlayStyles,
            });
            requestAnimationFrame(() => {
                setTransitionStyles({
                    display: `flex`,
                });
                setUnderlayStyles({
                    ..._underlayStyles,
                    transitionDuration: `300ms`,
                    opacity: '100%',
                });
                setOpened(true);
            });
        }
    }

    useEffect(() => {
        setSelected(props.list.indexOf(props.selected));
    }, [props.selected]);

    useEffect(() => {
        if (selectedChildrenRef.current) {
            setSelectedHeight(selectedChildrenRef.current.offsetHeight);
        }
    }, [selected]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (opened) toggleOpen();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [opened]);

    return (
        <div
            ref={ref}
            style={{ ...wrapperStyles, gap: `${gap}px` }}
            className={`flex flex-col relative duration-300 top-0 z-2`}
        >
            <BobatronContainer
                style={{
                    top: `${selectedHeight}px`,
                    transform: `translateX(-${gap}px)`,
                    ...underlayStyles,
                }}
                className={`absolute bg-[#fff6] opacity-0 rounded-[20px] ${underlay ? '' : '!hidden'}`}
            ></BobatronContainer>

            <div
                className={`flex items-center gap-[4px] z-3`}
                ref={selectedChildrenRef}
                onClick={() => toggleOpen()}
            >
                {props.chevronPosition === `left` && (
                    <ChevronDown
                        className={`transition-transform duration-300 ${opened ? 'rotate-180' : ''}`}
                    />
                )}
                {childrenList[selected]}
                {props.chevronPosition === `right` && (
                    <ChevronDown
                        className={`transition-transform duration-300 ${opened ? 'rotate-180' : ''}`}
                    />
                )}
            </div>

            <div
                className={`hidden duration-300 flex-col absolute`}
                style={{
                    top: `${selectedHeight + gap}px`,
                    gap: `${gap}px`,
                    right: props.chevronPosition === `left` ? `${gap}px` : '', // тут типа раз шеврон слева значит скорее всего мы хотим прижаться вправо
                    ...transitionStyles,
                }}
            >
                {childrenList.map((item, i) => {
                    if (props.list[i] !== props.list[selected]) {
                        return cloneElement(item, {
                            i_id: i,
                            onClick: props.setter
                                ? () => {
                                      setter(props.list[i]);
                                  }
                                : item.props.onClick,
                        });
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
