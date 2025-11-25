import { get } from '@/src/lib/requests';

type LocalizedString = {
    kz: string;
    ru: string;
};

type ProductAttribute = {
    name: LocalizedString;
    value: LocalizedString;
    is_main: boolean;
    value_code: string;
    is_tech_spec: boolean;
    is_required_egz: boolean;
    is_required_kgd: boolean;
};

type ProductCategory = {
    id: number;
    name: string;
    code: string | null;
    full_code: string;
    level: number;
    parent: number | null;
    category_type: number;
    image: string | null;
};

type ProductImage = {
    id: number;
    order: number;
    image_url: string;
    hidden: boolean;
};

export type Product = {
    id: number;
    name: string;
    is_domestic: boolean;
    is_social: boolean;
    gtin: string | null;
    kztin_code: string;
    ntin_code: string;
    status: number;
    product_type: number;
    category: ProductCategory;
    images: ProductImage[];
    attributes_dict: Record<string, ProductAttribute>;
};

export default function useProductsSearch() {
    const findProducts = async (q: string) => {
        const response = await get(`/api/search?q=${q}`);
        console.log(response);
        return response;
    };

    return { findProducts };
}
