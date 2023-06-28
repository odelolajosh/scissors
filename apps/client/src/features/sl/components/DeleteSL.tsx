import Button from "@/components/ui/Button";
import { useDeleteSL } from "../api";
import { SL } from "../types";

type DeleteSLProps = {
  sl: SL;
  onClose: () => void;
}

export const DeleteSL: React.FC<DeleteSLProps> = ({ onClose, sl }) => {
  const deleteSL = useDeleteSL();

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await deleteSL.mutateAsync({ sid: sl._id })
    onClose()
  }

  if (!sl) {
    return null
  }

  return (
    <div className="px-6 py-4 mb-6">
      <h2 className="text-3xl font-semibold">Delete {sl.name}?</h2>
      <div className="flex justify-center mt-7 gap-4">
        <Button variant="solid" className="px-8" type="submit" onClick={onClose}>Cancel</Button>
        <Button variant="solid" className="px-8" type="submit" loading={deleteSL.isLoading} onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}