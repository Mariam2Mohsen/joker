export const FormSection = ({ children, cols = 3 }) => {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }[cols];

  return <div className={`grid ${colClass} gap-3 sm:gap-4`}>{children}</div>;
};