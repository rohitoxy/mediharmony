
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#D3E4FD] group-[.toaster]:text-slate-700 group-[.toaster]:border-none group-[.toaster]:shadow-md group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-slate-600",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-slate-600 group-[.toast]:rounded-md",
          title: "group-[.toast]:text-slate-700 group-[.toast]:font-medium",
          error: "group-[.toaster]:bg-red-100 group-[.toaster]:text-red-600",
          success: "group-[.toaster]:bg-[#E1F5E9] group-[.toaster]:text-emerald-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
