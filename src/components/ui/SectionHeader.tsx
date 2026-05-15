interface SectionHeaderProps {
    label: string
}

const SectionHeader = ({ label }: SectionHeaderProps) => {
  return (
    <h2 className="text-base text-stone-700 uppercase font-bold tracking-wider">
      {label}
    </h2>
  );
};

export default SectionHeader
