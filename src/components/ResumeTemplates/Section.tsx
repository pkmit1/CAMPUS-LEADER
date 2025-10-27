import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: ReactNode;
  compact?: boolean;
  noBorder?: boolean;
  dark?: boolean;
  elegant?: boolean;
  creative?: boolean;
  className?: string;
  titleClassName?: string;
  description?: string;
  action?: ReactNode;
}

export const Section = ({ 
  title, 
  children, 
  compact = false, 
  noBorder = false, 
  dark = false,
  elegant = false,
  creative = false,
  className,
  titleClassName,
  description,
  action
}: SectionProps) => {
  const getTitleClass = () => {
    const baseClasses = "font-semibold mb-3";
    
    if (elegant) {
      return cn(
        baseClasses,
        "font-serif text-xl text-gray-900 border-b border-gray-200 pb-2",
        titleClassName
      );
    }
    
    if (creative) {
      return cn(
        baseClasses,
        "font-bold text-lg text-gray-900 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent",
        titleClassName
      );
    }
    
    if (dark) {
      return cn(
        baseClasses,
        "text-lg text-white",
        compact ? "text-md" : "text-lg",
        titleClassName
      );
    }
    
    return cn(
      baseClasses,
      compact ? "text-md" : "text-xl",
      dark ? "text-white" : "text-gray-900",
      titleClassName
    );
  };

  const getSectionClass = () => {
    return cn(
      noBorder ? "" : "mb-6",
      className
    );
  };

  return (
    <section className={getSectionClass()}>
      <div className={cn(
        "flex items-start justify-between",
        (description || action) && "mb-3"
      )}>
        <div className="flex-1">
          <h2 className={getTitleClass()}>{title}</h2>
          {description && (
            <p className={cn(
              "text-sm mt-1",
              dark ? "text-gray-300" : "text-gray-600"
            )}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      <div className={cn(
        dark ? "text-gray-300" : "text-gray-700"
      )}>
        {children}
      </div>
    </section>
  );
};

// Specialized section variants for common use cases

interface ResumeSectionProps extends Omit<SectionProps, 'compact' | 'noBorder'> {
  variant?: 'default' | 'sidebar' | 'main' | 'header';
}

export const ResumeSection = ({ 
  variant = 'default', 
  ...props 
}: ResumeSectionProps) => {
  const variantProps = {
    default: { compact: false, noBorder: false },
    sidebar: { compact: true, noBorder: false },
    main: { compact: false, noBorder: true },
    header: { compact: false, noBorder: true, elegant: true }
  }[variant];

  return <Section {...variantProps} {...props} />;
};

// Grid section for organizing content in columns
interface GridSectionProps extends SectionProps {
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export const GridSection = ({ 
  columns = 2, 
  gap = 'md', 
  children, 
  ...props 
}: GridSectionProps) => {
  const gridClass = cn(
    "grid",
    {
      'grid-cols-1': columns === 1,
      'grid-cols-1 md:grid-cols-2': columns === 2,
      'grid-cols-1 md:grid-cols-3': columns === 3,
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4,
    },
    {
      'gap-4': gap === 'sm',
      'gap-6': gap === 'md',
      'gap-8': gap === 'lg',
    }
  );

  return (
    <Section {...props}>
      <div className={gridClass}>
        {children}
      </div>
    </Section>
  );
};

// Card section for contained content
interface CardSectionProps extends SectionProps {
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
}

export const CardSection = ({ 
  padding = 'md',
  variant = 'default',
  children, 
  ...props 
}: CardSectionProps) => {
  const cardClass = cn(
    "rounded-lg",
    {
      'p-3': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
    },
    {
      'border border-gray-200': variant === 'outline',
      'bg-gray-50': variant === 'filled',
      'bg-white shadow-sm': variant === 'default',
    }
  );

  return (
    <Section {...props}>
      <div className={cardClass}>
        {children}
      </div>
    </Section>
  );
};

// Timeline section for chronological content
interface TimelineSectionProps extends SectionProps {
  items: Array<{
    title: string;
    subtitle?: string;
    period?: string;
    description?: string;
    icon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  }>;
}

export const TimelineSection = ({ 
  items, 
  ...props 
}: TimelineSectionProps) => {
  const getVariantColor = (variant: string = 'primary') => {
    const colors = {
      primary: 'bg-blue-500 border-blue-500',
      secondary: 'bg-gray-500 border-gray-500',
      success: 'bg-green-500 border-green-500',
      warning: 'bg-yellow-500 border-yellow-500',
      error: 'bg-red-500 border-red-500',
    };
    return colors[variant as keyof typeof colors] || colors.primary;
  };

  return (
    <Section {...props}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="flex">
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full border-4 border-white z-10 flex items-center justify-center",
                getVariantColor(item.variant)
              )}>
                {item.icon || (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="font-semibold text-gray-900">{item.title}</div>
                {item.subtitle && (
                  <div className="text-gray-600">{item.subtitle}</div>
                )}
                {item.period && (
                  <div className="text-xs text-gray-500">{item.period}</div>
                )}
                {item.description && (
                  <div className="text-gray-700 mt-1 text-sm">{item.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

// Skills section with progress bars
interface SkillsSectionProps extends SectionProps {
  skills: Array<{
    name: string;
    level: number;
    category?: string;
  }>;
  showLevel?: boolean;
  variant?: 'bars' | 'tags' | 'list';
}

export const SkillsSection = ({ 
  skills, 
  showLevel = true,
  variant = 'bars',
  ...props 
}: SkillsSectionProps) => {
  const getLevelColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 60) return 'bg-blue-500';
    if (level >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelText = (level: number) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    return 'Beginner';
  };

  if (variant === 'tags') {
    return (
      <Section {...props}>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                skill.level >= 80 && "bg-green-100 text-green-800",
                skill.level >= 60 && skill.level < 80 && "bg-blue-100 text-blue-800",
                skill.level >= 40 && skill.level < 60 && "bg-yellow-100 text-yellow-800",
                skill.level < 40 && "bg-red-100 text-red-800"
              )}
            >
              {skill.name}
              {showLevel && (
                <span className="ml-1 text-xs opacity-75">
                  ({getLevelText(skill.level)})
                </span>
              )}
            </span>
          ))}
        </div>
      </Section>
    );
  }

  if (variant === 'list') {
    return (
      <Section {...props}>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              {showLevel && (
                <span className="text-xs text-gray-500">{getLevelText(skill.level)}</span>
              )}
            </div>
          ))}
        </div>
      </Section>
    );
  }

  // Default: bars variant
  return (
    <Section {...props}>
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">{skill.name}</span>
              {showLevel && (
                <span className="text-gray-500">
                  {skill.level}% • {getLevelText(skill.level)}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  getLevelColor(skill.level)
                )}
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// Contact info section
interface ContactSectionProps extends SectionProps {
  items: Array<{
    type: 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'website';
    value: string;
    label?: string;
  }>;
  variant?: 'vertical' | 'horizontal' | 'compact';
}

export const ContactSection = ({ 
  items, 
  variant = 'vertical',
  ...props 
}: ContactSectionProps) => {
  const getIcon = (type: string) => {
    const icons = {
      email: "📧",
      phone: "📱",
      location: "📍",
      linkedin: "💼",
      github: "🐙",
      website: "🌐",
    };
    return icons[type as keyof typeof icons] || "•";
  };

  const containerClass = cn(
    "space-y-2",
    variant === 'horizontal' && "flex flex-wrap gap-4",
    variant === 'compact' && "space-y-1"
  );

  return (
    <Section {...props}>
      <div className={containerClass}>
        {items.map((item, index) => (
          <div 
            key={index}
            className={cn(
              "flex items-center text-sm",
              variant === 'horizontal' && "flex-shrink-0",
              variant === 'compact' && "text-xs"
            )}
          >
            <span className="mr-2">{getIcon(item.type)}</span>
            <span className={cn(
              "text-gray-700",
              variant === 'compact' && "text-xs"
            )}>
              {item.label || item.value}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Section;