/*
	Bobatron.js (now -- TS version)
	ver. 2.0

	2.0: Бобатрон тепsерь не мерцает при изменении размеров блока!

	БОБАТРОН ОТ ЛУКОЯНОВА ПАВЛА
	https://github.com/complagaet/Bobatron.js

	Этот скрипт гениален. Он скругляет края практически любого элемента примерно так же, как у Эпла.

	Для выбора цели добавьте класс "bobatron" к необходимому элементу,
	Для запуска скрипта запустите bobatron.scanner().

	По умолчанию скрипт создаёт SVG-маску (mask-image).

	Атрибут "Bt-CM" - множитель радиуса скругления, значение по умолчанию 1.
	Число меньше 1 делает радиус более маленьким.
	Пример: <div class="anyClasses bobatron" Bt-CM="0.7"></div>

	Атрибут "Bt-Color" меняет значение background-image, маска не добавляется.
	Параметр принимает значение цвета в шестнадцатеричном формате, например: #F92B63 или #1A1A1A99 (с альфа-каналом).
	Пример: <div class="anyClasses bobatron" Bt-Color="#F92B63"></div>
*/

type PathViewBox = [string, string];

const bobatronDeprecated = {
    moveXY: (x: number, y: number, cornerMultiplier: number): PathViewBox => {
        x = x * (1 / cornerMultiplier) - 91;
        y = y * (1 / cornerMultiplier) - 91;

        const path = `M ${91 + x} 46 V 34 C ${91 + x} 7 ${84 + x} 0 ${57 + x} 0 H 34 C 7 0 0 7 0 34 V ${
            57 + y
        } C 0 ${84 + y} 7 ${91 + y} 34 ${91 + y} H ${57 + x} C ${84 + x} ${91 + y} ${91 + x} ${
            84 + y
        } ${91 + x} ${57 + y} Z`;
        const viewBox = `0 0 ${91 + x} ${91 + y}`;
        return [path, viewBox];
    },

    toCSSmask: (path_ViewBox: PathViewBox, obj: HTMLElement): void => {
        const css = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="${path_ViewBox[1]}">
			<path d="${path_ViewBox[0]}" fill=""/>
		</svg>`;
        let style = obj.getAttribute('style') ?? '';
        style = bobatron.clearBobatronMasks(style);

        obj.setAttribute(
            'style',
            `${style}-webkit-mask-image: url("data:image/svg+xml,${encodeURIComponent(
                css
            )}"); -webkit-mask-repeat: no-repeat; mask-image: url("data:image/svg+xml,${encodeURIComponent(
                css
            )}"); mask-repeat: no-repeat`
        );
    },
};

const bobatron = {
    ...bobatronDeprecated,

    toCSSbackground: (
        path_ViewBox: PathViewBox,
        color: string,
        obj: HTMLElement
    ): void => {
        const css = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="${path_ViewBox[1]}">
			<path d="${path_ViewBox[0]}" fill="${color}"/>
		</svg>`;
        obj.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(css)}")`;
    },

    makeClipPath: (x: number, y: number, cornerMultiplier: number): string => {
        x = x * (1 / cornerMultiplier) - 91;
        y = y * (1 / cornerMultiplier) - 91;

        const path = `M ${91 + x} 46 V 34 C ${91 + x} 7 ${84 + x} 0 ${57 + x} 0 H 34 C 7 0 0 7 0 34 V ${
            57 + y
        } C 0 ${84 + y} 7 ${91 + y} 34 ${91 + y} H ${57 + x} C ${84 + x} ${91 + y} ${91 + x} ${
            84 + y
        } ${91 + x} ${57 + y} Z`;

        return path.replace(
            /-?\d*\.?\d+/g,
            (n) => `${parseFloat(n) * cornerMultiplier}`
        );
    },

    applyClipPath: (path: string, obj: HTMLElement): void => {
        let style = obj.getAttribute('style') ?? '';
        style = bobatron.clearBobatronMasks(style);
        obj.setAttribute('style', `${style} clip-path: path('${path}');`);
    },

    clearBobatronMasks: (style: string): string => {
        const filtered = style
            .split(';')
            .filter((s) => s && !s.includes('mask-') && !s.includes('clip-'));
        return filtered.length ? filtered.join(';') + '; ' : '';
    },

    scanner: (): void => {
        Array.from(document.getElementsByClassName('bobatron')).forEach(
            (el) => {
                bobatron.apply(el as HTMLElement);
            }
        );
    },

    calculateCornerMultiplier: (object: HTMLElement): number => {
        const cmAttr = object.getAttribute('Bt-CM');
        let cm: number;
        const borderRadius = parseFloat(
            window.getComputedStyle(object).borderRadius
        );

        if (cmAttr !== null) {
            cm = Number(cmAttr);
        } else if (borderRadius) {
            cm = borderRadius * 0.05;
        } else {
            cm = 1;
        }

        return cm;
    },

    apply: (object: HTMLElement): void => {
        const cm = bobatron.calculateCornerMultiplier(object);

        try {
            const color = object.getAttribute('Bt-Color');
            if (color) {
                object.style.backgroundColor = '';
                bobatron.toCSSbackground(
                    bobatron.moveXY(
                        object.offsetWidth,
                        object.offsetHeight,
                        cm
                    ),
                    color,
                    object
                );
            } else {
                const path = bobatron.makeClipPath(
                    object.offsetWidth,
                    object.offsetHeight,
                    cm
                );
                bobatron.applyClipPath(path, object);
            }
        } catch (e) {
            console.error(e);
        }
    },

    clear: (object: HTMLElement): void => {
        try {
            const color = object.getAttribute('Bt-Color');
            if (color) {
                object.style.backgroundImage = '';
            } else {
                object.style = bobatron.clearBobatronMasks(
                    object.getAttribute('style') ?? ''
                );
            }
        } catch (e) {
            console.log(e);
        }
    },

    clearAll: (): void => {
        Array.from(document.getElementsByClassName('bobatron')).forEach(
            (el) => {
                const element = el as HTMLElement;
                try {
                    const color = element.getAttribute('Bt-Color');
                    if (color) {
                        element.style.backgroundImage = '';
                    } else {
                        element.style = bobatron.clearBobatronMasks(
                            element.getAttribute('style') ?? ''
                        );
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        );
    },
};

export default bobatron;
