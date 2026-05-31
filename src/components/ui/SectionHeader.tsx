interface SectionHeaderProps {
  label: string;
  subLabel?: string;
}

const SectionHeader = ({ label, subLabel }: SectionHeaderProps) => {
  return (
    <div className="flex gap-2 items-center">
      <h2 className="text-sm text-stone uppercase font-bold tracking-wider">
        {label}
      </h2>
      {subLabel && (
        <p className="text-xs text-stone-500 tracking-wide">{subLabel}</p>
      )}
    </div>
  );
};

export default SectionHeader;
