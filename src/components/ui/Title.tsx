const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (

    <div className="bg-amber-500">
        <h2 className={`text-5xl font-bold ${className ? className : ""}`}>
      {children}
    </h2>

    </div>
    
  );
};

export default Title;




