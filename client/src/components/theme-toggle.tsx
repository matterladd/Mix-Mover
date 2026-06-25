import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const toggle = () => theme === 'dark' ? setTheme('light') : setTheme('dark');
  return (
    <button onClick={toggle}>
      {theme === 'dark' && <HugeiconsIcon icon={Moon} />}
      {theme === 'light' && <HugeiconsIcon icon={Sun} />}
    </button>
  );
}