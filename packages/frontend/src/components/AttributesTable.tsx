'use client';

import React from 'react';
import { Lang, useDictionary } from '@/src/contexts/DictionaryContext';

interface LangValue {
    kz: string;
    ru: string;
}

interface AttributeItem {
    name: LangValue;
    value: LangValue;
    is_main: boolean;
    value_code: string;
    is_tech_spec: boolean;
    is_required_egz: boolean;
    is_required_kgd: boolean;
}

export interface AttributesDict {
    [key: string]: AttributeItem;
}

export default function AttributesTable({
    attributes,
    lang = 'ru',
}: {
    attributes: AttributesDict;
    lang?: Lang;
}) {
    const { t } = useDictionary();
    const entries = Object.entries(attributes);

    const convertedLangCode = lang === 'kk' ? 'kz' : lang;

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100/70">
                            <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200">
                                {t('text.property')}
                            </th>
                            <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200">
                                {t('text.value')}
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {entries.map(([key, attr], idx) => (
                            <tr key={key} className="transition-colors hover:bg-gray-100">
                                <td className="p-4 text-gray-800 font-medium text-sm">
                                    {attr.name[convertedLangCode]}
                                </td>
                                <td className="p-4 text-gray-700 text-sm">
                                    {attr.value[convertedLangCode]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
