import { cn } from "@workspace/ui/lib/utils";

interface WidgetHeaderProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  showAvatar?: boolean;
  avatarText?: string;
}

export const WidgetHeader = ({
  children,
  className,
  title,
  subtitle,
  showAvatar = false,
  avatarText = "I",
}: WidgetHeaderProps) => {
  return (
    <header
      className={cn(
        "bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8 text-white relative overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-white/10 blur-lg" />

      <div className="relative z-10">
        {children || (
          <div className="flex items-center gap-4">
            {showAvatar && (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {avatarText}
                </span>
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-lg text-white/90 font-medium">{subtitle}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
