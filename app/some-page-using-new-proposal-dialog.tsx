import { NewProposalDialog } from "@/components/NewProposalDialog"

const SomePageUsingNewProposalDialog = () => {
  return (
    <div>
      <h1>Some Page Using New Proposal Dialog</h1>
      <NewProposalDialog open={false} onOpenChange={() => {}} />
    </div>
  )
}

export default SomePageUsingNewProposalDialog
