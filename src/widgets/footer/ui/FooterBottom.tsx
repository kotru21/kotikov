import { FaHeart } from "react-icons/fa";

interface FooterBottomProps {
  year: number;
  brand: string;
}

export function FooterBottom({ year, brand }: FooterBottomProps): React.JSX.Element {
  return (
    <div className="mt-8 border-t-2 border-black pt-8 dark:border-white">
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="text-text-secondary text-sm font-bold dark:text-neutral-400">
          © {year} {brand}.
        </div>

        <div className="text-text-secondary flex items-center space-x-4 text-sm font-bold dark:text-neutral-400">
          <span className="flex items-center">
            Сделано с <FaHeart className="text-primary-500 mx-1 h-4 w-4 animate-pulse motion-reduce:animate-none" /> и Next.js
          </span>
        </div>
      </div>
    </div>
  );
}
