type ChipProps = {
    label: string;
    color?: string;
};

export default function Chip({ label, color }: ChipProps) {
    return (
        <div
            className={`flex items-center w-fit h-4 pl-2 pr-2 rounded-full`}
            style={{
                backgroundColor: color || 'white',
            }}
        >
            <p className={`text-[12px] leading-3`}>{label}</p>
        </div>
    );
}
