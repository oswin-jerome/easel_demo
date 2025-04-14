import { getBoardById } from "@/actions/boards";
import WhiteBoard from "./board";
import { console } from "inspector";
import { Metadata } from "next";

// Generate dynamic metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ board_id: string }> }): Promise<Metadata> {
  const { board_id } = await params;

  const board = await getBoardById(board_id);

  return {
    title: board?.title,
    description: "Personal whiteboard for your thoughts",
  };
}
const BoardDetails = async ({ params }: { params: Promise<{ board_id: string }> }) => {
  const { board_id } = await params;
  const board = await getBoardById(board_id);
  if (!board) {
    return <div>Board not found</div>;
  }
  // console.log("Board details:", board);
  return (
    <section>
      <WhiteBoard board={board} />
    </section>
  );
};

export default BoardDetails;
