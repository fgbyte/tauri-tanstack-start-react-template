import { Button } from "./ui/button";

interface RoundedButtonProps {
  onClick: () => void;
  title: string;
}

export const RoundedButton: React.FC<RoundedButtonProps> = ({
  onClick,
  title,
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full bg-linear-to-r from-teal-500 to-cyan-500 transition-colors flex items-center text-neutral-800 border border-transparent hover:border-green-200 hover:text-neutral-900"
    >
      {title}
    </Button>
  );
};
