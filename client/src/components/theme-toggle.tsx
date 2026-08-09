import { useTheme } from "@/context/theme/index";
import { Sun, Moon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ThemeToggle({ className }: { className: string }) {
  const { theme, setTheme } = useTheme();
  const toggle = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");
  return (
    <button className={className} onClick={toggle}>
      {theme === "dark" && <HugeiconsIcon icon={Moon} />}
      {theme === "light" && <HugeiconsIcon icon={Sun} />}
    </button>
  );
}
