import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { IconType } from 'react-icons/lib';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
  icon: LucideIcon | IconType;
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      variant={'transparent'}
      size={'sm'}
      asChild
      className={cn(sidebarItemVariants({ variant }))}
    >
      <Link
        href={`/workspace/${workspaceId}/channel/${id}`}
        className={`flex items-center gap-x-2`}
      >
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
