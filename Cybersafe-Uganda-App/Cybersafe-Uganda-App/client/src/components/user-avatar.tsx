import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";

interface UserAvatarProps {
  user: User;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const initials = user.username.charAt(0).toUpperCase();
  
  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
