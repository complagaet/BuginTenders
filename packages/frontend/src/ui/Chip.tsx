type ChipProps = {
    label: string;
    color?: string;
};

export default function Chip({ label, color }: ChipProps) {
    return (
        <div
            className={`flex items-center w-fit h-[16px] pl-[8px] pr-[8px] rounded-full`}
            style={{
                backgroundColor: color || 'white',
            }}
        >
            <p className={`text-[12px] leading-[12px]`}>{label}</p>
        </div>
    );
}
