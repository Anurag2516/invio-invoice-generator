interface SectionHeaderProps {
  label: string;
  subLabel?: string;
}

const SectionHeader = ({ label, subLabel }: SectionHeaderProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex gap-2 items-center">
        <h2 className="text-sm text-brand uppercase font-bold tracking-wider">
          {label}
        </h2>
        {subLabel && (
          <p className="text-xs text-stone-500 tracking-wide">
            {subLabel}
          </p>
        )}
      </div>
      <div className="flex-1 h-[1.8px] bg-[#d4cbbf]" />
    </div>
  );
};

export default SectionHeader;
