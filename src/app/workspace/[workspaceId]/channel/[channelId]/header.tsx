import { Button } from '@/components/ui/button';
import { ChevronDown, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useChannelId } from '@/hooks/use-channel-id';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This will permanently delete this channel.'
  );

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = useCurrentMember({ workspaceId });

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return;
    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel deleted!');
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to delete channel');
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success('Channel name updated!');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update channel name');
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={'ghost'}
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
            >
              <span className="truncate"># {title}</span>
              <ChevronDown className="size-2.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {title}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      {member?.role === 'admin' && (
                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                          Edit
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {title}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename this channel</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                    <Input
                      value={value}
                      onChange={(e) => handleChange(e)}
                      disabled={isUpdatingChannel}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="e.g. plan-budget"
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant={'outline'}
                          disabled={isUpdatingChannel}
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isUpdatingChannel}>
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {member?.role === 'admin' && (
                <button
                  onClick={handleDelete}
                  disabled={isRemovingChannel}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                >
                  <Trash className="size-4 " />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
