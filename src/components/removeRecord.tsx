"use client";

import { useState } from "react";
import { TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import type { Session } from '@supabase/auth-helpers-nextjs'

export default function RemoveRecord({ session, id }: { session: Session | null, id: number }) {
  const supabase = createClientComponentClient()

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();

  // REMOVE ITEM
  const handleRemoveRecord = async () => {
    if (!id) return console.log("nothing to delete");
    setLoading(true);
    if (session) {
      const { error : resError } = await supabase.from('records').delete().eq('id', id)

      if(!resError) {
				router.refresh()
				setLoading(false)
			} else {
				console.log(resError)
			}
    }
  };

  if (loading) {
    return (
      <div>
        ...
      </div>
    );
  }

  return (
    <div>
      {confirm ? (
        <button onClick={() => handleRemoveRecord()}>
          <CheckCircleIcon className="h-6 w-6 text-gray-700 hover:text-primary" />
        </button>
      ) : (
        <button onClick={() => setConfirm(true)}>
          <TrashIcon className="h-6 w-6 text-gray-700 hover:text-primary" />
        </button>
      )}
    </div>
  );
}
