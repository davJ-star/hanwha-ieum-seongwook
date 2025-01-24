// components/common/PageContainer.tsx
interface PageContainerProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
  }
  
  const PageContainer = ({ children, title, className }: PageContainerProps) => {
    return (
      <div className={`page-container ${className || ''}`}>
        {title && <h1>{title}</h1>}
        {children}
      </div>
    );
  };