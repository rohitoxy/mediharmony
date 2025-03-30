
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
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-indigo-50 group-[.toaster]:text-slate-700 group-[.toaster]:border-none group-[.toaster]:shadow-md group-[.toaster]:shadow-primary/10 group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-slate-600",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-slate-600 group-[.toast]:rounded-md",
          title: "group-[.toast]:text-slate-700 group-[.toast]:font-medium",
          error: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50 group-[.toaster]:to-red-100 group-[.toaster]:text-red-600",
          success: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50 group-[.toaster]:to-emerald-50 group-[.toaster]:text-emerald-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
