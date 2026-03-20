function BorderAnimatedContainer({ children }) {
  return (
    <div className="w-full h-full rounded-2xl border border-slate-300 bg-slate-900 flex overflow-hidden">
      {children}
    </div>
  );
}

export default BorderAnimatedContainer;