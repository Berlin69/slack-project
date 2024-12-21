'use client';

import { useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import VerificationInput from 'react-verification-input';
import { Loader } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useJoin } from '@/features/workspaces/api/use-join';

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          toast.success('Joined workspace!');
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error('Failed to join workspace');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white rounded-lg shadow-md">
      <Image src={'/logo-slack.png'} alt="logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md ">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              'flex gap-2',
              isPending && 'opacity-50 cursor-not-allowed'
            ),
            character:
              'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className="flex gap-x-4">
        <Button variant={'outline'} size={'lg'} asChild>
          <Link href={'/'}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
