/*
	Bobatron.js
	ver. 2.0

	2.0: Бобатрон теперь не мерцает при изменении размеров блока!

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

const bobatronDeprecated = {
    moveXY: (x, y, cornerMultiplier) => {
        let path, viewBox;
        x = x * (1 / cornerMultiplier) - 91;
        y = y * (1 / cornerMultiplier) - 91;
        path = `M ${91 + x} 46 V 34 C ${91 + x} 7 ${84 + x} 0 ${57 + x} 0 H 34 C 7 0 0 7 0 34 V ${57 + y} C 0 ${84 + y} 7 ${91 + y} 34 ${91 + y} H ${57 + x} C ${84 + x} ${91 + y} ${91 + x} ${84 + y} ${91 + x} ${57 + y} Z`;
        viewBox = `0 0 ${91 + x} ${91 + y}`;
        return [path, viewBox];
    },

    toCSSmask: (path_ViewBox, obj) => {
        let css = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="${path_ViewBox[1]}">
			<path d="${path_ViewBox[0]}" fill=""/>
		</svg>`,
            style = obj.getAttribute('style');
        if (style) {
            style = bobatron.clearBobatronMasks(style);
        } else {
            style = '';
        }

        obj.setAttribute(
            'style',
            `${style}-webkit-mask-image: url("data:image/svg+xml,${encodeURIComponent(css)}"); -webkit-mask-repeat: no-repeat; mask-image: url("data:image/svg+xml,${encodeURIComponent(css)}"); mask-repeat: no-repeat`
        );
    },
};

const bobatron = {
    ...bobatronDeprecated,

    toCSSbackground: (path_ViewBox, color, obj) => {
        let css = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="${path_ViewBox[1]}">
			<path d="${path_ViewBox[0]}" fill="${color}"/>
		</svg>`;
        obj.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(css)}")`;
    },

    makeClipPath: (x, y, cornerMultiplier) => {
        x = x * (1 / cornerMultiplier) - 91;
        y = y * (1 / cornerMultiplier) - 91;
        const path = `M ${91 + x} 46 V 34 C ${91 + x} 7 ${84 + x} 0 ${57 + x} 0 H 34 C 7 0 0 7 0 34 V ${57 + y} C 0 ${84 + y} 7 ${91 + y} 34 ${91 + y} H ${57 + x} C ${84 + x} ${91 + y} ${91 + x} ${84 + y} ${91 + x} ${57 + y} Z`;
        return path.replace(/-?\d*\.?\d+/g, (n) => parseFloat(n) * cornerMultiplier);
    },

    applyClipPath: (path, obj) => {
        let style = obj.getAttribute('style');
        if (style) {
            style = bobatron.clearBobatronMasks(style);
        } else {
            style = '';
        }

        obj.setAttribute('style', `${style} clip-path: path('${path}');`);
    },

    clearBobatronMasks: (style) => {
        style = style.split(';');
        for (let i = 0; i < style.length; i++) {
            if (style[i].includes('mask-') || style[i].includes('clip-')) {
                style[i] = '';
            }
        }
        let style_o = [];
        for (let o of style) {
            if (o !== '') {
                style_o.push(o);
            }
        }
        style = style_o.join(';');
        if (style_o.length !== 0) {
            style += '; ';
        }
        return style;
    },

    scanner: () => {
        for (let i of document.getElementsByClassName('bobatron')) {
            bobatron.apply(i);
        }
    },

    apply: (object) => {
        let cm = object.getAttribute('Bt-CM');
        const borderRadius = parseFloat(window.getComputedStyle(object).borderRadius);

        if (cm != null) {
            cm = Number(cm);
        } else if (borderRadius) {
            cm = borderRadius * 0.05;
        } else {
            cm = 1;
        }

        try {
            if (object.getAttribute('Bt-Color')) {
                object.style.backgroundColor = '';
                bobatron.toCSSbackground(
                    bobatron.moveXY(object.offsetWidth, object.offsetHeight, cm),
                    object.getAttribute('Bt-Color'),
                    object
                );
            } else {
                /*
                bobatron.toCSSmask(
                    bobatron.moveXY(object.offsetWidth, object.offsetHeight, cm),
                    object
                );
            */

                bobatron.applyClipPath(
                    bobatron.makeClipPath(object.offsetWidth, object.offsetHeight, cm),
                    object
                );
            }
            // console.log(object.offsetWidth, object.offsetHeight, object.getAttribute("Bt-Color"), cm)
        } catch (e) {
            console.error(e);
        }
    },

    clear: (object) => {
        try {
            if (object.getAttribute('Bt-Color')) {
                object.style.backgroundImage = '';
            } else {
                object.style = bobatron.clearBobatronMasks(object.getAttribute('style'));
            }
        } catch (e) {
            console.log(e);
        }
    },

    clearAll: () => {
        for (let i = 0, o = document.getElementsByClassName('bobatron'); i < o.length; i++) {
            try {
                if (o[i].getAttribute('Bt-Color')) {
                    o[i].style.backgroundImage = '';
                } else {
                    o[i].style = bobatron.clearBobatronMasks(o[i].getAttribute('style'));
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
};

export default bobatron;
