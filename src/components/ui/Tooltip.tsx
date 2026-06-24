interface TooltipProps {
label: string
}

const Tooltip = ({ label }: TooltipProps) => {
  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-bottom z-50">
      <div className="bg-zinc-900 text-paper text-[13px] font-medium px-3 py-1.5 rounded-lg shadow-lg shadow-black/20 ring-1 ring-white/10 whitespace-nowrap">
        {label}
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-zinc-900 rotate-45 ring-1 ring-white/10" />
    </div>
  );
};

export default Tooltip
