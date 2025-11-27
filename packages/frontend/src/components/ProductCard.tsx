import BobatronContainer from '@/src/ui/BobatronContainer';
import Text from '@/src/ui/Text';
import Button from '@/src/ui/Button';
import { Info } from 'lucide-react';
import { Product } from '@/src/hooks/useProductsSearch';
import { useDictionary } from '@/src/contexts/DictionaryContext';

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { t } = useDictionary();

    return (
        <BobatronContainer
            className={`
                flex min-w-[250px] w-[250px] min-h-[365px]
                bg-white grow-1 rounded-[30px] p-[16px] flex-col gap-[16px]
                justify-between
            `}
        >
            <div className={`flex flex-col gap-[16px] w-full`}>
                <BobatronContainer className={`w-full h-[180px] rounded-[14px]`}>
                    <img
                        className={`w-full h-full object-contain object-center`}
                        src={
                            product.images[0]?.image_url
                                ? product.images[0]?.image_url
                                : '/icons/big-unavailable.svg'
                        }
                        alt={``}
                    />
                </BobatronContainer>
                <Text as={`h2`}>{product.name}</Text>
                <Text as={`p`}>
                    <b>NTIN:</b> {product.ntin_code}
                </Text>
            </div>
            <div className={`flex gap-[10px]`}>
                <Button variant={`custom`} className={`bg-[#CED0FF] hover:bg-[#B0B4FF]`}>
                    <Info size={20} />
                </Button>
                <Button
                    variant={`custom`}
                    className={`w-full justify-center bg-[#9BE890] hover:bg-[#80D674]`}
                >
                    {t('search.findSuppliers')}
                </Button>
            </div>
        </BobatronContainer>
    );
}
