import { useState } from "react";
import { useUser } from "@/lib/auth";
import { Helmet } from "react-helmet-async";
import { SLList } from "../components/SLList";
import Modal from "@/components/common/Modal";
import { CreateSL, DeleteSL } from "../components";
import { SL } from "../types";

type Modals = {
  create: undefined;
  delete: SL;
}

export function Home() {
  const [modal, setModal] = useState<{ name: keyof Modals; data: Modals[keyof Modals] } | null>(null)
  const user = useUser();

  const username = user?.data?.username || user?.data?.email?.split("@")[0] || 'There'

  const closeModal = () => setModal(null)
  const openModal = (modal: keyof Modals, data?: Modals[keyof Modals]) => setModal({ name: modal, data })

  return (
    <div className="py-10">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h3>Hi<br /><span className="font-bold text-4xl">{username} 👋🏽</span></h3>
      <div className="mt-8">
        <SLList onCreate={() => openModal('create')} onDelete={(sl: SL) => openModal('delete', sl)} />
      </div>
      <Modal open={modal?.name === 'create'} onClose={closeModal}>
        <CreateSL onClose={closeModal} />
      </Modal>
      <Modal open={modal?.name === 'delete'} onClose={closeModal}>
        <DeleteSL sl={modal?.data!!} onClose={closeModal} />
      </Modal>
    </div>
  )
}